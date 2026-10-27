#!/usr/bin/env python3
"""
Motor de liquidacion cedular determinista - Formulario 210 (persona natural residente).

Toda la aritmetica de la declaracion vive aqui. El modelo de lenguaje clasifica e
interroga; NO suma. Cada operacion queda registrada en la memoria de calculo (trace)
con su norma, para que el resultado sea auditable linea por linea.

Uso:
    python3 liquidador.py caso.json [--params ag2025.json] [--json salida.json]
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from typing import Any

CERO = Decimal(0)
PARAMS_DIR = Path(__file__).resolve().parent.parent / "params"


# ─────────────────────────── utilidades de dinero ────────────────────────────

def pesos(valor: Any) -> Decimal:
    """Convierte a Decimal en pesos enteros (la DIAN no maneja centavos)."""
    if valor is None or valor == "":
        return CERO
    return Decimal(str(valor)).quantize(Decimal("1"), rounding=ROUND_HALF_UP)


def aprox_mil(valor: Decimal) -> Decimal:
    """Aproxima al multiplo de mil mas cercano (art. 577 ET: las declaraciones se
    presentan aproximando al multiplo de mil mas cercano)."""
    return (valor / 1000).quantize(Decimal("1"), rounding=ROUND_HALF_UP) * 1000


def fmt(valor: Decimal) -> str:
    return f"${valor:,.0f}".replace(",", ".")


# ─────────────────────────────── parametros ──────────────────────────────────

class Parametros:
    def __init__(self, data: dict):
        self.d = data
        self.uvt = pesos(data["uvt"]["anio_gravable"])
        self.uvt_presentacion = pesos(data["uvt"]["anio_presentacion"])

    @classmethod
    def cargar(cls, ruta: str | Path | None = None, anio: int = 2025) -> "Parametros":
        ruta = Path(ruta) if ruta else PARAMS_DIR / f"ag{anio}.json"
        return cls(json.loads(Path(ruta).read_text(encoding="utf-8")))

    def en_pesos(self, uvts: float | int | None) -> Decimal:
        if uvts is None:
            return CERO
        return pesos(Decimal(str(uvts)) * self.uvt)

    def a_uvt(self, valor: Decimal) -> Decimal:
        return (valor / self.uvt).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    def beneficio(self, clave: str) -> dict:
        return self.d["beneficios"][clave]


# ──────────────────────────── memoria de calculo ─────────────────────────────

@dataclass
class Paso:
    seccion: str
    concepto: str
    valor: Decimal
    formula: str = ""
    norma: str = ""
    nota: str = ""

    def dict(self) -> dict:
        return {
            "seccion": self.seccion,
            "concepto": self.concepto,
            "valor": int(self.valor),
            "valor_fmt": fmt(self.valor),
            "formula": self.formula,
            "norma": self.norma,
            "nota": self.nota,
        }


@dataclass
class Resultado:
    trace: list[Paso] = field(default_factory=list)
    valores: dict[str, Decimal] = field(default_factory=dict)
    alertas: list[str] = field(default_factory=list)
    desenlace: str = ""
    # Casilla 140 del 210: se marca cuando los costos superan el tope indicativo
    # del 60% del art. 336-1 ET.
    casilla_140: bool = False
    pct_costos_336_1: Decimal | None = None

    def registrar(self, seccion, concepto, valor, formula="", norma="", nota="", clave=None):
        valor = pesos(valor)
        self.trace.append(Paso(seccion, concepto, valor, formula, norma, nota))
        if clave:
            self.valores[clave] = valor
        return valor

    def v(self, clave: str) -> Decimal:
        return self.valores.get(clave, CERO)

    def dict(self) -> dict:
        return {
            "valores": {k: int(v) for k, v in self.valores.items()},
            "valores_fmt": {k: fmt(v) for k, v in self.valores.items()},
            "memoria_calculo": [p.dict() for p in self.trace],
            "alertas": self.alertas,
            "desenlace": self.desenlace,
            "casilla_140": self.casilla_140,
            "pct_costos_336_1": (float(self.pct_costos_336_1)
                                 if self.pct_costos_336_1 is not None else None),
        }


# ────────────────────────────── tabla del 241 ────────────────────────────────

def impuesto_tabla_241(base: Decimal, p: Parametros) -> tuple[Decimal, str]:
    """Aplica la tabla del art. 241 ET. Devuelve (impuesto en pesos, formula legible)."""
    base_uvt = base / p.uvt
    for rango in p.d["tabla_renta_241"]["rangos"]:
        desde = Decimal(str(rango["desde"]))
        hasta = Decimal(str(rango["hasta"])) if rango["hasta"] is not None else None
        if base_uvt > desde and (hasta is None or base_uvt <= hasta):
            tarifa = Decimal(str(rango["tarifa"]))
            adicion = Decimal(str(rango["impuesto_base_uvt"]))
            impuesto_uvt = (base_uvt - desde) * tarifa + adicion
            formula = (
                f"({base_uvt:.2f} UVT - {desde} UVT) x {tarifa:.0%} "
                f"+ {adicion} UVT = {impuesto_uvt:.2f} UVT"
            )
            return pesos(impuesto_uvt * p.uvt), formula
    return CERO, f"{base_uvt:.2f} UVT esta en el rango exento (0 a 1090 UVT): tarifa 0%"


# ────────────────────────────── cedula general ───────────────────────────────

def _sub(caso: dict, nombre: str) -> dict:
    return caso.get(nombre) or {}


def liquidar_cedula_general(caso: dict, p: Parametros, r: Resultado) -> Decimal:
    S = "Cedula general"
    trabajo = _sub(caso, "rentas_trabajo")
    capital = _sub(caso, "rentas_capital")
    no_lab = _sub(caso, "rentas_no_laborales")

    # ── Ingresos brutos ──
    ing_trabajo = pesos(trabajo.get("ingresos_brutos"))
    ing_capital = pesos(capital.get("ingresos_brutos"))
    ing_no_lab = pesos(no_lab.get("ingresos_brutos"))
    ing_total = r.registrar(
        S, "Ingresos brutos de la cedula general", ing_trabajo + ing_capital + ing_no_lab,
        f"trabajo {fmt(ing_trabajo)} + capital {fmt(ing_capital)} + no laborales {fmt(ing_no_lab)}",
        "Art. 335 ET", clave="cg_ingresos_brutos")

    # Cada cedula se guarda por separado: el formulario 210 pide los ingresos brutos
    # de trabajo (32), de capital (58) y no laborales (74) en casillas distintas.
    r.valores["cg_trabajo_ingresos"] = ing_trabajo
    r.valores["cg_capital_ingresos"] = ing_capital
    r.valores["cg_no_laborales_ingresos"] = ing_no_lab

    # ── Ingresos no constitutivos de renta (INCRNGO) ──
    incr = CERO
    detalle_incr = []
    incr_por_cedula = {"trabajo": CERO, "capital": CERO, "no laborales": CERO}
    for sub, etiqueta in ((trabajo, "trabajo"), (capital, "capital"), (no_lab, "no laborales")):
        for k in ("aportes_obligatorios_salud", "aportes_obligatorios_pension",
                  "aportes_fsp", "otros_incrngo", "devoluciones_rebajas_descuentos"):
            val = pesos(sub.get(k))
            if val:
                incr += val
                incr_por_cedula[etiqueta] += val
                detalle_incr.append(f"{k} ({etiqueta}) {fmt(val)}")
    r.valores["cg_trabajo_incrngo"] = incr_por_cedula["trabajo"]
    r.valores["cg_capital_incrngo"] = incr_por_cedula["capital"]
    r.valores["cg_no_laborales_incrngo"] = incr_por_cedula["no laborales"]
    incr = r.registrar(
        S, "Ingresos no constitutivos de renta ni ganancia ocasional", incr,
        " + ".join(detalle_incr) or "sin aportes reportados",
        "Arts. 55 y 56 ET", clave="cg_incrngo")

    # ── Costos y gastos (solo capital y no laborales; honorarios con costos) ──
    costos = CERO
    costos_por_cedula = {"trabajo": CERO, "capital": CERO, "no laborales": CERO}
    for sub, etiqueta in ((capital, "capital"), (no_lab, "no laborales"), (trabajo, "trabajo")):
        val = pesos(sub.get("costos_gastos"))
        if val:
            costos += val
            costos_por_cedula[etiqueta] = val
            if etiqueta == "trabajo":
                r.alertas.append(
                    "Se imputaron costos y gastos a rentas de trabajo: eso excluye la renta "
                    "exenta del 25% sobre esos honorarios (art. 206 num. 10, par. 2)."
                )
    r.valores["cg_trabajo_costos"] = costos_por_cedula["trabajo"]
    r.valores["cg_capital_costos"] = costos_por_cedula["capital"]
    r.valores["cg_no_laborales_costos"] = costos_por_cedula["no laborales"]

    # Art. 336-1 ET: los costos de las rentas de trabajo que no vienen de una relacion
    # laboral se estiman en el 60% de los ingresos brutos. Pasarse de ahi obliga a
    # marcar la casilla 140 del 210 y a tener el soporte listo.
    tope_336_1 = Decimal("0.60")
    if costos_por_cedula["trabajo"] and ing_trabajo:
        pct = costos_por_cedula["trabajo"] / ing_trabajo
        r.pct_costos_336_1 = pct
        if pct > tope_336_1:
            r.casilla_140 = True
            r.alertas.append(
                f"Los costos imputados a rentas de trabajo por honorarios son el "
                f"{pct * 100:.1f}% de los ingresos brutos y superan el tope indicativo "
                f"del 60% del art. 336-1 ET. Hay que marcar la casilla 140 del formulario "
                f"210 y tener listo el soporte de cada costo: la DIAN prioriza el control "
                f"sobre estas declaraciones."
            )

    costos = r.registrar(S, "Costos y gastos procedentes", costos,
                         "Solo rentas de capital y no laborales (y honorarios con costos)",
                         "Art. 336 num. 2 ET", clave="cg_costos")

    # ── Renta liquida: base del limite del 40% ──
    base_limite = max(CERO, ing_total - incr - costos)
    r.registrar(S, "Renta liquida de la cedula general (base del limite)", base_limite,
                f"{fmt(ing_total)} - {fmt(incr)} - {fmt(costos)}",
                "Art. 336 ET", clave="cg_base_limite")

    # ── Bloque sujeto al limite 40% / 1.340 UVT ──
    limitados: list[tuple[str, Decimal, str]] = []

    ded = _sub(caso, "deducciones")
    exe = _sub(caso, "rentas_exentas")

    def agregar(clave_param: str, valor_bruto: Decimal, etiqueta: str, tope_pesos: Decimal | None = None):
        if valor_bruto <= 0:
            return
        b = p.beneficio(clave_param)
        tope = tope_pesos if tope_pesos is not None else p.en_pesos(b.get("tope_uvt_anual"))
        valor = min(valor_bruto, tope) if tope > 0 else valor_bruto
        nota = ""
        if tope > 0 and valor_bruto > tope:
            nota = f"limitado al tope de {b.get('tope_uvt_anual')} UVT ({fmt(tope)}); se pierden {fmt(valor_bruto - tope)}"
        limitados.append((etiqueta, valor, nota))
        r.registrar(S, f"  {etiqueta}", valor,
                    f"declarado {fmt(valor_bruto)}", b.get("norma", ""), nota)

    # Deducciones
    agregar("intereses_vivienda", pesos(ded.get("intereses_vivienda")),
            "Intereses de credito de vivienda")
    agregar("medicina_prepagada", pesos(ded.get("medicina_prepagada")),
            "Medicina prepagada y seguros de salud")
    agregar("icetex", pesos(ded.get("icetex")), "Intereses Icetex")

    gmf_pagado = pesos(ded.get("gmf_pagado"))
    if gmf_pagado:
        b = p.beneficio("gmf_4x1000")
        val = pesos(gmf_pagado * Decimal(str(b["porcentaje_deducible"])))
        limitados.append(("GMF (4x1000) deducible", val, ""))
        r.registrar(S, "  GMF (4x1000) deducible", val,
                    f"50% de {fmt(gmf_pagado)} certificado", b["norma"])

    # Dependientes art. 387 (10% del ingreso bruto laboral, tope 384 UVT)
    n_dep = int(caso.get("contribuyente", {}).get("dependientes") or 0)
    if n_dep > 0 and ing_trabajo > 0:
        b = p.beneficio("dependientes_387")
        tope_pct = pesos(ing_trabajo * Decimal(str(b["porcentaje_ingreso_bruto_laboral"])))
        tope_abs = p.en_pesos(b["tope_uvt_anual"])
        val = min(tope_pct, tope_abs)
        limitados.append(("Dependientes (art. 387)", val, ""))
        r.registrar(S, "  Dependientes (art. 387)", val,
                    f"menor entre 10% de {fmt(ing_trabajo)} = {fmt(tope_pct)} y 384 UVT = {fmt(tope_abs)}",
                    b["norma"])

    # Rentas exentas
    agregar("aportes_voluntarios_pensiones_afc",
            pesos(exe.get("aportes_voluntarios_pension")) + pesos(exe.get("afc")),
            "Aportes voluntarios a pension y AFC")
    agregar("cesantias_voluntarias", pesos(exe.get("cesantias_voluntarias")),
            "Aportes voluntarios a cesantias")

    # Renta exenta del 25% (art. 206 num. 10) - se calcula sobre la base depurada
    exenta_25 = CERO
    if ing_trabajo > 0 and not trabajo.get("costos_gastos"):
        b = p.beneficio("renta_exenta_laboral_25")
        incr_trabajo = sum(pesos(trabajo.get(k)) for k in
                           ("aportes_obligatorios_salud", "aportes_obligatorios_pension", "aportes_fsp"))
        otras_imputables = sum(v for _, v, _ in limitados)
        base_25 = max(CERO, ing_trabajo - incr_trabajo - otras_imputables)
        bruto_25 = pesos(base_25 * Decimal(str(b["porcentaje"])))
        tope_25 = p.en_pesos(b["tope_uvt_anual"])
        exenta_25 = min(bruto_25, tope_25)
        nota = f"limitada al tope de 790 UVT ({fmt(tope_25)})" if bruto_25 > tope_25 else ""
        limitados.append(("Renta exenta 25% de rentas de trabajo", exenta_25, nota))
        r.registrar(S, "  Renta exenta 25% de rentas de trabajo", exenta_25,
                    f"25% de (ingresos laborales {fmt(ing_trabajo)} - INCRNGO {fmt(incr_trabajo)} "
                    f"- deducciones y exentas ya imputadas {fmt(otras_imputables)}) = {fmt(bruto_25)}",
                    b["norma"], nota)

    # Cesantias exentas (art. 206 num. 4) - fuera del limite del 40%
    cesantias_exentas = pesos(exe.get("cesantias_e_intereses"))

    # ── Aplicacion del limite ──
    suma_limitados = sum(v for _, v, _ in limitados)
    lim = p.d["limite_cedula_general"]
    tope_pct = pesos(base_limite * Decimal(str(lim["porcentaje"])))
    tope_uvt = p.en_pesos(lim["tope_uvt"])
    limite = min(tope_pct, tope_uvt)
    r.registrar(S, "Limite a rentas exentas y deducciones", limite,
                f"menor entre 40% de {fmt(base_limite)} = {fmt(tope_pct)} y "
                f"{lim['tope_uvt']} UVT = {fmt(tope_uvt)}",
                lim["norma"], clave="cg_limite")

    aplicado = min(suma_limitados, limite)
    exceso = max(CERO, suma_limitados - limite)
    r.registrar(S, "Rentas exentas y deducciones imputables (aplicadas)", aplicado,
                f"solicitadas {fmt(suma_limitados)}, limite {fmt(limite)}",
                lim["norma"],
                f"RECHAZADAS por exceso: {fmt(exceso)}" if exceso else "",
                clave="cg_exentas_deducciones")
    if exceso > 0:
        r.alertas.append(
            f"Las rentas exentas y deducciones solicitadas superan el limite del 40%/1.340 UVT "
            f"en {fmt(exceso)}. Ese exceso NO es aprovechable en este ano gravable."
        )

    # ── Beneficios FUERA del limite ──
    fuera = CERO

    b336 = p.beneficio("dependientes_336")
    if n_dep > 0:
        n_efectivo = min(n_dep, int(b336["max_dependientes"]))
        val = p.en_pesos(Decimal(str(b336["uvt_por_dependiente"])) * n_efectivo)
        fuera += val
        nota = (f"se declararon {n_dep} dependientes; la norma reconoce maximo "
                f"{b336['max_dependientes']}") if n_dep > b336["max_dependientes"] else ""
        r.registrar(S, f"Deduccion de 72 UVT por {n_efectivo} dependiente(s)", val,
                    f"{n_efectivo} x 72 UVT x {fmt(p.uvt)}", b336["norma"], nota,
                    clave="cg_dependientes_336")

    bfe = p.beneficio("factura_electronica_1")
    compras_fe = pesos(ded.get("compras_factura_electronica"))
    if compras_fe:
        bruto_fe = pesos(compras_fe * Decimal(str(bfe["porcentaje"])))
        tope_fe = p.en_pesos(bfe["tope_uvt_anual"])
        val = min(bruto_fe, tope_fe)
        fuera += val
        r.registrar(S, "Deduccion del 1% por compras con factura electronica", val,
                    f"1% de {fmt(compras_fe)} = {fmt(bruto_fe)}", bfe["norma"],
                    f"limitada al tope de 240 UVT ({fmt(tope_fe)})" if bruto_fe > tope_fe else "",
                    clave="cg_factura_electronica")

    if cesantias_exentas:
        fuera += cesantias_exentas
        r.registrar(S, "Cesantias e intereses exentos", cesantias_exentas,
                    "no se someten al limite del 40%",
                    p.beneficio("cesantias_intereses_exentas")["norma"])

    rl_general = max(CERO, base_limite - aplicado - fuera)
    r.registrar(S, "RENTA LIQUIDA GRAVABLE DE LA CEDULA GENERAL", rl_general,
                f"{fmt(base_limite)} - {fmt(aplicado)} - {fmt(fuera)}",
                "Art. 336 ET", clave="cg_renta_liquida_gravable")
    return rl_general


# ─────────────────────────── cedula de pensiones ─────────────────────────────

def liquidar_pensiones(caso: dict, p: Parametros, r: Resultado) -> Decimal:
    S = "Cedula de pensiones"
    pen = _sub(caso, "pensiones")
    ing = pesos(pen.get("ingresos_brutos"))
    if ing <= 0:
        return CERO

    incr = pesos(pen.get("aportes_salud"))
    neto = max(CERO, ing - incr)
    r.registrar(S, "Ingresos por pensiones", ing, norma="Art. 337 ET")
    if incr:
        r.registrar(S, "Aportes obligatorios a salud", incr, norma="Art. 56 ET")

    b = p.beneficio("pension_exenta")
    meses = int(pen.get("meses_recibidos") or 12)
    tope = p.en_pesos(Decimal(str(b["tope_uvt_mensual"])) * meses)
    exenta = min(neto, tope)
    r.registrar(S, "Renta exenta de pensiones", exenta,
                f"1.000 UVT x {meses} mes(es) = {fmt(tope)}", b["norma"],
                f"excede el tope en {fmt(neto - tope)}" if neto > tope else "")

    rl = max(CERO, neto - exenta)
    r.registrar(S, "RENTA LIQUIDA GRAVABLE DE PENSIONES", rl,
                f"{fmt(neto)} - {fmt(exenta)}", "Art. 337 ET",
                clave="pen_renta_liquida_gravable")
    return rl


# ─────────────────────────── cedula de dividendos ────────────────────────────

def liquidar_dividendos(caso: dict, p: Parametros, r: Resultado) -> tuple[Decimal, Decimal, Decimal]:
    """Devuelve (renta liquida de dividendos, impuesto anticipado 35% de gravados,
    descuento art. 254-1)."""
    S = "Cedula de dividendos"
    div = _sub(caso, "dividendos")
    no_grav = pesos(div.get("no_gravados"))
    grav = pesos(div.get("gravados"))
    if no_grav <= 0 and grav <= 0:
        return CERO, CERO, CERO

    cfg = p.d["dividendos"]
    impuesto_35 = CERO
    r.valores["div_no_gravados"] = no_grav
    r.valores["div_gravados"] = grav
    if no_grav:
        r.registrar(S, "Dividendos no gravados (art. 49 num. 3)", no_grav,
                    "se suman a la renta liquida gravable y tributan con la tabla del art. 241",
                    cfg["no_gravados"]["norma"])
    if grav:
        impuesto_35 = pesos(grav * Decimal(str(cfg["gravados"]["tarifa_previa"])))
        r.registrar(S, "Dividendos gravados", grav,
                    f"tarifa previa del 35% = {fmt(impuesto_35)}; el remanente pasa a la RLG",
                    cfg["gravados"]["norma"])
        r.alertas.append(
            "Hay dividendos GRAVADOS. El tratamiento combinado (35% + tabla del art. 241 "
            "+ descuento del art. 254-1) es tecnico: haga revisar esta parte por un contador."
        )

    rl = no_grav + max(CERO, grav - impuesto_35)
    r.registrar(S, "RENTA LIQUIDA DE DIVIDENDOS", rl,
                f"{fmt(no_grav)} + ({fmt(grav)} - {fmt(impuesto_35)})",
                "Art. 331 ET", clave="div_renta_liquida")

    # Descuento art. 254-1 sobre el total de dividendos en UVT
    total_div = no_grav + grav
    total_uvt = total_div / p.uvt
    descuento = CERO
    for rango in cfg["descuento_254_1"]["rangos_uvt"]:
        desde = Decimal(str(rango["desde"]))
        hasta = Decimal(str(rango["hasta"])) if rango["hasta"] is not None else None
        if total_uvt > desde and (hasta is None or total_uvt <= hasta):
            descuento = pesos((total_uvt - desde) * Decimal(str(rango["tarifa"])) * p.uvt)
    if descuento:
        r.registrar(S, "Descuento tributario por dividendos", descuento,
                    f"19% de ({total_uvt:.2f} UVT - 1.090 UVT)",
                    cfg["descuento_254_1"]["norma"], clave="div_descuento_254_1")
    return rl, impuesto_35, descuento


# ────────────────────────── ganancias ocasionales ────────────────────────────

def liquidar_ganancias_ocasionales(caso: dict, p: Parametros, r: Resultado) -> Decimal:
    S = "Ganancias ocasionales"
    items = caso.get("ganancias_ocasionales") or []
    if not items:
        return CERO

    go = p.d["ganancias_ocasionales"]
    base_general = CERO
    base_loterias = CERO
    total_ingresos = CERO
    total_costos = CERO
    total_exentas = CERO

    for it in items:
        tipo = it.get("tipo", "otro")
        ingreso = pesos(it.get("ingreso"))
        costo = pesos(it.get("costo_fiscal"))
        anios = it.get("anios_posesion")
        desc = it.get("descripcion", tipo)

        if tipo == "venta_activo_fijo" and anios is not None and anios < 2:
            r.alertas.append(
                f"'{desc}': el activo se poseyo menos de 2 anos, asi que la utilidad "
                f"es RENTA ORDINARIA, no ganancia ocasional. Debe reclasificarse."
            )
            continue

        total_ingresos += ingreso
        total_costos += costo
        utilidad = max(CERO, ingreso - costo)
        r.registrar(S, f"Utilidad en {desc}", utilidad,
                    f"ingreso {fmt(ingreso)} - costo fiscal {fmt(costo)}",
                    go["norma_tarifa"])

        exenta = CERO
        if it.get("exencion") == "vivienda_habitacion_311_1":
            ex = go["exenciones"]["vivienda_habitacion_311_1"]
            tope_viv = p.en_pesos(ex["tope_valor_vivienda_uvt"])
            valor_catastral = pesos(it.get("valor_catastral"))
            if valor_catastral and valor_catastral > tope_viv:
                r.alertas.append(
                    f"'{desc}': el valor catastral ({fmt(valor_catastral)}) supera 15.000 UVT "
                    f"({fmt(tope_viv)}); NO procede la exencion del art. 311-1."
                )
            else:
                exenta = min(utilidad, p.en_pesos(ex["tope_uvt"]))
                r.registrar(S, f"  Exencion por venta de vivienda de habitacion", exenta,
                            f"tope 5.000 UVT = {fmt(p.en_pesos(ex['tope_uvt']))}", ex["norma"],
                            "Exige depositar los recursos en cuenta AFC y destinarlos a otra "
                            "vivienda o a abonar el credito hipotecario.")
                # La exencion vale toda la diferencia: si el deposito en AFC no se hizo
                # al momento de la venta, no hay forma de repararlo despues.
                costo = pesos(exenta * Decimal(str(go["tarifa_general"])))
                r.alertas.append(
                    f"'{desc}': la exencion del art. 311-1 por {fmt(exenta)} SOLO procede si "
                    f"los recursos de la venta se depositaron en una cuenta AFC y se "
                    f"destinaron a otra vivienda o a abonar el credito hipotecario. "
                    f"Confirmalo con el certificado de la entidad financiera: sin ese "
                    f"deposito la exencion se pierde y el impuesto sube {fmt(costo)}."
                )
        elif it.get("exencion_valor"):
            exenta = pesos(it["exencion_valor"])
            r.registrar(S, f"  Exencion aplicada", exenta,
                        it.get("exencion_norma", ""), it.get("exencion_norma", ""))

        total_exentas += exenta
        gravable = max(CERO, utilidad - exenta)
        if tipo in ("loteria", "rifa", "apuesta", "premio"):
            base_loterias += pesos(ingreso)
        else:
            base_general += gravable

    imp = CERO
    if base_general:
        t = Decimal(str(go["tarifa_general"]))
        imp += pesos(base_general * t)
        r.registrar(S, "Impuesto de ganancias ocasionales", pesos(base_general * t),
                    f"{fmt(base_general)} x 15%", "Arts. 313 y 314 ET",
                    clave="go_impuesto_general")
    if base_loterias:
        t = Decimal(str(go["tarifa_loterias_rifas"]))
        imp += pesos(base_loterias * t)
        r.registrar(S, "Impuesto de loterias, rifas y premios", pesos(base_loterias * t),
                    f"{fmt(base_loterias)} x 20%", "Art. 317 ET",
                    clave="go_impuesto_loterias")

    r.valores["go_ingresos"] = total_ingresos
    r.valores["go_costos"] = total_costos
    r.valores["go_no_gravadas_exentas"] = total_exentas
    r.registrar(S, "BASE GRAVABLE DE GANANCIAS OCASIONALES", base_general + base_loterias,
                clave="go_base_gravable")
    r.registrar(S, "TOTAL IMPUESTO DE GANANCIAS OCASIONALES", imp, clave="go_impuesto")
    return imp


# ──────────────────────────── liquidacion privada ────────────────────────────

def liquidar(caso: dict, p: Parametros) -> Resultado:
    r = Resultado()
    S = "Liquidacion privada"

    # Patrimonio
    pat = _sub(caso, "patrimonio")
    bruto = pesos(pat.get("bruto"))
    deudas = pesos(pat.get("deudas"))
    r.registrar("Patrimonio", "Total patrimonio bruto a 31 de diciembre", bruto,
                clave="patrimonio_bruto")
    r.registrar("Patrimonio", "Deudas", deudas, clave="patrimonio_deudas")
    r.registrar("Patrimonio", "Total patrimonio liquido", max(CERO, bruto - deudas),
                f"{fmt(bruto)} - {fmt(deudas)}", clave="patrimonio_liquido")

    # Cedulas
    rl_general = liquidar_cedula_general(caso, p, r)
    rl_pension = liquidar_pensiones(caso, p, r)
    rl_div, imp_35, descuento_div = liquidar_dividendos(caso, p, r)

    rlg = rl_general + rl_pension + rl_div
    r.registrar(S, "RENTA LIQUIDA GRAVABLE TOTAL", rlg,
                f"cedula general {fmt(rl_general)} + pensiones {fmt(rl_pension)} "
                f"+ dividendos {fmt(rl_div)}",
                "Art. 331 ET", clave="renta_liquida_gravable")

    impuesto, formula = impuesto_tabla_241(rlg, p)
    r.registrar(S, "Impuesto sobre la renta liquida gravable", impuesto, formula,
                "Art. 241 ET", clave="impuesto_renta")

    # Descuentos tributarios
    descuentos = descuento_div
    otros_desc = pesos(_sub(caso, "descuentos").get("otros"))
    if otros_desc:
        descuentos += otros_desc
        r.registrar(S, "Otros descuentos tributarios", otros_desc, clave="otros_descuentos")
    descuentos = min(descuentos, impuesto)
    r.registrar(S, "Total descuentos tributarios", descuentos,
                "limitados al impuesto sobre la renta", clave="descuentos")

    impuesto_neto = max(CERO, impuesto - descuentos)
    r.registrar(S, "IMPUESTO NETO DE RENTA", impuesto_neto,
                f"{fmt(impuesto)} - {fmt(descuentos)}", clave="impuesto_neto_renta")

    imp_go = liquidar_ganancias_ocasionales(caso, p, r)

    total_cargo = impuesto_neto + imp_go + imp_35
    r.registrar(S, "TOTAL IMPUESTO A CARGO", total_cargo,
                f"impuesto neto {fmt(impuesto_neto)} + ganancias ocasionales {fmt(imp_go)}"
                + (f" + 35% dividendos gravados {fmt(imp_35)}" if imp_35 else ""),
                clave="total_impuesto_cargo")

    # Retenciones, anticipos y saldos
    ret = _sub(caso, "retenciones")
    total_ret = sum(pesos(v) for v in ret.values()) if ret else CERO
    r.registrar(S, "Total retenciones en la fuente del ano", total_ret, clave="retenciones")

    ant = _sub(caso, "anticipos")
    ant_anterior = pesos(ant.get("anticipo_liquidado_ano_anterior"))
    saldo_favor_anterior = pesos(ant.get("saldo_favor_ano_anterior_sin_devolucion"))
    if ant_anterior:
        r.registrar(S, "Anticipo liquidado en la declaracion del ano anterior", ant_anterior,
                    clave="anticipo_anterior")
    if saldo_favor_anterior:
        r.registrar(S, "Saldo a favor del ano anterior sin solicitud de devolucion",
                    saldo_favor_anterior, clave="saldo_favor_anterior")

    # Anticipo del ano siguiente (art. 807): se toma la opcion mas favorable
    cfg_ant = p.d["anticipo"]
    pct = Decimal(str(cfg_ant["porcentaje_general"]))
    imp_neto_anterior = pesos(_sub(caso, "ano_anterior").get("impuesto_neto_renta"))
    opcion_a = max(CERO, pesos(impuesto_neto * pct) - total_ret)
    promedio = (impuesto_neto + imp_neto_anterior) / 2
    opcion_b = max(CERO, pesos(promedio * pct) - total_ret)
    anticipo = min(opcion_a, opcion_b) if imp_neto_anterior else opcion_a
    if caso.get("no_liquidar_anticipo"):
        anticipo = CERO
    r.registrar(S, "Anticipo del impuesto para el ano siguiente", anticipo,
                f"opcion impuesto del ano: 75% de {fmt(impuesto_neto)} - retenciones = {fmt(opcion_a)}"
                + (f"; opcion promedio de dos anos: {fmt(opcion_b)}" if imp_neto_anterior else ""),
                "Art. 807 ET",
                "Se toma la opcion mas favorable permitida por la norma.",
                clave="anticipo_siguiente")

    saldo = total_cargo + anticipo - total_ret - ant_anterior - saldo_favor_anterior
    if saldo >= 0:
        r.registrar(S, "SALDO A PAGAR", aprox_mil(saldo),
                    f"impuesto a cargo {fmt(total_cargo)} + anticipo {fmt(anticipo)} "
                    f"- retenciones {fmt(total_ret)} - anticipo anterior {fmt(ant_anterior)} "
                    f"- saldo a favor anterior {fmt(saldo_favor_anterior)}",
                    "Art. 577 ET (aproximacion al mil mas cercano)",
                    clave="saldo_a_pagar")
        r.valores["saldo_a_favor"] = CERO
        r.desenlace = "R4_impuesto_cero" if aprox_mil(saldo) == 0 else "R2_saldo_a_pagar"
    else:
        r.registrar(S, "SALDO A FAVOR", aprox_mil(-saldo),
                    f"retenciones y anticipos superan el impuesto a cargo mas el anticipo",
                    "Art. 577 ET (aproximacion al mil mas cercano)",
                    clave="saldo_a_favor")
        r.valores["saldo_a_pagar"] = CERO
        r.desenlace = "R3_saldo_a_favor"

    return r


# ─────────────────────────────────── CLI ─────────────────────────────────────

def main() -> int:
    ap = argparse.ArgumentParser(description="Liquidador de renta persona natural residente")
    ap.add_argument("caso", help="Ruta al archivo JSON con los hechos del caso")
    ap.add_argument("--params", help="Ruta al JSON de parametros (por defecto ag2025.json)")
    ap.add_argument("--json", help="Escribe el resultado completo en este archivo")
    args = ap.parse_args()

    caso = json.loads(Path(args.caso).read_text(encoding="utf-8"))
    p = Parametros.cargar(args.params, anio=caso.get("anio_gravable", 2025))
    r = liquidar(caso, p)

    ancho = 78
    print("=" * ancho)
    print(f"  MEMORIA DE CALCULO - Ano gravable {caso.get('anio_gravable', 2025)}")
    print("=" * ancho)
    seccion = None
    for paso in r.trace:
        if paso.seccion != seccion:
            seccion = paso.seccion
            print(f"\n── {seccion} ──")
        print(f"  {paso.concepto:<58} {fmt(paso.valor):>17}")
        if paso.formula:
            print(f"      = {paso.formula}")
        if paso.norma:
            print(f"      ({paso.norma})")
        if paso.nota:
            print(f"      ! {paso.nota}")

    if r.alertas:
        print(f"\n── Alertas ──")
        for a in r.alertas:
            print(f"  ! {a}")

    print(f"\n{'=' * ancho}")
    print(f"  DESENLACE: {r.desenlace}")
    print("=" * ancho)

    if args.json:
        Path(args.json).write_text(json.dumps(r.dict(), indent=2, ensure_ascii=False),
                                   encoding="utf-8")
        print(f"\nResultado escrito en {args.json}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
