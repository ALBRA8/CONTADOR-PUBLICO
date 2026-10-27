/// <reference types="bun-types" />
/**
 * PRUEBAS DEL MOTOR TRIBUTARIO F210 — CONTADOR PÚBLICO ALBRA
 * ===========================================================
 * Fase 5 del Prompt Maestro (pruebas y validación tributaria):
 *  1. Paridad contra los casos golden de open-renta (referente ADOPTAR, MIT),
 *     ejecutados con su motor Python verificado a mano (scripts/open-renta-ref/golden-*.json).
 *  2. Invariantes del motor (el límite del 40% nunca se excede, la tabla 241 es
 *     continua en cada frontera, los saldos son excluyentes).
 *  3. Reglas de la exógena y de datos desconocidos (nunca se asume una cifra).
 *  4. Obligación a declarar (art. 594-3 ET).
 */

import { describe, test, expect } from "bun:test";
import {
  liquidar,
  impuestoTabla241,
  evaluarObligacion,
  aproxMil,
  pesos,
  enPesos,
} from "../src/lib/albra/motor";
import { expedienteVacio, fusionarExpediente, Expediente } from "../src/lib/albra/tipos";
import { PARAMETROS_AG2025 } from "../src/lib/albra/parametros";
import { ingestarCsv, ingestarTextoPdf, aplicarSugeridos, parseNumero } from "../src/lib/albra/ingesta";

// ---------------------------------------------------------------------------
// Casos golden (idénticos a tests/casos/a_asalariado.json y b_independiente.json
// del repositorio open-renta; resultados esperados tomados de su motor ejecutado)
// ---------------------------------------------------------------------------

function casoA(): Expediente {
  const e = expedienteVacio();
  e.contribuyente = {
    alias: "caso-a",
    nitUltimos2: "29",
    residente: true,
    obligadoContabilidad: false,
    dependientes: 2,
  };
  e.rentasTrabajo = {
    ingresosBrutos: { valor: 180_000_000, procedencia: "confirmado" },
    aportesObligatoriosSalud: { valor: 7_200_000, procedencia: "confirmado" },
    aportesObligatoriosPension: { valor: 7_200_000, procedencia: "confirmado" },
    aportesFsp: { valor: null, procedencia: "desconocido" },
  };
  e.deducciones = {
    interesesVivienda: { valor: 18_000_000, procedencia: "confirmado" },
    medicinaPrepagada: { valor: 9_600_000, procedencia: "confirmado" },
    icetex: { valor: null, procedencia: "desconocido" },
    gmfPagado: { valor: 1_200_000, procedencia: "confirmado" },
    comprasFacturaElectronica: { valor: 60_000_000, procedencia: "confirmado" },
  };
  e.patrimonio = {
    bruto: { valor: 400_000_000, procedencia: "confirmado" },
    deudas: { valor: 150_000_000, procedencia: "confirmado" },
    anioAnteriorBruto: { valor: null, procedencia: "desconocido" },
    anioAnteriorDeudas: { valor: null, procedencia: "desconocido" },
  };
  e.retenciones = {
    rentasTrabajo: { valor: 12_000_000, procedencia: "documento" },
    otras: { valor: null, procedencia: "desconocido" },
  };
  e.impuestoNetoAnioAnterior = 6_000_000;
  return e;
}

function casoB(): Expediente {
  const e = expedienteVacio();
  e.contribuyente = {
    alias: "caso-b",
    nitUltimos2: "45",
    residente: true,
    obligadoContabilidad: false,
    dependientes: 1,
  };
  e.rentasIndependientes = {
    ingresosBrutos: { valor: 120_000_000, procedencia: "confirmado" },
    aportesObligatoriosSalud: { valor: 6_000_000, procedencia: "confirmado" },
    aportesObligatoriosPension: { valor: 7_680_000, procedencia: "confirmado" },
    costosGastos: { valor: 42_000_000, procedencia: "confirmado" },
  };
  e.deducciones = {
    interesesVivienda: { valor: null, procedencia: "desconocido" },
    medicinaPrepagada: { valor: null, procedencia: "desconocido" },
    icetex: { valor: null, procedencia: "desconocido" },
    gmfPagado: { valor: 800_000, procedencia: "confirmado" },
    comprasFacturaElectronica: { valor: 24_000_000, procedencia: "confirmado" },
  };
  e.patrimonio = {
    bruto: { valor: 210_000_000, procedencia: "confirmado" },
    deudas: { valor: 40_000_000, procedencia: "confirmado" },
    anioAnteriorBruto: { valor: null, procedencia: "desconocido" },
    anioAnteriorDeudas: { valor: null, procedencia: "desconocido" },
  };
  e.retenciones = {
    rentasTrabajo: { valor: 11_400_000, procedencia: "documento" },
    otras: { valor: null, procedencia: "desconocido" },
  };
  e.impuestoNetoAnioAnterior = 4_200_000;
  return e;
}

// ---------------------------------------------------------------------------
// 1. Paridad con el motor de referencia (open-renta, MIT)
// ---------------------------------------------------------------------------

describe("Paridad caso A (asalariado, 2 dependientes)", () => {
  const r = liquidar(casoA());

  test("cédula general", () => {
    expect(r.valores["cg_ingresos_brutos"]).toBe(180_000_000);
    expect(r.valores["cg_incrngo"]).toBe(14_400_000);
    expect(r.valores["cg_base_limite"]).toBe(165_600_000);
    expect(r.valores["cg_limite"]).toBe(66_240_000);
    expect(r.valores["cg_exentas_deducciones"]).toBe(66_240_000);
    expect(r.valores["cg_dependientes_336"]).toBe(7_171_056);
    expect(r.valores["cg_factura_electronica"]).toBe(600_000);
    expect(r.valores["cg_renta_liquida_gravable"]).toBe(91_588_944);
  });

  test("liquidación privada", () => {
    expect(r.valores["renta_liquida_gravable"]).toBe(91_588_944);
    expect(r.valores["impuesto_renta"]).toBe(7_717_264);
    expect(r.valores["impuesto_neto_renta"]).toBe(7_717_264);
    expect(r.valores["total_impuesto_cargo"]).toBe(7_717_264);
    expect(r.valores["retenciones"]).toBe(12_000_000);
    expect(r.valores["anticipo_siguiente"]).toBe(0);
    expect(r.valores["saldo_a_favor"]).toBe(4_283_000);
    expect(r.valores["saldo_a_pagar"]).toBe(0);
    expect(r.desenlace).toBe("R3_saldo_a_favor");
    expect(r.casilla140).toBe(false);
  });

  test("casillas del formulario 210 (muestra del README del referente)", () => {
    expect(r.casillas[32]).toBe(180_000_000);
    expect(r.casillas[33]).toBe(14_400_000);
    expect(r.casillas[34]).toBe(165_600_000);
    expect(r.casillas[91]).toBe(165_600_000);
    expect(r.casillas[92]).toBe(74_011_056);
    expect(r.casillas[93]).toBe(91_588_944);
    expect(r.casillas[137]).toBe(4_283_000);
  });

  test("memoria de cálculo trazable con normas", () => {
    expect(r.memoria.length).toBeGreaterThan(15);
    const paso92 = r.memoria.find((p) => p.concepto.includes("casilla 92"));
    expect(paso92?.formula).toContain("139");
    expect(r.memoria.some((p) => p.norma.includes("336"))).toBe(true);
    expect(r.memoria.some((p) => p.norma.includes("241"))).toBe(true);
  });
});

describe("Paridad caso B (independiente con costos, 1 dependiente)", () => {
  const r = liquidar(casoB());

  test("cédula general", () => {
    expect(r.valores["cg_ingresos_brutos"]).toBe(120_000_000);
    expect(r.valores["cg_incrngo"]).toBe(13_680_000);
    expect(r.valores["cg_costos"]).toBe(42_000_000);
    expect(r.valores["cg_base_limite"]).toBe(64_320_000);
    expect(r.valores["cg_limite"]).toBe(25_728_000);
    expect(r.valores["cg_exentas_deducciones"]).toBe(12_400_000);
    expect(r.valores["cg_dependientes_336"]).toBe(3_585_528);
    expect(r.valores["cg_factura_electronica"]).toBe(240_000);
    expect(r.valores["cg_renta_liquida_gravable"]).toBe(48_094_472);
  });

  test("renta exenta 25% NO aplica con costos en honorarios", () => {
    // Caso B tiene costos de 42M sobre honorarios: la renta exenta del 25%
    // no puede aplicarse (art. 206 num. 10 parágrafo). Lo aplicado (12.4M)
    // es solo GMF (0.4M) + dependientes art. 387 (12M).
    expect(r.valores["cg_exentas_deducciones"]).toBe(12_400_000);
    expect(r.memoria.some((p) => p.concepto.includes("Renta exenta 25%"))).toBe(false);
  });

  test("liquidación privada", () => {
    expect(r.valores["renta_liquida_gravable"]).toBe(48_094_472);
    // 48.094.472 COP = 965,77 UVT → rango exento de la tabla 241 → impuesto 0.
    expect(r.valores["impuesto_renta"]).toBe(0);
    expect(r.valores["total_impuesto_cargo"]).toBe(0);
    expect(r.valores["saldo_a_favor"]).toBe(11_400_000);
    expect(r.desenlace).toBe("R3_saldo_a_favor");
  });

  test("alerta de pérdida de renta exenta", () => {
    expect(r.alertas.some((a) => a.includes("renta exenta del 25%"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. Invariantes del motor
// ---------------------------------------------------------------------------

describe("Invariantes", () => {
  test("la tabla 241 es continua en cada frontera", () => {
    const p = PARAMETROS_AG2025;
    for (let i = 1; i < p.tabla241.length; i++) {
      const frontera = p.tabla241[i].desde;
      const antes = impuestoTabla241(enPesos(frontera - 0.01));
      const despues = impuestoTabla241(enPesos(frontera));
      const salto = despues.impuesto - antes.impuesto;
      const uvtFrontera = enPesos(frontera);
      // El salto entre la frontera−ε y la frontera nunca puede superar 1 UVT de impuesto.
      expect(salto).toBeLessThanOrEqual(p.uvtAnioGravable);
      expect(uvtFrontera).toBeGreaterThan(0);
    }
  });

  test("el límite del 40%/1.340 UVT nunca se excede", () => {
    const r = liquidar(casoA());
    expect(r.valores["cg_exentas_deducciones"]).toBeLessThanOrEqual(r.valores["cg_limite"]);
  });

  test("los saldos son excluyentes (134/136 vs 137)", () => {
    const a = liquidar(casoA());
    expect(a.casillas[137]).toBeGreaterThan(0);
    expect(a.casillas[134]).toBe(0);
    expect(a.casillas[136]).toBe(0);
    const b = liquidar(casoB());
    expect(b.casillas[137]).toBe(11_400_000);
    expect(b.casillas[134]).toBe(0);
  });

  test("aproximación al mil más cercano (art. 577 ET)", () => {
    expect(aproxMil(4_282_736)).toBe(4_283_000);
    expect(aproxMil(1_499)).toBe(1_000);
    expect(aproxMil(1_500)).toBe(2_000);
    expect(pesos(1.4)).toBe(1);
    expect(pesos(1.5)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// 3. Datos desconocidos: nunca se asume, nunca se inventa
// ---------------------------------------------------------------------------

describe("Gestión de datos desconocidos", () => {
  test("un expediente vacío produce pendientes, no cifras inventadas", () => {
    const r = liquidar(expedienteVacio());
    expect(r.pendientes.length).toBeGreaterThan(10);
    expect(r.valores["cg_ingresos_brutos"]).toBe(0);
    expect(r.pendientes.some((p) => p.includes("ingresos brutos"))).toBe(true);
    expect(r.pendientes.some((p) => p.includes("NIT"))).toBe(true);
  });

  test("la única alerta con datos vacíos es el aviso de no-obligación (honesto, no inventa)", () => {
    const r = liquidar(expedienteVacio());
    expect(r.alertas.length).toBe(1);
    expect(r.alertas[0]).toContain("no se cumple ninguna condición de obligación");
    expect(r.desenlace).toBe("R1_no_obligado");
  });
});

// ---------------------------------------------------------------------------
// 4. Obligación a declarar (art. 594-3 ET)
// ---------------------------------------------------------------------------

describe("Obligación a declarar", () => {
  test("ingresos ≥ 1.400 UVT obligan", () => {
    const e = expedienteVacio();
    e.rentasTrabajo.ingresosBrutos = { valor: enPesos(1400), procedencia: "confirmado" };
    const o = evaluarObligacion(e);
    expect(o.obligado).toBe(true);
  });

  test("patrimonio > 4.500 UVT obliga", () => {
    const e = expedienteVacio();
    e.patrimonio.bruto = { valor: enPesos(4501), procedencia: "confirmado" };
    const o = evaluarObligacion(e);
    expect(o.obligado).toBe(true);
  });

  test("por debajo de todos los topes no obliga", () => {
    const e = expedienteVacio();
    e.rentasTrabajo.ingresosBrutos = { valor: enPesos(1399), procedencia: "confirmado" };
    e.patrimonio.bruto = { valor: enPesos(4500), procedencia: "confirmado" };
    const o = evaluarObligacion(e);
    expect(o.obligado).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5. Ganancias ocasionales
// ---------------------------------------------------------------------------

describe("Ganancias ocasionales", () => {
  test("activo fijo con menos de 2 años se reclasifica a renta ordinaria", () => {
    const e = expedienteVacio();
    e.gananciasOcasionales = [
      {
        tipo: "venta_activo_fijo",
        descripcion: "Lote",
        ingreso: 50_000_000,
        costoFiscal: 30_000_000,
        aniosPosesion: 1,
      },
    ];
    const r = liquidar(e);
    // El ítem se excluye del cálculo (se reclasifica a renta ordinaria) y el
    // impuesto de ganancias ocasionales queda en cero.
    expect(r.valores["go_impuesto"]).toBe(0);
    expect(r.casillas[112]).toBe(0);
    expect(r.alertas.some((a) => a.includes("RENTA ORDINARIA"))).toBe(true);
  });

  test("venta de acciones con más de 2 años grava al 15%", () => {
    const e = expedienteVacio();
    e.gananciasOcasionales = [
      {
        tipo: "venta_activo_fijo",
        descripcion: "Acciones",
        ingreso: 50_000_000,
        costoFiscal: 30_000_000,
        aniosPosesion: 3,
      },
    ];
    const r = liquidar(e);
    expect(r.valores["go_impuesto"]).toBe(3_000_000); // 15% de 20M
    expect(r.casillas[127]).toBe(3_000_000);
  });

  test("exención de vivienda art. 311-1 con tope de 5.000 UVT", () => {
    const e = expedienteVacio();
    e.gananciasOcasionales = [
      {
        tipo: "venta_activo_fijo",
        descripcion: "Casa de habitación",
        ingreso: 300_000_000,
        costoFiscal: 100_000_000,
        aniosPosesion: 5,
        exencion: "vivienda_habitacion_311_1",
        valorCatastral: 100_000_000, // < 15.000 UVT
      },
    ];
    const r = liquidar(e);
    // Utilidad 200M < tope de 5.000 UVT (248.995.000): la exención cubre toda la
    // utilidad y la ganancia gravable es cero.
    expect(r.casillas[114]).toBe(200_000_000);
    expect(r.valores["go_impuesto"]).toBe(0);
    // Y exige la advertencia del depósito AFC
    expect(r.alertas.some((a) => a.includes("cuenta AFC"))).toBe(true);
  });

  test("exención de vivienda limitada por utilidad vs tope y 15% sobre el exceso", () => {
    const e = expedienteVacio();
    e.gananciasOcasionales = [
      {
        tipo: "venta_activo_fijo",
        descripcion: "Apartamento",
        ingreso: 500_000_000,
        costoFiscal: 150_000_000,
        aniosPosesion: 6,
        exencion: "vivienda_habitacion_311_1",
        valorCatastral: 100_000_000, // < 15.000 UVT
      },
    ];
    const r = liquidar(e);
    const topeExencion = PARAMETROS_AG2025.uvtAnioGravable * 5000; // 248.995.000
    expect(r.casillas[114]).toBe(topeExencion); // utilidad 350M > tope
    // Grava el exceso: (350M − tope) × 15%
    expect(r.valores["go_impuesto"]).toBe(pesos((350_000_000 - topeExencion) * 0.15));
    expect(r.alertas.some((a) => a.includes("cuenta AFC"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. v1.1 — Rentas de capital, dividendos y renta presuntiva
// ---------------------------------------------------------------------------

function datoC(valor: number | null): { valor: number | null; procedencia: "confirmado" | "desconocido" } {
  return valor === null ? { valor: null, procedencia: "desconocido" } : { valor, procedencia: "confirmado" };
}

describe("v1.1 · Rentas de capital (casillas 58-73)", () => {
  test("los rendimientos financieros gravados fluyen 58 → 61 → 73 → 91 y tributan con la tabla", () => {
    const e = expedienteVacio();
    e.contribuyente = { alias: "c", nitUltimos2: "11", residente: true, obligadoContabilidad: false, dependientes: 0 };
    e.rentasCapital = { ingresosBrutos: datoC(12_000_000), incrngo: datoC(null), costosGastos: datoC(null) } as never;
    const r = liquidar(e);
    expect(r.casillas[58]).toBe(12_000_000);
    expect(r.casillas[61]).toBe(12_000_000);
    expect(r.casillas[73]).toBe(12_000_000);
    expect(r.casillas[91]).toBe(12_000_000); // la casilla 73 entra en la 91
    expect(r.valores["renta_liquida_gravable"]).toBe(12_000_000);
  });

  test("pérdida de capital: casilla 71, renta líquida cero y alerta de compensación 5 años", () => {
    const e = expedienteVacio();
    e.contribuyente = { alias: "c2", nitUltimos2: "11", residente: true, obligadoContabilidad: false, dependientes: 0 };
    e.rentasCapital = { ingresosBrutos: datoC(5_000_000), incrngo: datoC(null), costosGastos: datoC(8_000_000) } as never;
    const r = liquidar(e);
    expect(r.casillas[71]).toBe(3_000_000);
    expect(r.casillas[73]).toBe(0);
    expect(r.casillas[91]).toBe(0);
    expect(r.alertas.some((a) => a.includes("compensación"))).toBe(true);
  });
});

describe("v1.1 · Cédula de dividendos — paridad golden-e (motor open-renta ejecutado)", () => {
  function casoE(): Expediente {
    const e = casoA();
    e.contribuyente.dependientes = 0; // caso-e de open-renta: sin dependientes
    e.dividendos = { noGravados: datoC(50_000_000), gravados: datoC(30_000_000), delExterior: datoC(null), exentasExterior: datoC(null) } as never;
    return e;
  }
  const r = liquidar(casoE());

  test("paridad con scripts/open-renta-ref/golden-e.json (su motor Python real)", () => {
    expect(r.valores["cg_renta_liquida_gravable"]).toBe(102_478_944);
    expect(r.valores["div_base_111"]).toBe(69_500_000); // open-renta: div_renta_liquida = 50M + (30M − 10,5M)
    expect(r.valores["renta_liquida_gravable"]).toBe(171_978_944); // casilla 111
    expect(r.valores["impuesto_renta"]).toBe(30_226_464); // tabla 241 sobre la 111
  });

  test("casillas oficiales 107/108/118 y fórmula de la casilla 111 del instructivo", () => {
    expect(r.casillas[107]).toBe(50_000_000); // 1a. subcédula (num. 3 art. 49)
    expect(r.casillas[108]).toBe(30_000_000); // 2a. subcédula (par. 2 art. 49)
    expect(r.casillas[118]).toBe(10_500_000); // 35% × 30M
    expect(r.casillas[111]).toBe(171_978_944); // max(97, 98) + 103 + 107 + (108 − 118)
    expect(r.casillas[121]).toBe(40_726_464); // 116 + 118
  });

  test("divergencia documentada del 254-1: SOLO los dividendos GRAVADOS dan descuento", () => {
    // open-renta liquida el descuento sobre el TOTAL (80M → $4.886.627). El art. 254-1
    // exige dividendos gravados con la tarifa del par. 2 art. 49: gravados 30M =
    // 602,43 UVT < 1.090 UVT → descuento 0. Divergencia registrada en FICHA §v1.1.
    expect(r.casillas[124]).toBe(0);

    const e80 = casoA();
    e80.dividendos = { noGravados: datoC(0), gravados: datoC(80_000_000), delExterior: datoC(null), exentasExterior: datoC(null) } as never;
    const r80 = liquidar(e80);
    expect(r80.casillas[118]).toBe(28_000_000);
    expect(r80.casillas[111]).toBe(143_588_944); // 91.588.944 + (80M − 28M)
    expect(r80.casillas[116]).toBe(22_277_264);
    expect(r80.casillas[124]).toBe(4_886_627); // 19% de (1.606,46 − 1.090) UVT de GRAVADOS
    expect(r80.casillas[126]).toBe(45_390_637); // instructivo: 126 = 121 − 125
  });

  test("dividendos del exterior: 35% en la casilla 120 y NO integran la casilla 111", () => {
    const e = casoA();
    e.dividendos = { noGravados: datoC(null), gravados: datoC(null), delExterior: datoC(20_000_000), exentasExterior: datoC(5_000_000) } as never;
    const rExt = liquidar(e);
    expect(rExt.casillas[109]).toBe(20_000_000);
    expect(rExt.casillas[110]).toBe(5_000_000);
    expect(rExt.casillas[120]).toBe(5_250_000); // (20M − 5M) × 35%
    expect(rExt.casillas[111]).toBe(91_588_944); // el exterior no entra a la tabla
    expect(rExt.casillas[121]).toBe(12_967_264); // 7.717.264 + 5.250.000
  });
});

describe("v1.1 · Renta presuntiva (casilla 98, art. 189-5 ET)", () => {
  test("0,5% del patrimonio líquido anterior; el impuesto usa la mayor (casilla 111)", () => {
    const e = expedienteVacio();
    e.contribuyente = { alias: "p", nitUltimos2: "10", residente: true, obligadoContabilidad: false, dependientes: 0 };
    e.patrimonio = {
      bruto: datoC(null), deudas: datoC(null),
      anioAnteriorBruto: datoC(300_000_000), anioAnteriorDeudas: datoC(50_000_000),
    } as never;
    const r = liquidar(e);
    expect(r.casillas[98]).toBe(1_250_000); // 0,5% × 250M
    expect(r.casillas[111]).toBe(1_250_000); // la presuntiva supera la renta líquida (0)
    expect(r.alertas.some((a) => a.includes("presuntiva") && a.includes("compensación"))).toBe(true);
  });

  test("si la renta líquida supera la presuntiva, la base no cambia y no hay alerta", () => {
    const e = casoA();
    e.patrimonio.anioAnteriorBruto = datoC(300_000_000) as never;
    e.patrimonio.anioAnteriorDeudas = datoC(50_000_000) as never;
    const r = liquidar(e);
    expect(r.casillas[98]).toBe(1_250_000);
    expect(r.valores["renta_liquida_gravable"]).toBe(91_588_944); // sigue siendo la 97
    expect(r.alertas.filter((a) => a.includes("presuntiva"))).toHaveLength(0);
  });

  test("sin datos del año anterior la presuntiva NO se inventa (queda sin verificar)", () => {
    const r = liquidar(casoA());
    expect(r.casillas[98]).toBe(0);
    expect(r.memoria.some((p) => p.concepto.includes("sin verificar"))).toBe(true);
  });
});

describe("v1.1 · Obligación a declarar con rentas de capital y dividendos", () => {
  test("los rendimientos de capital cuentan para los 1.400 UVT", () => {
    const e = expedienteVacio();
    e.rentasCapital = { ingresosBrutos: datoC(enPesos(1400)), incrngo: datoC(null), costosGastos: datoC(null) } as never;
    expect(evaluarObligacion(e).obligado).toBe(true);
  });
  test("los dividendos cuentan para los 1.400 UVT", () => {
    const e = expedienteVacio();
    e.dividendos = { noGravados: datoC(enPesos(1400)), gravados: datoC(null), delExterior: datoC(null), exentasExterior: datoC(null) } as never;
    expect(evaluarObligacion(e).obligado).toBe(true);
  });
});

describe("v1.1 · Ingesta de documentos (Módulo 3, trazabilidad)", () => {
  test("CSV: clasifica y deja los no reconocidos para revisión humana; aplica con procedencia documento", () => {
    const res = ingestarCsv(
      "Salarios;180.000.000\nAportes obligatorios a salud;7.200.000\nIntereses de vivienda;18.000.000\nRetención en la fuente;12.000.000\nConcepto raro;123\n",
      "certificado.csv",
    );
    expect(res.sugeridos).toHaveLength(4);
    expect(res.sugeridos[0]).toMatchObject({ ruta: "rentasTrabajo.ingresosBrutos", valor: 180_000_000 });
    expect(res.sugeridos[3]).toMatchObject({ ruta: "retenciones.rentasTrabajo", valor: 12_000_000 });
    expect(res.noClasificados).toHaveLength(1);
    const e2 = aplicarSugeridos(expedienteVacio(), res.sugeridos, "certificado.csv");
    expect(e2.rentasTrabajo.ingresosBrutos).toMatchObject({ valor: 180_000_000, procedencia: "documento", origen: "certificado.csv" });
    expect(e2.deducciones.interesesVivienda.procedencia).toBe("documento");
  });

  test("parseNumero tolera formatos colombianos e internacionales", () => {
    expect(parseNumero("1.234.567")).toBe(1_234_567);
    expect(parseNumero("$ 180.000.000")).toBe(180_000_000);
    expect(parseNumero("1,234,567.89")).toBe(1_234_567.89);
    expect(parseNumero("1.234.567,89")).toBe(1_234_567.89);
    expect(parseNumero("(150)")).toBe(-150);
    expect(parseNumero("abc")).toBeNull();
  });

  test("PDF 220: los reconocedores de etiquetas DIAN extraen los datos del certificado", () => {
    const res = ingestarTextoPdf(
      [
        "CERTIFICADO DE INGRESOS Y RETENCIONES POR SALARIOS - 2025",
        "Ingresos brutos $ 180.000.000",
        "Aportes obligatorios a salud $ 7.200.000",
        "Aportes obligatorios a pensión $ 7.200.000",
        "Aportes a cuentas AFC $ 5.000.000",
        "Intereses de crédito de vivienda $ 18.000.000",
        "Retención en la fuente $ 12.000.000",
      ].join("\n"),
      "certificado-220.pdf",
    );
    const porRuta = new Map(res.sugeridos.map((s) => [s.ruta, s.valor]));
    expect(porRuta.get("rentasTrabajo.ingresosBrutos")).toBe(180_000_000);
    expect(porRuta.get("rentasTrabajo.aportesObligatoriosSalud")).toBe(7_200_000);
    expect(porRuta.get("rentasTrabajo.aportesObligatoriosPension")).toBe(7_200_000);
    expect(porRuta.get("rentasExentas.afc")).toBe(5_000_000);
    expect(porRuta.get("deducciones.interesesVivienda")).toBe(18_000_000);
    expect(porRuta.get("retenciones.rentasTrabajo")).toBe(12_000_000);
  });
});

describe("v1.1 · Compatibilidad de expedientes v1", () => {
  test("fusionarExpediente completa las secciones nuevas sin perder las v1", () => {
    const v1 = { contribuyente: { alias: "viejo", nitUltimos2: "29" }, rentasTrabajo: { ingresosBrutos: { valor: 1, procedencia: "confirmado" } } };
    const f = fusionarExpediente(v1);
    expect(f.contribuyente.alias).toBe("viejo");
    expect(f.rentasTrabajo.ingresosBrutos.valor).toBe(1);
    expect(f.rentasCapital.ingresosBrutos.procedencia).toBe("desconocido");
    expect(f.dividendos.noGravados.procedencia).toBe("desconocido");
    expect(f.patrimonio.anioAnteriorBruto.procedencia).toBe("desconocido");
    expect(Array.isArray(f.gananciasOcasionales)).toBe(true);
  });
});
