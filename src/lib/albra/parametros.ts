/**
 * PARÁMETROS TRIBUTARIOS VERSIONADOS — Año gravable 2025 (se presenta en 2026)
 * ============================================================================
 * Fuente de los datos: parámetros verificados del proyecto open-renta (MIT),
 * contrastados con las resoluciones oficiales citadas en cada campo.
 * Los parámetros viven separados del código: actualizar la temporada es editar
 * este archivo (o agregar ag2026.ts).
 *
 * Fuentes normativas (registradas por open-renta, ultima_verificacion 2026-09-02):
 *  - UVT 2025:       Resolución DIAN 000193 del 4 de diciembre de 2024 ($49.799)
 *  - UVT 2026:       Resolución DIAN 000238 de 2025 ($52.374)
 *  - Formulario 210: Resolución DIAN 000044 del 14 de marzo de 2024,
 *                    instructivo modificado por Resolución 000120 del 31 de julio de 2024
 *  - Tabla art. 241: Artículo 241 ET (modificado por Ley 1943/2018 y Ley 2010/2019)
 *  - Calendario:     Decreto 2229 de 2023 (verificar contra micrositio DIAN)
 *  - Beneficio auditoría: Art. 689-3 ET, prorrogado por art. 69 de la Ley 2294 de 2023
 */

export interface RangoTabla {
  desde: number; // UVT
  hasta: number | null; // UVT (null = sin tope)
  tarifa: number; // fracción (0.19 = 19%)
  impuestoBaseUvt: number; // UVT de adición en la frontera inferior
}

export interface BeneficioParams {
  nombre: string;
  norma: string;
  topeUvtAnual?: number | null;
  dentroLimite40: boolean;
}

/** Parámetros completos del AG2025. */
export const PARAMETROS_AG2025 = {
  anioGravable: 2025,
  anioPresentacion: 2026,
  formulario: "210",

  uvtAnioGravable: 49799,
  uvtAnioPresentacion: 52374,

  /** Tabla marginal del art. 241 ET (en UVT). */
  tabla241: [
    { desde: 0, hasta: 1090, tarifa: 0.0, impuestoBaseUvt: 0 },
    { desde: 1090, hasta: 1700, tarifa: 0.19, impuestoBaseUvt: 0 },
    { desde: 1700, hasta: 4100, tarifa: 0.28, impuestoBaseUvt: 116 },
    { desde: 4100, hasta: 8670, tarifa: 0.33, impuestoBaseUvt: 788 },
    { desde: 8670, hasta: 18940, tarifa: 0.35, impuestoBaseUvt: 2296 },
    { desde: 18940, hasta: 33410, tarifa: 0.37, impuestoBaseUvt: 5891 },
    { desde: 33410, hasta: null, tarifa: 0.39, impuestoBaseUvt: 11245 },
  ] as RangoTabla[],

  /** Límite a rentas exentas y deducciones imputables de la cédula general (art. 336 num. 3 ET). */
  limiteCedulaGeneral: { porcentaje: 0.4, topeUvt: 1340 },

  /** Obligación a declarar: basta UNA condición (art. 594-3 ET, medido en UVT del AG). */
  obligacionDeclarar: {
    patrimonioBruto: { uvt: 4500, operador: ">" },
    ingresosBrutos: { uvt: 1400, operador: ">=" },
    consumosTarjeta: { uvt: 1400, operador: ">" },
    comprasConsumos: { uvt: 1400, operador: ">" },
    consignaciones: { uvt: 1400, operador: ">" },
    responsableIva: "bool",
  } as const,

  beneficios: {
    rentaExentaLaboral25: {
      nombre: "Renta exenta del 25% de rentas de trabajo",
      norma: "Art. 206 num. 10 ET",
      topeUvtAnual: 790,
      dentroLimite40: true,
    },
    dependientes387: {
      nombre: "Deducción por dependientes (10% ingresos brutos de trabajo)",
      norma: "Art. 387 ET",
      topeUvtAnual: 384,
      dentroLimite40: true,
    },
    dependientes336: {
      nombre: "Deducción de 72 UVT por dependiente (hasta 4)",
      norma: "Art. 336 num. 3 ET (Ley 2277 de 2022)",
      topeUvtAnual: 288,
      dentroLimite40: false,
    },
    facturaElectronica1: {
      nombre: "Deducción del 1% por compras con factura electrónica",
      norma: "Art. 336 num. 5 ET",
      topeUvtAnual: 240,
      dentroLimite40: false,
    },
    interesesVivienda: {
      nombre: "Intereses de crédito de vivienda o leasing habitacional",
      norma: "Art. 119 ET",
      topeUvtAnual: 1200,
      dentroLimite40: true,
    },
    medicinaPrepagada: {
      nombre: "Pagos por medicina prepagada y seguros de salud",
      norma: "Art. 387 ET",
      topeUvtAnual: 192,
      dentroLimite40: true,
    },
    icetex: {
      nombre: "Intereses de créditos Icetex",
      norma: "Art. 119 ET",
      topeUvtAnual: 100,
      dentroLimite40: true,
    },
    gmf4x1000: {
      nombre: "GMF (4x1000): 50% del gravamen pagado es deducible",
      norma: "Art. 115 ET",
      topeUvtAnual: null,
      dentroLimite40: true,
    },
    aportesVoluntariosPensionesAfc: {
      nombre: "Aportes voluntarios a pensiones y AFC",
      norma: "Arts. 126-1 y 126-4 ET",
      topeUvtAnual: 3800,
      dentroLimite40: true,
    },
    cesantiasVoluntarias: {
      nombre: "Aportes voluntarios a cesantías",
      norma: "Art. 126-1 ET",
      topeUvtAnual: 2500,
      dentroLimite40: true,
    },
    pensionExenta: {
      nombre: "Rentas de pensiones exentas (1.000 UVT mensuales)",
      norma: "Art. 206 num. 5 ET",
      topeUvtAnual: 12000,
      dentroLimite40: false,
    },
    cesantiasInteresesExentas: {
      nombre: "Cesantías e intereses sobre cesantías exentos",
      norma: "Art. 206 num. 4 ET",
      dentroLimite40: false,
    },
  } as Record<string, BeneficioParams>,

  /** Ganancias ocasionales (arts. 313, 314 y 317 ET). */
  gananciasOcasionales: {
    tarifaGeneral: 0.15,
    tarifaLoteriasRifas: 0.2,
    exencionViviendaTopeUvt: 5000,
    viviendaValorCatastralTopeUvt: 15000,
  },

  dividendos: {
    /** Casilla 108 — 2a. subcédula (par. 2 art. 49 ET): utilidades exentas en la sociedad. */
    tarifaPreviaGravados: 0.35,
    /** Casilla 120 — dividendos y participaciones recibidos del exterior (art. 244 ET).
     *  No integran la base de la tabla del art. 241 (casilla 111 del instructivo F210 v16). */
    tarifaExterior: 0.35,
    descuento2541: {
      desdeUvt: 1090,
      tarifa: 0.19,
      /** Alcance del descuento (art. 254-1 ET): SOLO dividendos gravados con la tarifa
       *  del inciso 1° del par. 2 art. 49 (casilla 108). Divergencia documentada con el
       *  referente open-renta, que lo liquida sobre el total de dividendos (FICHA §v1.1). */
      baseGravados108: true,
    },
  },

  /** Renta presuntiva (art. 189-5 ET): 0.5% del patrimonio líquido del año anterior.
   *  Casilla 98 del F210 v16; el impuesto se liquida sobre la mayor entre la renta
   *  líquida (casilla 97) y la presuntiva (casilla 98) — base de la casilla 111. */
  rentaPresuntiva: {
    porcentaje: 0.005,
    norma: "Art. 189-5 ET",
  },

  /** Anticipo del año siguiente (art. 807 ET). */
  anticipo: {
    porcentajeGeneral: 0.75,
    porcentajePrimerAnio: 0.25,
    porcentajeSegundoAnio: 0.5,
  },

  /** Costos imputados a rentas de trabajo sin relación laboral: tope indicativo art. 336-1 ET. */
  topeCostosTrabajo336_1: 0.6,

  /** Sanción mínima (art. 639 ET, en UVT del año de presentación). */
  sancionMinimaUvt: 10,

  /** Vencimientos AG2025 (Decreto 2229 de 2023) — verificar contra micrositio DIAN. */
  calendarioVencimientos: {
    "01-02": "2026-08-12",
    "03-04": "2026-08-13",
    "05-06": "2026-08-14",
    "07-08": "2026-08-18",
    "09-10": "2026-08-19",
    "11-12": "2026-08-20",
    "13-14": "2026-08-21",
    "15-16": "2026-08-24",
    "17-18": "2026-08-25",
    "19-20": "2026-08-26",
    "21-22": "2026-08-27",
    "23-24": "2026-08-28",
    "25-26": "2026-08-31",
    "27-28": "2026-09-01",
    "29-30": "2026-09-02",
    "31-32": "2026-09-03",
    "33-34": "2026-09-04",
    "35-36": "2026-09-07",
    "37-38": "2026-09-08",
    "39-40": "2026-09-09",
    "41-42": "2026-09-10",
    "43-44": "2026-09-11",
    "45-46": "2026-09-14",
    "47-48": "2026-09-15",
    "49-50": "2026-09-16",
    "51-52": "2026-09-17",
    "53-54": "2026-09-18",
    "55-56": "2026-09-21",
    "57-58": "2026-09-22",
    "59-60": "2026-09-23",
    "61-62": "2026-09-24",
    "63-64": "2026-09-25",
    "65-66": "2026-09-28",
    "67-68": "2026-10-01",
    "69-70": "2026-10-02",
    "71-72": "2026-10-05",
    "73-74": "2026-10-06",
    "75-76": "2026-10-07",
    "77-78": "2026-10-08",
    "79-80": "2026-10-09",
    "81-82": "2026-10-13",
    "83-84": "2026-10-14",
    "85-86": "2026-10-15",
    "87-88": "2026-10-16",
    "89-90": "2026-10-19",
    "91-92": "2026-10-20",
    "93-94": "2026-10-21",
    "95-96": "2026-10-22",
    "97-98": "2026-10-23",
    "99-00": "2026-10-26",
  } as Record<string, string>,
} as const;

export type Parametros = typeof PARAMETROS_AG2025;
