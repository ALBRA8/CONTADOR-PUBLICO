/**
 * MOTOR TRIBUTARIO DETERMINISTA — Formulario 210 (Colombia, AG 2025)
 * ===================================================================
 * Implementación original en TypeScript del núcleo funcional CONTADOR PÚBLICO ALBRA,
 * construida con el método de sala limpia CloneaKit a partir de la FICHA.md
 * (clones/albra/FICHA.md) y de las reglas funcionales verificadas del referente
 * open-renta (MIT) — decisiones registradas en la matriz de aprovechamiento
 * (ADOPTAR con auditoría y paridad contra sus casos golden).
 *
 * Principios (Prompt Maestro §7 Módulo 5):
 *  - La misma entrada, con la misma versión de reglas, produce el mismo resultado.
 *  - Cada cifra importante se reconstruye desde sus entradas y operaciones (memoria).
 *  - Cada paso cita la norma que lo sustenta.
 *  - Ningún valor se inventa: los datos desconocidos quedan como pendientes.
 *
 * Reglas de redondeo (idénticas a las verificadas en el motor de referencia):
 *  - La DIAN no maneja centavos: todo se redondea a peso (ROUND_HALF_UP).
 *  - Las declaraciones se aproximan al múltiplo de mil más cercano (art. 577 ET)
 *    solo en los saldos finales (casillas 134/136/137).
 *  - La tabla del art. 241 opera en UVT: base/UVT sin redondear internamente,
 *    impuesto final redondeado a peso.
 */

import { PARAMETROS_AG2025 } from "./parametros";
import {
  Expediente,
  ItemGananciaOcasional,
  monto,
  esDesconocido,
  DatoConOrigen,
} from "./tipos";

// ---------------------------------------------------------------------------
// Utilidades de redondeo
// ---------------------------------------------------------------------------

/** Redondea a peso entero (la DIAN no maneja centavos). */
export function pesos(valor: number): number {
  return Math.round(valor);
}

/** Aproxima al múltiplo de mil más cercano (art. 577 ET). */
export function aproxMil(valor: number): number {
  return Math.round(valor / 1000) * 1000;
}

/** Convierte pesos a UVT con 2 decimales. */
export function aUvt(valor: number, uvt = PARAMETROS_AG2025.uvtAnioGravable): number {
  return Math.round((valor / uvt) * 100) / 100;
}

/** Convierte UVT a pesos redondeados. */
export function enPesos(uvts: number, uvt = PARAMETROS_AG2025.uvtAnioGravable): number {
  return pesos(uvts * uvt);
}

// ---------------------------------------------------------------------------
// Tipos del resultado
// ---------------------------------------------------------------------------

export interface Paso {
  seccion: string;
  concepto: string;
  valor: number;
  formula: string;
  norma: string;
  nota: string;
}

export interface ResultadoLiquidacion {
  /** Valores por clave del motor (paridad con casos golden). */
  valores: Record<string, number>;
  /** Casillas del Formulario 210 v16 (AG2025) con su valor en pesos. */
  casillas: Record<number, number>;
  /** Memoria de cálculo trazable, en orden de ejecución. */
  memoria: Paso[];
  /** Alertas del auditor de riesgos. */
  alertas: string[];
  /** Datos desconocidos que impiden o afectan la liquidación. */
  pendientes: string[];
  /** Desenlace del procedimiento (R1–R7 del referente). */
  desenlace: "R1_no_obligado" | "R2_saldo_a_pagar" | "R3_saldo_a_favor" | "R4_impuesto_cero" | "R7_fuera_de_alcance";
  /** Casilla 140: costos de honorarios superan el 60% del art. 336-1 ET. */
  casilla140: boolean;
  pctCostos336_1: number | null;
  /** Fecha de vencimiento según los 2 dígitos del NIT (Decreto 2229 de 2023). */
  vencimiento: string | null;
}

class Liquidador {
  valores: Record<string, number> = {};
  casillas: Record<number, number> = {};
  memoria: Paso[] = [];
  alertas: string[] = [];
  casilla140 = false;
  pctCostos336_1: number | null = null;

  registrar(
    seccion: string,
    concepto: string,
    valor: number,
    formula = "",
    norma = "",
    nota = "",
    clave?: string,
  ): number {
    const v = pesos(valor);
    this.memoria.push({ seccion, concepto, valor: v, formula, norma, nota });
    if (clave) this.valores[clave] = v;
    return v;
  }
  v(clave: string): number {
    return this.valores[clave] ?? 0;
  }
  fijarCasilla(n: number, valor: number): number {
    this.casillas[n] = pesos(valor);
    return this.casillas[n];
  }
}

// ---------------------------------------------------------------------------
// Tabla del artículo 241 ET
// ---------------------------------------------------------------------------

export function impuestoTabla241(
  base: number,
): { impuesto: number; formula: string } {
  const p = PARAMETROS_AG2025;
  const baseUvt = base / p.uvtAnioGravable;
  for (const rango of p.tabla241) {
    const hasta = rango.hasta;
    if (baseUvt > rango.desde && (hasta === null || baseUvt <= hasta)) {
      const impuestoUvt = (baseUvt - rango.desde) * rango.tarifa + rango.impuestoBaseUvt;
      return {
        impuesto: pesos(impuestoUvt * p.uvtAnioGravable),
        formula: `(${baseUvt.toFixed(2)} UVT − ${rango.desde} UVT) × ${(rango.tarifa * 100).toFixed(0)}% + ${rango.impuestoBaseUvt} UVT = ${impuestoUvt.toFixed(2)} UVT`,
      };
    }
  }
  return {
    impuesto: 0,
    formula: `${baseUvt.toFixed(2)} UVT está en el rango exento (0 a 1.090 UVT): tarifa 0%`,
  };
}

// ---------------------------------------------------------------------------
// Cédula general (arts. 335-336 ET)
// ---------------------------------------------------------------------------

interface BloqueLimitado {
  etiqueta: string;
  valor: number;
  nota: string;
}

function liquidarCedulaGeneral(e: Expediente, L: Liquidador): number {
  const S = "Cédula general";
  const P = PARAMETROS_AG2025;
  const p = P.beneficios;

  // ── Ingresos brutos por fuente ──
  const ingSalarios = monto(e.rentasTrabajo.ingresosBrutos);
  const ingHonorarios = monto(e.rentasIndependientes.ingresosBrutos);
  const ingCapital = 0; // v1: rentas de capital se registran pero el expediente no las pide aparte
  const ingNoLaborales = 0;
  const ingTotal = ingSalarios + ingHonorarios + ingCapital + ingNoLaborales;
  L.registrar(S, "Ingresos brutos de la cédula general", ingTotal,
    `trabajo ${fmt(ingSalarios)} + honorarios ${fmt(ingHonorarios)} + capital ${fmt(ingCapital)} + no laborales ${fmt(ingNoLaborales)}`,
    "Art. 335 ET", "", "cg_ingresos_brutos");
  L.valores["cg_trabajo_ingresos"] = ingSalarios;
  L.valores["cg_capital_ingresos"] = ingCapital;
  L.valores["cg_no_laborales_ingresos"] = ingNoLaborales;
  L.fijarCasilla(32, ingSalarios);
  L.fijarCasilla(43, ingHonorarios);

  // ── Ingresos no constitutivos de renta (arts. 55 y 56 ET) ──
  const incrSalarios =
    monto(e.rentasTrabajo.aportesObligatoriosSalud) +
    monto(e.rentasTrabajo.aportesObligatoriosPension) +
    monto(e.rentasTrabajo.aportesFsp);
  const incrHonorarios =
    monto(e.rentasIndependientes.aportesObligatoriosSalud) +
    monto(e.rentasIndependientes.aportesObligatoriosPension);
  const incr = incrSalarios + incrHonorarios;
  L.registrar(S, "Ingresos no constitutivos de renta ni ganancia ocasional", incr,
    `aportes obligatorios: salarios ${fmt(incrSalarios)} + honorarios ${fmt(incrHonorarios)}`,
    "Arts. 55 y 56 ET", "", "cg_incrngo");
  L.valores["cg_trabajo_incrngo"] = incrSalarios;
  L.valores["cg_capital_incrngo"] = 0;
  L.valores["cg_no_laborales_incrngo"] = 0;
  L.fijarCasilla(33, incrSalarios);
  L.fijarCasilla(44, incrHonorarios);

  // ── Costos y gastos (art. 336 num. 2 ET) ──
  const costosHonorarios = monto(e.rentasIndependientes.costosGastos);
  const costos = costosHonorarios;
  if (costosHonorarios > 0 && ingHonorarios > 0) {
    L.pctCostos336_1 = costosHonorarios / ingHonorarios;
    if (L.pctCostos336_1 > P.topeCostosTrabajo336_1) {
      L.casilla140 = true;
      L.alertas.push(
        `Los costos imputados a rentas de trabajo sin relación laboral son el ${(L.pctCostos336_1 * 100).toFixed(1)}% de los ingresos brutos y superan el tope indicativo del 60% del art. 336-1 ET. Hay que marcar la casilla 140 del formulario 210 y tener el soporte de cada costo listo.`,
      );
    }
    L.alertas.push(
      "Se imputaron costos y gastos a rentas de trabajo: eso excluye la renta exenta del 25% sobre esos honorarios (art. 206 num. 10, parágrafo).",
    );
  }
  L.registrar(S, "Costos y gastos procedentes", costos,
    "solo rentas de trabajo sin relación laboral (honorarios con costos)",
    "Art. 336 num. 2 ET", "", "cg_costos");
  L.valores["cg_trabajo_costos"] = costosHonorarios;
  L.fijarCasilla(45, costosHonorarios);

  // ── Renta líquida de cada bloque de trabajo (casillas del formulario) ──
  const rentaLiquidaSalarios = ingSalarios - incrSalarios;
  const rentaLiquidaHonorarios = ingHonorarios - incrHonorarios - costosHonorarios;
  L.fijarCasilla(34, rentaLiquidaSalarios);
  L.fijarCasilla(46, rentaLiquidaHonorarios);

  // ── Renta líquida: base del límite del 40% ──
  const baseLimite = Math.max(0, ingTotal - incr - costos);
  L.registrar(S, "Renta líquida de la cédula general (base del límite)", baseLimite,
    `${fmt(ingTotal)} − ${fmt(incr)} − ${fmt(costos)}`,
    "Art. 336 ET", "", "cg_base_limite");

  // ── Bloque sujeto al límite 40% / 1.340 UVT ──
  const limitados: BloqueLimitado[] = [];

  const agregar = (
    claveBeneficio: keyof typeof P.beneficios,
    valorBruto: number,
    etiqueta: string,
  ) => {
    if (valorBruto <= 0) return;
    const b = P.beneficios[claveBeneficio];
    const tope = b.topeUvtAnual ? enPesos(b.topeUvtAnual) : 0;
    const valor = tope > 0 ? Math.min(valorBruto, tope) : valorBruto;
    const nota =
      tope > 0 && valorBruto > tope
        ? `limitado al tope de ${b.topeUvtAnual} UVT (${fmt(tope)}); se pierden ${fmt(valorBruto - tope)}`
        : "";
    limitados.push({ etiqueta, valor, nota });
    L.registrar(S, `  ${etiqueta}`, valor, `declarado ${fmt(valorBruto)}`, b.norma, nota);
  };

  const ded = e.deducciones;
  agregar("interesesVivienda", monto(ded.interesesVivienda), "Intereses de crédito de vivienda");
  agregar("medicinaPrepagada", monto(ded.medicinaPrepagada), "Medicina prepagada y seguros de salud");
  agregar("icetex", monto(ded.icetex), "Intereses Icetex");

  const gmfPagado = monto(ded.gmfPagado);
  if (gmfPagado > 0) {
    const val = pesos(gmfPagado * 0.5);
    limitados.push({ etiqueta: "GMF (4x1000) deducible", valor: val, nota: "" });
    L.registrar(S, "  GMF (4x1000) deducible", val, `50% de ${fmt(gmfPagado)} certificado`, p.gmf4x1000.norma);
  }

  // Dependientes art. 387: 10% del ingreso bruto de trabajo, tope 384 UVT.
  const nDep = e.contribuyente.dependientes ?? 0;
  const ingTrabajoTotal = ingSalarios + ingHonorarios;
  if (nDep > 0 && ingTrabajoTotal > 0) {
    const topePct = pesos(ingTrabajoTotal * 0.1);
    const topeAbs = enPesos(p.dependientes387.topeUvtAnual ?? 384);
    const val = Math.min(topePct, topeAbs);
    limitados.push({ etiqueta: "Dependientes (art. 387)", valor: val, nota: "" });
    L.registrar(S, "  Dependientes (art. 387)", val,
      `menor entre 10% de ${fmt(ingTrabajoTotal)} = ${fmt(topePct)} y 384 UVT = ${fmt(topeAbs)}`,
      p.dependientes387.norma);
  }

  const exe = e.rentasExentas;
  const aportesVoluntarios = monto(exe.aportesVoluntariosPension) + monto(exe.afc);
  agregar("aportesVoluntariosPensionesAfc", aportesVoluntarios, "Aportes voluntarios a pensión y AFC");
  agregar("cesantiasVoluntarias", monto(exe.cesantiasVoluntarias), "Aportes voluntarios a cesantías");

  // Renta exenta del 25% (art. 206 num. 10) sobre la base depurada.
  let exenta25 = 0;
  const honorariosConCostos = costosHonorarios > 0;
  if (ingTrabajoTotal > 0 && !honorariosConCostos) {
    const base25 = Math.max(0, ingTrabajoTotal - incr - otrasImputables(limitados));
    const bruto25 = pesos(base25 * 0.25);
    const tope25 = enPesos(p.rentaExentaLaboral25.topeUvtAnual ?? 790);
    exenta25 = Math.min(bruto25, tope25);
    const nota = bruto25 > tope25 ? `limitada al tope de 790 UVT (${fmt(tope25)})` : "";
    limitados.push({ etiqueta: "Renta exenta 25% de rentas de trabajo", valor: exenta25, nota });
    L.registrar(S, "  Renta exenta 25% de rentas de trabajo", exenta25,
      `25% de (ingresos de trabajo ${fmt(ingTrabajoTotal)} − INCRNGO ${fmt(incr)} − deducciones y exentas ya imputadas ${fmt(otrasImputables(limitados))}) = ${fmt(bruto25)}`,
      p.rentaExentaLaboral25.norma, nota);
  }

  // ── Aplicación del límite (art. 336 num. 3 ET) ──
  const sumaLimitados = limitados.reduce((acc, x) => acc + x.valor, 0);
  const topePct = pesos(baseLimite * P.limiteCedulaGeneral.porcentaje);
  const topeUvt = enPesos(P.limiteCedulaGeneral.topeUvt);
  const limite = Math.min(topePct, topeUvt);
  L.registrar(S, "Límite a rentas exentas y deducciones", limite,
    `menor entre 40% de ${fmt(baseLimite)} = ${fmt(topePct)} y ${P.limiteCedulaGeneral.topeUvt} UVT = ${fmt(topeUvt)}`,
    "Art. 336 num. 3 ET", "", "cg_limite");

  const aplicado = Math.min(sumaLimitados, limite);
  const exceso = Math.max(0, sumaLimitados - limite);
  L.registrar(S, "Rentas exentas y deducciones imputables (aplicadas)", aplicado,
    `solicitadas ${fmt(sumaLimitados)}, límite ${fmt(limite)}`,
    "Art. 336 num. 3 ET",
    exceso > 0 ? `RECHAZADAS por exceso: ${fmt(exceso)}` : "",
    "cg_exentas_deducciones");
  if (exceso > 0) {
    L.alertas.push(
      `Las rentas exentas y deducciones solicitadas superan el límite del 40%/1.340 UVT en ${fmt(exceso)}. Ese exceso NO es aprovechable en este año gravable.`,
    );
  }

  // ── Beneficios FUERA del límite ──
  let fuera = 0;

  if (nDep > 0) {
    const nEfectivo = Math.min(nDep, 4);
    const val = enPesos(72 * nEfectivo);
    fuera += val;
    const nota = nDep > 4 ? `se declararon ${nDep} dependientes; la norma reconoce máximo 4` : "";
    L.registrar(S, `Deducción de 72 UVT por ${nEfectivo} dependiente(s)`, val,
      `${nEfectivo} × 72 UVT × ${fmt(P.uvtAnioGravable)}`, p.dependientes336.norma, nota,
      "cg_dependientes_336");
    L.fijarCasilla(138, nDep);
    L.fijarCasilla(139, val);
  }

  const comprasFe = monto(ded.comprasFacturaElectronica);
  if (comprasFe > 0) {
    const brutoFe = pesos(comprasFe * 0.01);
    const topeFe = enPesos(p.facturaElectronica1.topeUvtAnual ?? 240);
    const val = Math.min(brutoFe, topeFe);
    fuera += val;
    L.registrar(S, "Deducción del 1% por compras con factura electrónica", val,
      `1% de ${fmt(comprasFe)} = ${fmt(brutoFe)}`, p.facturaElectronica1.norma,
      brutoFe > topeFe ? `limitada al tope de 240 UVT (${fmt(topeFe)})` : "",
      "cg_factura_electronica");
    L.fijarCasilla(28, val);
  }

  // ── Reparto de lo aplicado entre los bloques del formulario ──
  // Regla v1 (documentada en la FICHA): las deducciones se imputan primero al bloque
  // de rentas de trabajo con relación laboral (casillas 35-42); el excedente va al
  // bloque de rentas de trabajo sin relación laboral (casillas 47-57). Así la suma
  // 41 + 42 + 53 + 57 siempre reconstruye la base del límite.
  if (aplicado > 0) {
    const parteSalarios = Math.min(aplicado, Math.max(0, rentaLiquidaSalarios));
    const parteHonorarios = aplicado - parteSalarios;
    if (parteSalarios > 0) {
      L.fijarCasilla(37, parteSalarios);
      L.fijarCasilla(41, parteSalarios);
      L.fijarCasilla(42, rentaLiquidaSalarios - parteSalarios);
    }
    if (parteHonorarios > 0) {
      L.fijarCasilla(53, parteHonorarios);
      L.fijarCasilla(57, Math.max(0, rentaLiquidaHonorarios - parteHonorarios));
    }
  } else {
    if (rentaLiquidaSalarios > 0) L.fijarCasilla(42, rentaLiquidaSalarios);
    if (rentaLiquidaHonorarios > 0) L.fijarCasilla(57, rentaLiquidaHonorarios);
  }

  const rentaLiquidaGravableGeneral = Math.max(0, baseLimite - aplicado - fuera);
  L.registrar(S, "RENTA LÍQUIDA GRAVABLE DE LA CÉDULA GENERAL", rentaLiquidaGravableGeneral,
    `${fmt(baseLimite)} − ${fmt(aplicado)} − ${fmt(fuera)}`,
    "Art. 336 ET", "", "cg_renta_liquida_gravable");
  return rentaLiquidaGravableGeneral;
}

function otrasImputables(limitados: BloqueLimitado[]): number {
  return limitados.reduce((acc, x) => acc + x.valor, 0);
}

// ---------------------------------------------------------------------------
// Cédula de pensiones (art. 337 ET)
// ---------------------------------------------------------------------------

function liquidarPensiones(e: Expediente, L: Liquidador): number {
  const S = "Cédula de pensiones";
  const ing = monto(e.pensiones.ingresosBrutos);
  if (ing <= 0) return 0;

  const incr = monto(e.pensiones.aportesSalud);
  const neto = Math.max(0, ing - incr);
  L.registrar(S, "Ingresos por pensiones", ing, "", "Art. 337 ET");
  L.fijarCasilla(99, ing);
  if (incr > 0) {
    L.registrar(S, "Aportes obligatorios a salud", incr, "", "Art. 56 ET");
    L.fijarCasilla(100, incr);
  }
  L.fijarCasilla(101, neto);

  const meses = Math.max(1, Math.min(12, e.pensiones.mesesRecibidos || 12));
  const tope = enPesos(1000 * meses);
  const exenta = Math.min(neto, tope);
  L.registrar(S, "Renta exenta de pensiones", exenta,
    `1.000 UVT × ${meses} mes(es) = ${fmt(tope)}`,
    "Art. 206 num. 5 ET",
    neto > tope ? `excede el tope en ${fmt(neto - tope)}` : "");
  L.fijarCasilla(102, exenta);

  const rl = Math.max(0, neto - exenta);
  L.registrar(S, "RENTA LÍQUIDA GRAVABLE DE PENSIONES", rl,
    `${fmt(neto)} − ${fmt(exenta)}`, "Art. 337 ET", "", "pen_renta_liquida_gravable");
  L.fijarCasilla(103, rl);
  return rl;
}

// ---------------------------------------------------------------------------
// Cédula de dividendos (arts. 331, 242, 49 y 254-1 ET)
// ---------------------------------------------------------------------------

interface ResultadoDividendos {
  rentaLiquida: number;
  impuesto35: number;
  descuento2541: number;
}

function liquidarDividendos(
  dividendosNoGravados: number,
  dividendosGravados: number,
  L: Liquidador,
): ResultadoDividendos {
  const S = "Cédula de dividendos";
  const noGrav = pesos(dividendosNoGravados);
  const grav = pesos(dividendosGravados);
  if (noGrav <= 0 && grav <= 0) return { rentaLiquida: 0, impuesto35: 0, descuento2541: 0 };

  let impuesto35 = 0;
  L.fijarCasilla(104, noGrav);
  L.fijarCasilla(107, grav);
  if (noGrav > 0) {
    L.registrar(S, "Dividendos no gravados (art. 49 num. 3)", noGrav,
      "se suman a la renta líquida gravable y tributan con la tabla del art. 241",
      "Art. 242 ET");
  }
  if (grav > 0) {
    impuesto35 = pesos(grav * PARAMETROS_AG2025.dividendos.tarifaPreviaGravados);
    L.registrar(S, "Dividendos gravados", grav,
      `tarifa previa del 35% = ${fmt(impuesto35)}; el remanente pasa a la renta líquida gravable`,
      "Art. 49 par. 2 ET");
    L.alertas.push(
      "Hay dividendos GRAVADOS. El tratamiento combinado (35% + tabla del art. 241 + descuento del art. 254-1) es técnico: haga revisar esta parte por un contador.",
    );
  }
  L.fijarCasilla(118, impuesto35);

  const rentaLiquida = noGrav + Math.max(0, grav - impuesto35);
  L.registrar(S, "RENTA LÍQUIDA DE DIVIDENDOS", rentaLiquida,
    `${fmt(noGrav)} + (${fmt(grav)} − ${fmt(impuesto35)})`, "Art. 331 ET", "",
    "div_renta_liquida");
  L.fijarCasilla(111, rentaLiquida);

  // Descuento art. 254-1: 19% del exceso de 1.090 UVT sobre el total de dividendos.
  const totalUvt = (noGrav + grav) / PARAMETROS_AG2025.uvtAnioGravable;
  let descuento = 0;
  const desdeUvt = PARAMETROS_AG2025.dividendos.descuento2541.desdeUvt;
  const tarifa = PARAMETROS_AG2025.dividendos.descuento2541.tarifa;
  if (totalUvt > desdeUvt) {
    descuento = pesos((totalUvt - desdeUvt) * tarifa * PARAMETROS_AG2025.uvtAnioGravable);
    L.registrar(S, "Descuento tributario por dividendos (art. 254-1)", descuento,
      `${(tarifa * 100).toFixed(0)}% de (${totalUvt.toFixed(2)} UVT − ${desdeUvt} UVT)`,
      "Art. 254-1 ET", "", "div_descuento_254_1");
    L.fijarCasilla(124, descuento);
  }
  return { rentaLiquida, impuesto35, descuento2541: descuento };
}

// ---------------------------------------------------------------------------
// Ganancias ocasionales (arts. 313, 314, 317 y 311-1 ET)
// ---------------------------------------------------------------------------

function liquidarGananciasOcasionales(
  items: ItemGananciaOcasional[],
  L: Liquidador,
): number {
  const S = "Ganancias ocasionales";
  if (!items || items.length === 0) return 0;
  const P = PARAMETROS_AG2025.gananciasOcasionales;
  let baseGeneral = 0;
  let baseLoterias = 0;
  let imp = 0;
  let ingresosGO = 0;
  let costosGO = 0;
  let exentasGO = 0;

  for (const it of items) {
    const ingreso = pesos(it.ingreso);
    const costo = pesos(it.costoFiscal ?? 0);
    const desc = it.descripcion || it.tipo;

    if (it.tipo === "venta_activo_fijo" && it.aniosPosesion != null && it.aniosPosesion < 2) {
      L.alertas.push(
        `'${desc}': el activo se poseyó menos de 2 años, así que la utilidad es RENTA ORDINARIA, no ganancia ocasional. Debe reclasificarse.`,
      );
      continue;
    }

    ingresosGO += ingreso;
    costosGO += costo;
    const utilidad = Math.max(0, ingreso - costo);
    L.registrar(S, `Utilidad en ${desc}`, utilidad,
      `ingreso ${fmt(ingreso)} − costo fiscal ${fmt(costo)}`, "Arts. 313 y 314 ET");

    let exenta = 0;
    if (it.exencion === "vivienda_habitacion_311_1") {
      const topeViv = enPesos(P.viviendaValorCatastralTopeUvt);
      const valorCatastral = pesos(it.valorCatastral ?? 0);
      if (valorCatastral > topeViv) {
        L.alertas.push(
          `'${desc}': el valor catastral (${fmt(valorCatastral)}) supera 15.000 UVT (${fmt(topeViv)}); NO procede la exención del art. 311-1.`,
        );
      } else {
        exenta = Math.min(utilidad, enPesos(P.exencionViviendaTopeUvt));
        L.registrar(S, "  Exención por venta de vivienda de habitación", exenta,
          `tope 5.000 UVT = ${fmt(enPesos(P.exencionViviendaTopeUvt))}`, "Art. 311-1 ET",
          "Exige depositar los recursos en cuenta AFC y destinarlos a otra vivienda o a abonar el crédito hipotecario.");
        const costoExencion = pesos(exenta * P.tarifaGeneral);
        L.alertas.push(
          `'${desc}': la exención del art. 311-1 por ${fmt(exenta)} SOLO procede si los recursos de la venta se depositaron en una cuenta AFC y se destinaron a otra vivienda o a abonar el crédito hipotecario. Sin ese depósito la exención se pierde y el impuesto sube ${fmt(costoExencion)}.`,
        );
      }
    }

    exentasGO += exenta;
    const gravable = Math.max(0, utilidad - exenta);
    if (it.tipo === "loteria" || it.tipo === "rifa" || it.tipo === "premio") {
      baseLoterias += pesos(ingreso);
    } else {
      baseGeneral += gravable;
    }
  }

  if (baseGeneral > 0) {
    const val = pesos(baseGeneral * P.tarifaGeneral);
    imp += val;
    L.registrar(S, "Impuesto de ganancias ocasionales", val,
      `${fmt(baseGeneral)} × 15%`, "Arts. 313 y 314 ET", "", "go_impuesto_general");
  }
  if (baseLoterias > 0) {
    const val = pesos(baseLoterias * P.tarifaLoteriasRifas);
    imp += val;
    L.registrar(S, "Impuesto de loterías, rifas y premios", val,
      `${fmt(baseLoterias)} × 20%`, "Art. 317 ET", "", "go_impuesto_loterias");
  }

  L.registrar(S, "Ingresos por ganancias ocasionales", ingresosGO);
  L.fijarCasilla(112, ingresosGO);
  L.fijarCasilla(113, costosGO);
  L.fijarCasilla(114, exentasGO);
  L.registrar(S, "TOTAL IMPUESTO DE GANANCIAS OCASIONALES", imp, "", "", "", "go_impuesto");
  L.fijarCasilla(127, imp);
  return imp;
}

// ---------------------------------------------------------------------------
// Obligación a declarar (art. 594-3 ET): basta una condición
// ---------------------------------------------------------------------------

export interface EvaluacionObligacion {
  obligado: boolean;
  condiciones: { id: string; descripcion: string; umbral: string; valor: number | null; cumple: boolean | null }[];
}

export function evaluarObligacion(e: Expediente): EvaluacionObligacion {
  const patrimonio = monto(e.patrimonio.bruto);
  const ingresos =
    monto(e.rentasTrabajo.ingresosBrutos) + monto(e.rentasIndependientes.ingresosBrutos) + monto(e.pensiones.ingresosBrutos);
  const condiciones: EvaluacionObligacion["condiciones"] = [
    {
      id: "patrimonio_bruto",
      descripcion: "Patrimonio bruto a 31 de diciembre de 2025",
      umbral: `> 4.500 UVT (${fmt(enPesos(4500))})`,
      valor: patrimonio,
      cumple: patrimonio > enPesos(4500),
    },
    {
      id: "ingresos_brutos",
      descripcion: "Ingresos brutos totales del año",
      umbral: `≥ 1.400 UVT (${fmt(enPesos(1400))})`,
      valor: ingresos,
      cumple: ingresos >= enPesos(1400),
    },
    {
      id: "consumos_tarjeta",
      descripcion: "Consumos con tarjeta de crédito",
      umbral: `> 1.400 UVT (${fmt(enPesos(1400))})`,
      valor: esDesconocido(e.consumosTarjeta) ? null : monto(e.consumosTarjeta),
      cumple: esDesconocido(e.consumosTarjeta) ? null : monto(e.consumosTarjeta) > enPesos(1400),
    },
    {
      id: "consignaciones",
      descripcion: "Consignaciones bancarias, depósitos o inversiones",
      umbral: `> 1.400 UVT (${fmt(enPesos(1400))})`,
      valor: esDesconocido(e.consignaciones) ? null : monto(e.consignaciones),
      cumple: esDesconocido(e.consignaciones) ? null : monto(e.consignaciones) > enPesos(1400),
    },
  ];
  const obligado = condiciones.some((c) => c.cumple === true);
  return { obligado, condiciones };
}

/** Vencimiento según los dos últimos dígitos del NIT (Decreto 2229 de 2023). */
export function vencimientoPorNit(nitUltimos2: string): string | null {
  const cal = PARAMETROS_AG2025.calendarioVencimientos;
  const n = nitUltimos2.trim();
  if (!/^\d{2}$/.test(n)) return null;
  if (n === "00") return cal["99-00"] ?? null;
  const par = Number(n) % 2 === 0 ? `${Number(n) - 1}-${n}` : `${n}-${Number(n) + 1}`;
  return cal[par] ?? null;
}

// ---------------------------------------------------------------------------
// Liquidación privada completa
// ---------------------------------------------------------------------------

export function liquidar(e: Expediente): ResultadoLiquidacion {
  const L = new Liquidador();
  const S = "Liquidación privada";
  const P = PARAMETROS_AG2025;

  // Guardas de alcance (desenlace R7): casos que requieren contador.
  if (!e.contribuyente.residente || e.contribuyente.obligadoContabilidad) {
    L.alertas.push(
      !e.contribuyente.residente
        ? "El declarante no es residente fiscal: su tratamiento sale del alcance de este flujo F210 v1. Derivar a contador con el expediente armado."
        : "El declarante está obligado a llevar contabilidad: sale del alcance del flujo F210 v1. Derivar a contador con el expediente armado.",
    );
  }

  // ── Patrimonio (casillas 29-31) ──
  const bruto = monto(e.patrimonio.bruto);
  const deudas = monto(e.patrimonio.deudas);
  L.registrar("Patrimonio", "Total patrimonio bruto a 31 de diciembre", bruto, "", "", "", "patrimonio_bruto");
  L.registrar("Patrimonio", "Deudas", deudas, "", "", "", "patrimonio_deudas");
  L.registrar("Patrimonio", "Total patrimonio líquido", Math.max(0, bruto - deudas),
    `${fmt(bruto)} − ${fmt(deudas)}`, "", "", "patrimonio_liquido");
  L.fijarCasilla(29, bruto);
  L.fijarCasilla(30, deudas);
  L.fijarCasilla(31, Math.max(0, bruto - deudas));
  if (deudas > bruto && bruto > 0) {
    L.alertas.push(
      `Las deudas (${fmt(deudas)}) superan el patrimonio bruto (${fmt(bruto)}): verificar certificados de deuda y valorización de activos.`,
    );
  }

  // ── Cédulas ──
  const rlGeneral = liquidarCedulaGeneral(e, L);
  const rlPension = liquidarPensiones(e, L);
  const div = liquidarDividendos(0, 0, L); // v1: dividendos se llenan por la entrevista avanzada; por defecto 0

  const rlg = rlGeneral + rlPension + div.rentaLiquida;
  L.registrar(S, "RENTA LÍQUIDA GRAVABLE TOTAL", rlg,
    `cédula general ${fmt(rlGeneral)} + pensiones ${fmt(rlPension)} + dividendos ${fmt(div.rentaLiquida)}`,
    "Art. 331 ET", "", "renta_liquida_gravable");

  const { impuesto, formula } = impuestoTabla241(rlg);
  L.registrar(S, "Impuesto sobre la renta líquida gravable", impuesto, formula, "Art. 241 ET", "", "impuesto_renta");
  L.fijarCasilla(116, impuesto);

  // ── Casillas cedulares con las fórmulas oficiales del instructivo F210 v16 ──
  // 91 = 41 + 42 + 53 + 57 + 69 + 73 + 86 + 90 (v1: capital y no laborales en 0)
  // 92 = 28 + 41 + 53 + 69 + 86 + 139
  // 93 = 91 − 92 · 97 = 93 + 96 − 94 − 95 (v1: 94/95/96 en 0)
  const cas = (n: number) => L.casillas[n] ?? 0;
  const c91 = cas(41) + cas(42) + cas(53) + cas(57) + cas(69) + cas(73) + cas(86) + cas(90);
  L.fijarCasilla(91, c91);
  L.registrar(S, "Renta líquida cédula general (casilla 91)", c91,
    "41 + 42 + 53 + 57 + 69 + 73 + 86 + 90", "Instructivo F210, Res. DIAN 000044/2024");
  const c92 = cas(28) + cas(41) + cas(53) + cas(69) + cas(86) + cas(139);
  L.fijarCasilla(92, c92);
  L.registrar(S, "Rentas exentas y deducciones imputables limitadas (casilla 92)", c92,
    "28 + 41 + 53 + 69 + 86 + 139", "Instructivo F210, Res. DIAN 000044/2024");
  const c93 = Math.max(0, c91 - c92);
  if (c91 - c92 < 0) {
    L.alertas.push(
      "Las casillas cedulares arrojan un exceso de beneficios sobre la renta líquida: verificar el reparto de deducciones entre bloques (v1 los imputa al bloque de salarios primero).",
    );
  }
  L.fijarCasilla(93, c93);
  L.registrar(S, "Renta líquida ordinaria cédula general (casilla 93)", c93, "91 − 92",
    "Instructivo F210, Res. DIAN 000044/2024", "", "cg_renta_liquida_casilla_93");
  L.fijarCasilla(96, 0);
  L.fijarCasilla(94, 0);
  L.fijarCasilla(95, 0);
  L.fijarCasilla(97, c93);
  L.registrar(S, "Renta líquida gravable cédula general (casilla 97)", c93,
    "93 + 96 − 94 − 95", "Instructivo F210, Res. DIAN 000044/2024", "", "cg_rlg_casilla_97");
  L.fijarCasilla(98, 0); // renta presuntiva: no calculada en v1 (requiere patrimonio del año anterior)

  // ── Descuentos tributarios (limitados al impuesto) ──
  let descuentos = div.descuento2541;
  descuentos = Math.min(descuentos, impuesto);
  if (div.descuento2541 > 0) {
    L.registrar(S, "Total descuentos tributarios", descuentos,
      `limitados al impuesto sobre la renta (${fmt(impuesto)})`, "Arts. 259-ET y 254-1 ET", "", "descuentos");
    L.fijarCasilla(125, descuentos);
  }

  const impuestoNeto = Math.max(0, impuesto - descuentos);
  L.registrar(S, "IMPUESTO NETO DE RENTA", impuestoNeto, `${fmt(impuesto)} − ${fmt(descuentos)}`,
    "", "", "impuesto_neto_renta");
  L.fijarCasilla(126, impuestoNeto);

  // ── Ganancias ocasionales (casilla 127) ──
  const impGO = liquidarGananciasOcasionales(e.gananciasOcasionales ?? [], L);

  const totalCargo = impuestoNeto + impGO + div.impuesto35;
  L.registrar(S, "TOTAL IMPUESTO A CARGO", totalCargo,
    `impuesto neto ${fmt(impuestoNeto)} + ganancias ocasionales ${fmt(impGO)}` +
      (div.impuesto35 > 0 ? ` + 35% dividendos gravados ${fmt(div.impuesto35)}` : ""),
    "", "", "total_impuesto_cargo");
  L.fijarCasilla(129, totalCargo);

  // ── Retenciones, anticipos y saldos ──
  const totalRet = monto(e.retenciones.rentasTrabajo) + monto(e.retenciones.otras);
  L.registrar(S, "Total retenciones en la fuente del año", totalRet, "", "", "", "retenciones");
  L.fijarCasilla(132, totalRet);

  const antAnterior = monto(e.anticipos.anticipoAnioAnterior);
  const saldoFavorAnterior = monto(e.anticipos.saldoFavorAnioAnterior);
  if (antAnterior > 0) {
    L.registrar(S, "Anticipo liquidado en la declaración del año anterior", antAnterior, "", "", "", "anticipo_anterior");
    L.fijarCasilla(130, antAnterior);
  }
  if (saldoFavorAnterior > 0) {
    L.registrar(S, "Saldo a favor del año anterior sin solicitud de devolución", saldoFavorAnterior, "", "", "", "saldo_favor_anterior");
    L.fijarCasilla(131, saldoFavorAnterior);
  }

  // Anticipo del año siguiente (art. 807 ET): opción más favorable permitida.
  const pct = e.primerAnioDeclarando
    ? P.anticipo.porcentajePrimerAnio
    : P.anticipo.porcentajeGeneral;
  const opcionA = Math.max(0, pesos(impuestoNeto * pct) - totalRet);
  let anticipo = opcionA;
  let formulaAnticipo = `opción impuesto del año: ${(pct * 100).toFixed(0)}% de ${fmt(impuestoNeto)} − retenciones = ${fmt(opcionA)}`;
  if (e.impuestoNetoAnioAnterior != null && !e.primerAnioDeclarando) {
    const promedio = (impuestoNeto + e.impuestoNetoAnioAnterior) / 2;
    const opcionB = Math.max(0, pesos(promedio * P.anticipo.porcentajeGeneral) - totalRet);
    formulaAnticipo += `; opción promedio de dos años: 75% de ${fmt(promedio)} − retenciones = ${fmt(opcionB)}`;
    anticipo = Math.min(opcionA, opcionB);
  }
  L.registrar(S, "Anticipo del impuesto para el año siguiente", anticipo, formulaAnticipo,
    "Art. 807 ET", "Se toma la opción más favorable permitida por la norma.", "anticipo_siguiente");
  L.fijarCasilla(133, anticipo);

  const saldo = totalCargo + anticipo - totalRet - antAnterior - saldoFavorAnterior;
  let desenlace: ResultadoLiquidacion["desenlace"];
  if (saldo >= 0) {
    const pagar = aproxMil(saldo);
    L.registrar(S, "SALDO A PAGAR", pagar,
      `impuesto a cargo ${fmt(totalCargo)} + anticipo ${fmt(anticipo)} − retenciones ${fmt(totalRet)} − anticipo anterior ${fmt(antAnterior)} − saldo a favor anterior ${fmt(saldoFavorAnterior)}`,
      "Art. 577 ET (aproximación al mil más cercano)", "", "saldo_a_pagar");
    L.valores["saldo_a_favor"] = 0;
    L.fijarCasilla(134, pagar);
    L.fijarCasilla(136, pagar);
    L.fijarCasilla(137, 0);
    desenlace = pagar === 0 ? "R4_impuesto_cero" : "R2_saldo_a_pagar";
  } else {
    const favor = aproxMil(-saldo);
    L.registrar(S, "SALDO A FAVOR", favor,
      "retenciones y anticipos superan el impuesto a cargo más el anticipo",
      "Art. 577 ET (aproximación al mil más cercano)", "", "saldo_a_favor");
    L.valores["saldo_a_pagar"] = 0;
    L.fijarCasilla(134, 0);
    L.fijarCasilla(136, 0);
    L.fijarCasilla(137, favor);
    desenlace = "R3_saldo_a_favor";
  }

  // Obligación a declarar (R1): si no obligado y sin saldo a pagar → informe.
  const obligacion = evaluarObligacion(e);
  if (!obligacion.obligado && desenlace === "R4_impuesto_cero") {
    desenlace = "R1_no_obligado";
    L.alertas.push(
      "Con los datos actuales no se cumple ninguna condición de obligación a declarar (art. 594-3 ET). Puede declarar voluntariamente (art. 6 ET): evaluate conveniencia con un contador.",
    );
  }

  // Datos desconocidos → pendientes (jamás se rellenan con ceros).
  const pendientes = listarPendientes(e);
  if (!e.contribuyente.residente || e.contribuyente.obligadoContabilidad) {
    desenlace = "R7_fuera_de_alcance";
  }

  return {
    valores: L.valores,
    casillas: L.casillas,
    memoria: L.memoria,
    alertas: L.alertas,
    pendientes,
    desenlace,
    casilla140: L.casilla140,
    pctCostos336_1: L.pctCostos336_1,
    vencimiento: vencimientoPorNit(e.contribuyente.nitUltimos2),
  };
}

// ---------------------------------------------------------------------------
// Auditor de pendientes: lista explícita de lo desconocido (nunca se asume)
// ---------------------------------------------------------------------------

export function listarPendientes(e: Expediente): string[] {
  const p: string[] = [];
  const ruta: [string, DatoConOrigen<number>][] = [
    ["Rentas de trabajo · ingresos brutos (casilla 32)", e.rentasTrabajo.ingresosBrutos],
    ["Rentas de trabajo · aportes obligatorios a salud (casilla 33)", e.rentasTrabajo.aportesObligatoriosSalud],
    ["Rentas de trabajo · aportes obligatorios a pensión (casilla 33)", e.rentasTrabajo.aportesObligatoriosPension],
    ["Rentas de trabajo sin relación laboral · ingresos brutos (casilla 43)", e.rentasIndependientes.ingresosBrutos],
    ["Deducciones · intereses de vivienda (casilla 38)", e.deducciones.interesesVivienda],
    ["Deducciones · medicina prepagada", e.deducciones.medicinaPrepagada],
    ["Deducciones · GMF 4x1000 pagado", e.deducciones.gmfPagado],
    ["Deducciones · compras con factura electrónica", e.deducciones.comprasFacturaElectronica],
    ["Rentas exentas · aportes voluntarios a pensión (casilla 35)", e.rentasExentas.aportesVoluntariosPension],
    ["Rentas exentas · AFC", e.rentasExentas.afc],
    ["Patrimonio · patrimonio bruto (casilla 29)", e.patrimonio.bruto],
    ["Patrimonio · deudas (casilla 30)", e.patrimonio.deudas],
    ["Retenciones en la fuente (casilla 132)", e.retenciones.rentasTrabajo],
    ["Consumos con tarjeta de crédito (obligación a declarar)", e.consumosTarjeta],
    ["Consignaciones bancarias (obligación a declarar)", e.consignaciones],
  ];
  for (const [nombre, dato] of ruta) {
    if (esDesconocido(dato)) p.push(nombre);
  }
  if (e.contribuyente.nitUltimos2.trim().length !== 2) {
    p.push("Identidad · dos últimos dígitos del NIT (vencimiento y calendario)");
  }
  return p;
}

// ---------------------------------------------------------------------------
// Formato legible de pesos
// ---------------------------------------------------------------------------

export function fmt(valor: number): string {
  return `$${Math.round(valor).toLocaleString("es-CO")}`;
}
