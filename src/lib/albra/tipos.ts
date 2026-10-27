/**
 * TIPOS DEL EXPEDIENTE FINANCIERO — CONTADOR PÚBLICO ALBRA
 * =========================================================
 * Regla del Prompt Maestro (§7 Módulo 2 y §12): cada dato conserva su procedencia.
 * El motor NUNCA inventa cifras: un dato faltante queda como desconocido y el
 * agente lo pregunta; ningún valor se rellena con ceros por conveniencia.
 *
 * Procedencia de cada dato:
 *  - "confirmado": respondido por el usuario en la entrevista
 *  - "documento": extraído de un archivo importado (exógena, certificado 220…)
 *  - "calculado": derivado por el motor a partir de otros datos
 *  - "desconocido": aún sin respuesta → bloquea lo que dependa de él
 */

export type Procedencia = "confirmado" | "documento" | "calculado" | "desconocido";

export interface DatoConOrigen<T> {
  valor: T | null;
  procedencia: Procedencia;
  /** Archivo de origen cuando procedencia = "documento". */
  origen?: string;
  /** Fecha ISO de última actualización. */
  actualizado?: string;
}

export type Dato = DatoConOrigen<number>;

export function datoConfirmado(valor: number): DatoConOrigen<number> {
  return { valor, procedencia: "confirmado", actualizado: new Date().toISOString() };
}

export function datoDocumento(valor: number, origen: string): DatoConOrigen<number> {
  return { valor, procedencia: "documento", origen, actualizado: new Date().toISOString() };
}

export function datoDesconocido(): DatoConOrigen<number> {
  return { valor: null, procedencia: "desconocido" };
}

/** Monto efectivo: el valor o 0 solo cuando la procedencia lo autoriza. */
export function monto(d: DatoConOrigen<number> | null | undefined): number {
  return d && d.valor !== null && d.valor !== undefined ? d.valor : 0;
}

/** ¿El dato falta de verdad? (null = pendiente de preguntar). */
export function esDesconocido(d: DatoConOrigen<number> | null | undefined): boolean {
  return !d || d.valor === null || d.valor === undefined;
}

// ---------------------------------------------------------------------------
// EXPEDIENTE
// ---------------------------------------------------------------------------

export interface RentasTrabajo {
  /** Casilla 32 — salarios de relación laboral. */
  ingresosBrutos: Dato;
  /** Casilla 33 — aportes obligatorios a salud y pensión (art. 55/56 ET). */
  aportesObligatoriosSalud: Dato;
  aportesObligatoriosPension: Dato;
  /** Aporte al Fondo de Solidaridad Pensional (INCRNGO). */
  aportesFsp: Dato;
}

export interface RentasIndependientes {
  /** Casilla 43 — honorarios/servicios sin relación laboral. */
  ingresosBrutos: Dato;
  /** Casilla 44 — INCRNGO del independiente (aportes a salud/pensión sobre IBC). */
  aportesObligatoriosSalud: Dato;
  aportesObligatoriosPension: Dato;
  /** Costos y gastos imputados (hace perder la renta exenta del 25%, art. 206 num. 10 par.). */
  costosGastos: Dato;
}

export interface Deducciones {
  /** Casilla 38 — intereses de crédito de vivienda (art. 119, tope 1.200 UVT). */
  interesesVivienda: Dato;
  /** Medicina prepagada (art. 387, tope 192 UVT/año). */
  medicinaPrepagada: Dato;
  /** Intereses Icetex (art. 119, tope 100 UVT). */
  icetex: Dato;
  /** GMF 4x1000 pagado en el año (50% deducible, art. 115). */
  gmfPagado: Dato;
  /** Compras con factura electrónica pagadas por medios electrónicos (art. 336 num. 5). */
  comprasFacturaElectronica: Dato;
}

export interface RentasExentas {
  /** Casilla 35 — aportes voluntarios a pensiones y AFC (arts. 126-1/126-4, tope 3.800 UVT). */
  aportesVoluntariosPension: Dato;
  afc: Dato;
  /** Aportes voluntarios a cesantías (tope 2.500 UVT). */
  cesantiasVoluntarias: Dato;
}

export interface Pensiones {
  /** Casilla 99 — ingresos por pensiones. */
  ingresosBrutos: Dato;
  aportesSalud: Dato;
  /** Meses del año en los que recibió pensión (para el tope mensual de 1.000 UVT). */
  mesesRecibidos: number;
}

export interface RentasCapital {
  /** Casilla 58 — intereses y rendimientos financieros GRAVADOS (art. 242 ET).
   *  Los intereses de cuentas de ahorro de personas naturales están exentos
   *  (art. 206 num. 3 ET) y NO se registran aquí. */
  ingresosBrutos: Dato;
  /** Casilla 59 — ingresos no constitutivos de renta de las rentas de capital. */
  incrngo: Dato;
  /** Casilla 60 — costos y deducciones procedentes de las rentas de capital. */
  costosGastos: Dato;
}

export interface Dividendos {
  /** Casilla 107 — 1a. subcédula años 2017 y siguientes (num. 3 art. 49 ET):
   *  dividendos distribuidos con utilidades que SÍ tributaron en la sociedad.
   *  Se suman a la renta líquida gravable y tributan con la tabla del art. 241. */
  noGravados: Dato;
  /** Casilla 108 — 2a. subcédula años 2017 y siguientes (par. 2 art. 49 ET):
   *  dividendos distribuidos con utilidades exentas en la sociedad. Gravan al 35%
   *  (casilla 118) y su remanente entra a la tabla vía casilla 111. */
  gravados: Dato;
  /** Casilla 109 — dividendos y participaciones recibidos del exterior (art. 244 ET). */
  delExterior: Dato;
  /** Casilla 110 — rentas exentas de los dividendos del exterior (no doble tributación). */
  exentasExterior: Dato;
}

export interface Patrimonio {
  /** Casilla 29 — patrimonio bruto a 31 de diciembre del AG. */
  bruto: Dato;
  /** Casilla 30 — deudas. */
  deudas: Dato;
  /** Patrimonio bruto a 31 de diciembre del año ANTERIOR (declaración previa):
   *  base de la renta presuntiva del art. 189-5 ET (casilla 98). */
  anioAnteriorBruto: Dato;
  /** Deudas del año anterior (para el patrimonio líquido de la presuntiva). */
  anioAnteriorDeudas: Dato;
}

export interface Retenciones {
  /** Casilla 132 — retenciones en la fuente del año (certificado 220). */
  rentasTrabajo: Dato;
  otras: Dato;
}

export interface Anticipos {
  /** Casilla 130 — anticipo liquidado en la declaración del año anterior. */
  anticipoAnioAnterior: Dato;
  /** Casilla 131 — saldo a favor del año anterior sin solicitud de devolución. */
  saldoFavorAnioAnterior: Dato;
}

export interface ItemGananciaOcasional {
  tipo: "venta_activo_fijo" | "herencia" | "donacion" | "loteria" | "rifa" | "premio" | "otro";
  descripcion: string;
  ingreso: number;
  costoFiscal: number;
  aniosPosesion?: number;
  /** "vivienda_habitacion_311_1" para la exención del art. 311-1. */
  exencion?: string | null;
  valorCatastral?: number;
}

export interface Contribuyente {
  alias: string;
  /** Últimos 2 dígitos del NIT sin dígito de verificación (calendario DIAN). */
  nitUltimos2: string;
  residente: boolean;
  obligadoContabilidad: boolean;
  /** Número de dependientes económicos (casilla 138). */
  dependientes: number;
}

export interface Expediente {
  anioGravable: number;
  contribuyente: Contribuyente;
  rentasTrabajo: RentasTrabajo;
  rentasIndependientes: RentasIndependientes;
  deducciones: Deducciones;
  rentasExentas: RentasExentas;
  pensiones: Pensiones;
  /** Rentas de capital (casillas 58-73): rendimientos financieros gravados. */
  rentasCapital: RentasCapital;
  /** Cédula de dividendos y participaciones (casillas 104-111, 118, 124). */
  dividendos: Dividendos;
  patrimonio: Patrimonio;
  retenciones: Retenciones;
  anticipos: Anticipos;
  gananciasOcasionales: ItemGananciaOcasional[];
  /** Consumos con tarjeta y consignaciones (evaluación de obligación a declarar). */
  consumosTarjeta: Dato;
  consignaciones: Dato;
  /** Impuesto neto de renta declarado en el año anterior (para el anticipo del art. 807). */
  impuestoNetoAnioAnterior: number | null;
  /** ¿Es el primer año que declara? (anticipo 25% — art. 807). */
  primerAnioDeclarando: boolean;
}

export function expedienteVacio(): Expediente {
  const d = (): Dato => datoDesconocido();
  return {
    anioGravable: 2025,
    contribuyente: {
      alias: "",
      nitUltimos2: "",
      residente: true,
      obligadoContabilidad: false,
      dependientes: 0,
    },
    rentasTrabajo: {
      ingresosBrutos: d(),
      aportesObligatoriosSalud: d(),
      aportesObligatoriosPension: d(),
      aportesFsp: d(),
    },
    rentasIndependientes: {
      ingresosBrutos: d(),
      aportesObligatoriosSalud: d(),
      aportesObligatoriosPension: d(),
      costosGastos: d(),
    },
    deducciones: {
      interesesVivienda: d(),
      medicinaPrepagada: d(),
      icetex: d(),
      gmfPagado: d(),
      comprasFacturaElectronica: d(),
    },
    rentasExentas: {
      aportesVoluntariosPension: d(),
      afc: d(),
      cesantiasVoluntarias: d(),
    },
    pensiones: { ingresosBrutos: d(), aportesSalud: d(), mesesRecibidos: 12 },
    rentasCapital: { ingresosBrutos: d(), incrngo: d(), costosGastos: d() },
    dividendos: { noGravados: d(), gravados: d(), delExterior: d(), exentasExterior: d() },
    patrimonio: { bruto: d(), deudas: d(), anioAnteriorBruto: d(), anioAnteriorDeudas: d() },
    retenciones: { rentasTrabajo: d(), otras: d() },
    anticipos: { anticipoAnioAnterior: d(), saldoFavorAnioAnterior: d() },
    gananciasOcasionales: [],
    consumosTarjeta: d(),
    consignaciones: d(),
    impuestoNetoAnioAnterior: null,
    primerAnioDeclarando: false,
  };
}

// ---------------------------------------------------------------------------
// ESTADOS DEL PROCEDIMIENTO (Prompt Maestro §8)
// ---------------------------------------------------------------------------

export type EstadoProcedimiento =
  | "INCOMPLETO"
  | "PREPARADO"
  | "VALIDADO"
  | "APROBADO"
  | "DILIGENCIADO"
  | "PRESENTADO"
  | "SOPORTADO";

export const ESTADOS: { id: EstadoProcedimiento; titulo: string; descripcion: string }[] = [
  { id: "INCOMPLETO", titulo: "Incompleto", descripcion: "Faltan datos o documentos necesarios." },
  { id: "PREPARADO", titulo: "Preparado", descripcion: "Existe un borrador generado por el motor." },
  { id: "VALIDADO", titulo: "Validado", descripcion: "Las comprobaciones del motor pasaron y quedaron documentadas." },
  { id: "APROBADO", titulo: "Aprobado", descripcion: "El contribuyente revisó y autorizó el resultado." },
  { id: "DILIGENCIADO", titulo: "Diligenciado", descripcion: "Los valores se incorporaron a MUISCA (el usuario lo confirma)." },
  { id: "PRESENTADO", titulo: "Presentado", descripcion: "Existe evidencia verificable de la presentación oficial." },
  { id: "SOPORTADO", titulo: "Soportado", descripcion: "El comprobante y las evidencias quedaron archivadas en el expediente." },
];

/**
 * Fusiona un expediente guardado (v1 o parcial) sobre la estructura vigente.
 * Garantiza que las secciones añadidas después (rentasCapital, dividendos,
 * patrimonio del año anterior) existan aunque el JSON venga de la v1.
 */
export function fusionarExpediente(guardado: unknown): Expediente {
  const base = expedienteVacio();
  if (!guardado || typeof guardado !== "object") return base;
  const g = guardado as Partial<Expediente>;
  return {
    ...base,
    ...g,
    contribuyente: { ...base.contribuyente, ...(g.contribuyente ?? {}) },
    rentasTrabajo: { ...base.rentasTrabajo, ...(g.rentasTrabajo ?? {}) },
    rentasIndependientes: { ...base.rentasIndependientes, ...(g.rentasIndependientes ?? {}) },
    deducciones: { ...base.deducciones, ...(g.deducciones ?? {}) },
    rentasExentas: { ...base.rentasExentas, ...(g.rentasExentas ?? {}) },
    pensiones: { ...base.pensiones, ...(g.pensiones ?? {}) },
    rentasCapital: { ...base.rentasCapital, ...(g.rentasCapital ?? {}) },
    dividendos: { ...base.dividendos, ...(g.dividendos ?? {}) },
    patrimonio: { ...base.patrimonio, ...(g.patrimonio ?? {}) },
    retenciones: { ...base.retenciones, ...(g.retenciones ?? {}) },
    anticipos: { ...base.anticipos, ...(g.anticipos ?? {}) },
    gananciasOcasionales: Array.isArray(g.gananciasOcasionales) ? g.gananciasOcasionales : [],
  };
}

/** Transición real (casilla 134/136/137): pagar no es lo mismo que quedar a favor. */
export const REGLA_INNEGOCIABLE =
  "Diligenciar no significa presentar. Guardar no significa firmar. Un borrador no es una declaración presentada: la respuesta del agente nunca sustituye el comprobante oficial.";
