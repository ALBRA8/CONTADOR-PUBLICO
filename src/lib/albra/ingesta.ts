/**
 * INGESTA DE DOCUMENTOS — CONTADOR PÚBLICO ALBRA (v1.1)
 * ======================================================
 * Módulo 3 del chaleco (ingestión documental con trazabilidad): convierte un
 * archivo entregado por el declarante en DATOS SUGERIDOS con su clasificación.
 *
 * Regla innegociable del Prompt Maestro: la ingesta NUNCA escribe directamente
 * en el expediente. Produce sugerencias que el contador revisa, corrige y
 * acepta una a una; solo entonces la UI llama a registrarDocumento() y el dato
 * entra con procedencia "documento" y el nombre del archivo de origen.
 *
 * Formatos soportados en v1.1:
 *  - CSV: líneas "concepto;valor" (o coma/tabulador).
 *  - XLSX (client-side, SheetJS): primera hoja con columnas de concepto y valor;
 *    agrupa por concepto y suma (formato "Pago o abono" de la exógena Res. 1628
 *    y certificados bancarios en Excel).
 *  - PDF: se extrae el texto en el servidor (ruta /api/albra/ingesta-pdf con
 *    pdf-parse) y aquí se aplican los reconocedores de etiquetas del
 *    certificado de ingresos y retenciones (formulario 220) y certificados
 *    bancarios DIAN.
 */

import { Expediente } from "./tipos";

export interface SugeridoIngesta {
  ruta: string;
  concepto: string;
  valor: number;
  /** Referencia F210 / norma para mostrar al contador. */
  referencia: string;
}

export interface ResultadoIngesta {
  archivo: string;
  tipo: "csv" | "xlsx" | "pdf";
  /** Filas o etiquetas reconocidas (antes de agrupar, para el previsualizador). */
  filas: { concepto: string; valor: number }[];
  sugeridos: SugeridoIngesta[];
  /** Conceptos con valor que el clasificador no reconoció: revisión humana. */
  noClasificados: { concepto: string; valor: number }[];
}

// ---------------------------------------------------------------------------
// Mapa de clasificación (superset del MAPA_CSV del agente, compartido por
// los tres formatos; los patrones más específicos van primero)
// ---------------------------------------------------------------------------

const MAPA_INGESTA: { patrones: RegExp; ruta: string; concepto: string; referencia: string }[] = [
  { patrones: /patrimonio.*anterior.*bruto|bruto.*a[ñn]o.*anterior|presuntiva/i, ruta: "patrimonio.anioAnteriorBruto", concepto: "Patrimonio bruto del año anterior", referencia: "Casilla 98 · art. 189-5 ET" },
  { patrones: /deudas?.*anterior/i, ruta: "patrimonio.anioAnteriorDeudas", concepto: "Deudas del año anterior", referencia: "Casilla 98 · art. 189-5 ET" },
  { patrones: /dividendos?.*gravad|2a\.?\s*subc[eé]dula/i, ruta: "dividendos.gravados", concepto: "Dividendos gravados (2a. subcédula)", referencia: "Casilla 108 · art. 49 par. 2 ET" },
  { patrones: /dividendo|participaci[oó]n/i, ruta: "dividendos.noGravados", concepto: "Dividendos (verificar subcédula con el certificado)", referencia: "Casilla 107 · art. 49 num. 3 ET" },
  { patrones: /cdt|rendimientos?\s+financier|inter[eé]s(?:es)?\s+financier|fondo(?:s)?\s+de\s+inversi[oó]n|pagar[eé]/i, ruta: "rentasCapital.ingresosBrutos", concepto: "Rendimientos financieros gravados", referencia: "Casilla 58 · art. 242 ET" },
  { patrones: /ingresos?\s+brutos?|rentas?\s+de\s+trabajo|salario|pagos?\s+laboral|remuneraci[oó]n/i, ruta: "rentasTrabajo.ingresosBrutos", concepto: "Ingresos brutos rentas de trabajo", referencia: "Casilla 32 · certificado 220" },
  { patrones: /aportes?\s+obligatorios?\s+a?\s*(?:la\s+)?salud|eps|salud\s+obligator/i, ruta: "rentasTrabajo.aportesObligatoriosSalud", concepto: "Aportes obligatorios a salud", referencia: "Casilla 33 · arts. 55/56 ET" },
  { patrones: /aportes?\s+obligatorios?\s+a?\s*(?:la\s+)?pensi[oó]n|pensi[oó]n\s+obligator/i, ruta: "rentasTrabajo.aportesObligatoriosPension", concepto: "Aportes obligatorios a pensión", referencia: "Casilla 33 · arts. 55/56 ET" },
  { patrones: /aportes?\s+voluntarios?\s+a?\s*pensi[oó]n|fondos?\s+de\s+pensiones?\s+voluntar/i, ruta: "rentasExentas.aportesVoluntariosPension", concepto: "Aportes voluntarios a pensión", referencia: "Casilla 35 · arts. 126-1/126-4 ET" },
  { patrones: /\ba\.?f\.?c\.?\b|ahorro\s+fomento\s+construcci[oó]n/i, ruta: "rentasExentas.afc", concepto: "Cuentas AFC", referencia: "Casilla 35 · art. 126-1 ET" },
  { patrones: /inter[eé]s(?:es)?.*vivienda|hipotecari|leasing\s+habitacional/i, ruta: "deducciones.interesesVivienda", concepto: "Intereses de vivienda", referencia: "Casilla 38 · art. 119 ET" },
  { patrones: /medicina\s+prepagada|prepagada|seguros?\s+de\s+salud/i, ruta: "deducciones.medicinaPrepagada", concepto: "Medicina prepagada", referencia: "Art. 387 ET" },
  { patrones: /gravamen.*movimientos|4\s*x\s*1000|gmf/i, ruta: "deducciones.gmfPagado", concepto: "GMF 4x1000 pagado", referencia: "Art. 115 ET" },
  { patrones: /retenci[oó]n(?:es)?\s+en\s+la\s+fuente|retenci[oó]n(?:es)?\s+(?:de\s+)?renta/i, ruta: "retenciones.rentasTrabajo", concepto: "Retenciones en la fuente", referencia: "Casilla 132 · certificado 220" },
  { patrones: /patrimonio\s+bruto|activos?\s+totales/i, ruta: "patrimonio.bruto", concepto: "Patrimonio bruto", referencia: "Casilla 29" },
  { patrones: /deuda|pasivo/i, ruta: "patrimonio.deudas", concepto: "Deudas", referencia: "Casilla 30" },
];

/** Clasifica un concepto y devuelve el mapeo o null si no lo reconoce. */
export function clasificarConcepto(concepto: string): { ruta: string; concepto: string; referencia: string } | null {
  for (const m of MAPA_INGESTA) {
    if (m.patrones.test(concepto)) return { ruta: m.ruta, concepto: m.concepto, referencia: m.referencia };
  }
  return null;
}

/**
 * Número tolerante: acepta "1.234.567", "1,234,567.89", "$ 1 234 567", "(123)".
 * Heurística: si hay separadores de miles y decimales mezclados, el último
 * separador distinto es el decimal.
 */
export function parseNumero(raw: string): number | null {
  let s = raw.replace(/[$\s\u00a0]/g, "");
  if (!s) return null;
  const negativo = /^\(.*\)$/.test(s);
  s = s.replace(/[()]/g, "");
  const ultimoComa = s.lastIndexOf(",");
  const ultimoPunto = s.lastIndexOf(".");
  if (ultimoComa > -1 && ultimoPunto > -1) {
    // El separador que aparece más a la derecha es el decimal.
    if (ultimoComa > ultimoPunto) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (ultimoComa > -1) {
    const decimales = s.length - ultimoComa - 1;
    // "1.234.567" sin coma: los puntos son miles. "123,45" con 2 decimales: coma decimal.
    if (decimales === 3 || !s.slice(0, ultimoComa).includes(",")) {
      s = decimales === 3 ? s.replace(/,/g, "") : s.replace(",", ".");
    } else {
      s = s.replace(/\./g, "").replace(",", ".");
    }
  } else if (ultimoPunto > -1) {
    const decimales = s.length - ultimoPunto - 1;
    if (decimales === 3) s = s.replace(/\./g, "");
    else if (decimales > 0 && decimales < 3) {
      /* "1234.56": decimal */
    } else s = s.replace(/\./g, "");
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negativo ? -n : n;
}

function agruparYClasificar(
  archivo: string,
  tipo: ResultadoIngesta["tipo"],
  filas: { concepto: string; valor: number }[],
): ResultadoIngesta {
  const sugeridos: SugeridoIngesta[] = [];
  const noClasificados: { concepto: string; valor: number }[] = [];
  for (const fila of filas) {
    const mapeo = clasificarConcepto(fila.concepto);
    if (mapeo) {
      sugeridos.push({ ruta: mapeo.ruta, concepto: mapeo.concepto, valor: fila.valor, referencia: mapeo.referencia });
    } else {
      noClasificados.push(fila);
    }
  }
  return { archivo, tipo, filas, sugeridos, noClasificados };
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

export function ingestarCsv(texto: string, archivo: string): ResultadoIngesta {
  const filas: { concepto: string; valor: number }[] = [];
  const lineas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const linea of lineas) {
    const cols = linea.split(/[;,\t]/);
    if (cols.length < 2) continue;
    const concepto = cols[0].replace(/^"|"$/g, "").trim();
    if (/^(concepto|descripci[oó]n|detalle|nombre)$/i.test(concepto)) continue; // encabezado
    const valor = parseNumero(cols[cols.length - 1].replace(/^"|"$/g, ""));
    if (valor === null) continue;
    filas.push({ concepto, valor });
  }
  return agruparYClasificar(archivo, "csv", filas);
}

// ---------------------------------------------------------------------------
// XLSX (client-side, SheetJS importado dinámicamente)
// ---------------------------------------------------------------------------

export async function ingestarXlsx(buffer: ArrayBuffer, archivo: string): Promise<ResultadoIngesta> {
  const XLSX = await import("xlsx");
  const libro = XLSX.read(buffer, { type: "array" });
  // Busca la primera hoja con al menos 2 celdas no vacías.
  for (const nombreHoja of libro.SheetNames) {
    const hoja = libro.Sheets[nombreHoja];
    if (!hoja) continue;
    const filas = XLSX.utils.sheet_to_json<unknown[]>(hoja, { header: 1, blankrows: false, defval: "" });
    if (!filas.length) continue;

    // Detecta la fila de encabezados (primera con ≥2 celdas de texto).
    let encabezadoIdx = -1;
    for (let i = 0; i < Math.min(filas.length, 10); i++) {
      const celdas = (filas[i] as unknown[]).map((c) => String(c ?? "").trim());
      if (celdas.filter((c) => c.length > 0).length >= 2) {
        encabezadoIdx = i;
        break;
      }
    }
    if (encabezadoIdx === -1) continue;

    const encabezados = (filas[encabezadoIdx] as unknown[]).map((c) => String(c ?? "").trim());
    // Columna de concepto: la primera cuyo encabezado coincida o que sea texto.
    let colConcepto = encabezados.findIndex((h) => /concepto|descripci[oó]n|detalle|nombre|r[eé]gimen/i.test(h));
    if (colConcepto === -1) colConcepto = 0;
    // Columna de valor: la primera numérica ("pagos o abonos" de la exógena, "valor", "importe"…).
    let colValor = encabezados.findIndex((h) => /pagos?\s+o\s+abonos?|valor|importe|monto|abono/i.test(h));
    if (colValor === -1 || colValor === colConcepto) {
      colValor = encabezados.findIndex((h, i) => i !== colConcepto && h.length > 0);
    }

    // Agrupa por concepto y suma (la exógena repite el concepto por tercero).
    const acumulados = new Map<string, number>();
    for (let i = encabezadoIdx + 1; i < filas.length; i++) {
      const fila = filas[i] as unknown[];
      const concepto = String(fila[colConcepto] ?? "").trim();
      if (!concepto) continue;
      if (/^(concepto|descripci[oó]n|detalle|nombre)$/i.test(concepto)) continue;
      const rawValor = fila[colValor];
      const valor = typeof rawValor === "number" ? rawValor : parseNumero(String(rawValor ?? ""));
      if (valor === null || valor === 0) continue;
      acumulados.set(concepto, (acumulados.get(concepto) ?? 0) + valor);
    }
    if (acumulados.size === 0) continue;

    const filasAgrupadas = Array.from(acumulados.entries()).map(([concepto, valor]) => ({ concepto, valor }));
    return agruparYClasificar(`${archivo} · hoja "${nombreHoja}"`, "xlsx", filasAgrupadas);
  }
  return { archivo, tipo: "xlsx", filas: [], sugeridos: [], noClasificados: [] };
}

// ---------------------------------------------------------------------------
// PDF (texto ya extraído en /api/albra/ingesta-pdf) — certificado 220 y
// certificados bancarios DIAN: etiqueta seguida de un monto.
// ---------------------------------------------------------------------------

const RECONOCEDORES_PDF: { etiquetas: RegExp; ruta: string; concepto: string; referencia: string }[] = [
  { etiquetas: /ingresos?\s+brutos?/i, ruta: "rentasTrabajo.ingresosBrutos", concepto: "Ingresos brutos rentas de trabajo", referencia: "Casilla 32 · certificado 220" },
  { etiquetas: /aportes?\s+obligatorios?\s+a?\s*(?:la\s+)?salud|aportes?\s+a?\s*salud/i, ruta: "rentasTrabajo.aportesObligatoriosSalud", concepto: "Aportes obligatorios a salud", referencia: "Casilla 33 · arts. 55/56 ET" },
  { etiquetas: /aportes?\s+obligatorios?\s+a?\s*(?:la\s+)?pensi[oó]n|aportes?\s+a?\s*pensi[oó]n\s+obligator/i, ruta: "rentasTrabajo.aportesObligatoriosPension", concepto: "Aportes obligatorios a pensión", referencia: "Casilla 33 · arts. 55/56 ET" },
  { etiquetas: /aportes?\s+voluntarios?\s+a?\s*pensi[oó]n/i, ruta: "rentasExentas.aportesVoluntariosPension", concepto: "Aportes voluntarios a pensión", referencia: "Casilla 35 · arts. 126-1/126-4 ET" },
  { etiquetas: /aportes?\s+a\s+(?:las\s+)?cuentas?\s+a\.?f\.?c\.?|\ba\.?f\.?c\.?\b/i, ruta: "rentasExentas.afc", concepto: "Cuentas AFC", referencia: "Casilla 35 · art. 126-1 ET" },
  { etiquetas: /inter[eé]s(?:es)?\s+(?:de|del)\s+(?:cr[eé]dito\s+)?(?:de\s+)?vivienda|inter[eé]s(?:es)?\s+hipotecari/i, ruta: "deducciones.interesesVivienda", concepto: "Intereses de vivienda", referencia: "Casilla 38 · art. 119 ET" },
  { etiquetas: /medicina\s+prepagada|seguros?\s+de\s+salud/i, ruta: "deducciones.medicinaPrepagada", concepto: "Medicina prepagada", referencia: "Art. 387 ET" },
  { etiquetas: /gravamen\s+a\s+los\s+movimientos\s+financieros|4\s*x\s*1000|gmf/i, ruta: "deducciones.gmfPagado", concepto: "GMF 4x1000 pagado", referencia: "Art. 115 ET" },
  { etiquetas: /retenci[oó]n(?:es)?\s+en\s+la\s+fuente(?:\s+(?:por|de)\s+renta)?|retenci[oó]n(?:es)?\s+practicadas?\s+por\s+renta/i, ruta: "retenciones.rentasTrabajo", concepto: "Retenciones en la fuente", referencia: "Casilla 132 · certificado 220" },
  { etiquetas: /aportes?\s+(?:obligatorios?\s+)?(?:a\s+)?fondos?\s+de\s+cesant[ií]as?\s+voluntar/i, ruta: "rentasExentas.cesantiasVoluntarias", concepto: "Aportes voluntarios a cesantías", referencia: "Casilla 35 · art. 126-1 ET" },
];

export function ingestarTextoPdf(texto: string, archivo: string): ResultadoIngesta {
  const filas: { concepto: string; valor: number }[] = [];
  const sugeridos: SugeridoIngesta[] = [];
  const lineas = texto.split(/\r?\n/).map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  for (const linea of lineas) {
    for (const r of RECONOCEDORES_PDF) {
      const m = linea.match(r.etiquetas);
      if (!m) continue;
      // Monto en la MISMA línea, después de la etiqueta, o al final de la línea.
      const trasEtiqueta = linea.slice(linea.toLowerCase().indexOf(m[0].toLowerCase()) + m[0].length);
      const candidato = trasEtiqueta.match(/-?\$?\s*[\d.,]+/) ?? linea.match(/-?\$?\s*([\d][\d.,]+)/);
      const valor = candidato ? parseNumero(candidato[0]) : null;
      if (valor === null) break;
      filas.push({ concepto: m[0], valor });
      // Un reconocedor por línea (el más específico primero).
      if (!sugeridos.some((s) => s.ruta === r.ruta && s.valor === valor)) {
        sugeridos.push({ ruta: r.ruta, concepto: r.concepto, valor, referencia: r.referencia });
      }
      break;
    }
  }
  return agruparYClasificar(archivo, "pdf", filas);
}

// ---------------------------------------------------------------------------
// Aplicación de sugeridos aceptados (la UI decide cuáles; el motor nunca asume)
// ---------------------------------------------------------------------------

import { registrarDocumento } from "./agente";

/** Formato de pesos para la previsualización. */
export function fmtValor(n: number): string {
  return `$${Math.round(n).toLocaleString("es-CO")}`;
}

export function aplicarSugeridos(
  e: Expediente,
  aceptados: SugeridoIngesta[],
  archivo: string,
): Expediente {
  let expediente = e;
  for (const s of aceptados) {
    expediente = registrarDocumento(expediente, s.ruta, s.valor, archivo);
  }
  return expediente;
}
