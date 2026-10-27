/**
 * AGENTE DE ENTREVISTA ADAPTATIVA — CONTADOR PÚBLICO ALBRA
 * =========================================================
 * Regla del Prompt Maestro (§7 Módulo 1 y Fase 5): el agente solicita ÚNICAMENTE
 * la información faltante y NUNCA asume valores desconocidos. El agente interpreta,
 * pregunta y explica; el motor determinista calcula.
 *
 * Cada pregunta expresa:
 *  - qué dato busca (ruta en el expediente),
 *  - por qué lo necesita (norma o casilla),
 *  - cómo se responde (número, texto o sí/no).
 */

import {
  Expediente,
  esDesconocido,
  datoConfirmado,
  datoDocumento,
  DatoConOrigen,
} from "./tipos";

export interface Pregunta {
  id: string;
  seccion: "identidad" | "rentas-trabajo" | "rentas-independientes" | "rentas-capital" | "dividendos" | "deducciones" | "rentas-exentas" | "patrimonio" | "retenciones" | "obligacion";
  titulo: string;
  detalle: string;
  /** Ruta en formato "a.b.c" dentro del expediente. */
  ruta: string;
  tipo: "pesos" | "texto" | "numero" | "booleano";
  /** Casilla F210 o norma relacionada (para explicar el porqué). */
  referencia: string;
  /** Pregunta condicional: solo aplica si esta ruta tiene valor truthy. */
  condicion?: { ruta: string; operador: ">" | "<" | "==" | "!=" | "truthy"; valor?: number | string | boolean };
}

export const CATALOGO_PREGUNTAS: Pregunta[] = [
  // Identidad
  {
    id: "alias",
    seccion: "identidad",
    titulo: "¿Cómo llamamos a este expediente?",
    detalle: "Un alias corto (sin datos sensibles) para reconocer el expediente. Ejemplo: «Declaración propia 2026».",
    ruta: "contribuyente.alias",
    tipo: "texto",
    referencia: "Expediente financiero (Módulo 4)",
  },
  {
    id: "nit_2",
    seccion: "identidad",
    titulo: "¿Cuáles son los dos últimos dígitos de tu NIT (sin dígito de verificación)?",
    detalle: "Define tu fecha de vencimiento en el calendario DIAN (Decreto 2229 de 2023).",
    ruta: "contribuyente.nitUltimos2",
    tipo: "texto",
    referencia: "Calendario tributario DIAN",
  },
  {
    id: "dependientes",
    seccion: "identidad",
    titulo: "¿Cuántos dependientes económicos tienes?",
    detalle:
      "Abre hasta dos beneficios: la deducción del art. 387 (10% de los ingresos de trabajo, tope 384 UVT) y la de 72 UVT por dependiente (art. 336, hasta 4). Necesitas poder probar el vínculo y la dependencia económica.",
    ruta: "contribuyente.dependientes",
    tipo: "numero",
    referencia: "Arts. 387 y 336 num. 3 ET · casillas 138-139",
  },
  {
    id: "obligado_contabilidad",
    seccion: "identidad",
    titulo: "¿Estás obligado a llevar contabilidad?",
    detalle: "Si la respuesta es sí, este flujo v1 sale del alcance y te derivará a un contador con el expediente armado.",
    ruta: "contribuyente.obligadoContabilidad",
    tipo: "booleano",
    referencia: "Alcance del flujo (persona natural no obligada)",
  },
  // Rentas de trabajo (salarios)
  {
    id: "ingresos_trabajo",
    seccion: "rentas-trabajo",
    titulo: "¿Cuánto fue tu ingreso bruto por salarios en 2025?",
    detalle: "La casilla 32 pide los ingresos brutos de las rentas de trabajo. Lo encuentras en el certificado de ingresos y retenciones (formulario 220) de tu empleador.",
    ruta: "rentasTrabajo.ingresosBrutos",
    tipo: "pesos",
    referencia: "Casilla 32 · certificado 220",
  },
  {
    id: "aportes_salud_trabajo",
    seccion: "rentas-trabajo",
    titulo: "¿Cuánto aportaste a salud (EPS/medicina prepagada obligatoria) desde tus salarios?",
    detalle: "Los aportes obligatorios a salud son ingreso no constitutivo de renta (casilla 33). En relación laboral suele ser el 4% de tu salario.",
    ruta: "rentasTrabajo.aportesObligatoriosSalud",
    tipo: "pesos",
    referencia: "Arts. 55 y 56 ET · casilla 33",
  },
  {
    id: "aportes_pension_trabajo",
    seccion: "rentas-trabajo",
    titulo: "¿Cuánto aportaste a pensión obligatoria desde tus salarios?",
    detalle: "También es ingreso no constitutivo de renta (casilla 33). En relación laboral suele ser el 4% de tu salario.",
    ruta: "rentasTrabajo.aportesObligatoriosPension",
    tipo: "pesos",
    referencia: "Arts. 55 y 56 ET · casilla 33",
  },
  // Rentas de trabajo sin relación laboral (honorarios)
  {
    id: "ingresos_honorarios",
    seccion: "rentas-independientes",
    titulo: "¿Recibiste honorarios, servicios o ventas sin vínculo laboral?",
    detalle: "Si sí, ingresa el total bruto del año (casilla 43). Si no tuviste este tipo de ingresos, responde 0.",
    ruta: "rentasIndependientes.ingresosBrutos",
    tipo: "pesos",
    referencia: "Casilla 43",
  },
  {
    id: "costos_honorarios",
    seccion: "rentas-independientes",
    titulo: "¿Imputaste costos o gastos a esos honorarios?",
    detalle:
      "Advertencia del motor: si imputas costos, PIERDES la renta exenta del 25% sobre esos ingresos (art. 206 num. 10, parágrafo) y el motor vigila que no superen el 60% (art. 336-1, casilla 140).",
    ruta: "rentasIndependientes.costosGastos",
    tipo: "pesos",
    referencia: "Arts. 206-10 par. y 336-1 ET · casillas 45/140",
    condicion: { ruta: "rentasIndependientes.ingresosBrutos", operador: ">", valor: 0 },
  },
  {
    id: "aportes_independiente",
    seccion: "rentas-independientes",
    titulo: "¿Cuánto pagaste de aportes obligatorios a salud y pensión como independiente?",
    detalle: "Suma ambos (casilla 44). Como independiente: salud 12,5% y pensión 16% del IBC.",
    ruta: "rentasIndependientes.aportesObligatoriosSalud",
    tipo: "pesos",
    referencia: "Casilla 44",
    condicion: { ruta: "rentasIndependientes.ingresosBrutos", operador: ">", valor: 0 },
  },
  // Rentas de capital (casillas 58-73)
  {
    id: "rendimientos_financieros",
    seccion: "rentas-capital",
    titulo: "¿Recibiste rendimientos financieros GRAVADOS (CDT, fondos de inversión o deuda, pagarés)?",
    detalle:
      "Son rentas de capital (art. 242, casilla 58): tributan con la tabla del art. 241. OJO: los intereses de CUENTAS DE AHORRO de personas naturales están EXENTOS (art. 206 num. 3) y NO se declaran aquí. Si no tuviste rendimientos gravados, responde 0.",
    ruta: "rentasCapital.ingresosBrutos",
    tipo: "pesos",
    referencia: "Casilla 58 · arts. 242 y 206 num. 3 ET",
  },
  // Cédula de dividendos (casillas 107-111, 118, 120, 124)
  {
    id: "dividendos_no_gravados",
    seccion: "dividendos",
    titulo: "¿Recibiste dividendos NO gravados de sociedades colombianas?",
    detalle:
      "El certificado de la sociedad lo indica: dividendos distribuidos con utilidades que SÍ tributaron en la sociedad (1a. subcédula, casilla 107). Estos se suman a tu renta líquida gravable y tributan con la tabla del art. 241. Si no recibiste dividendos, responde 0.",
    ruta: "dividendos.noGravados",
    tipo: "pesos",
    referencia: "Casilla 107 · art. 49 num. 3 ET",
  },
  {
    id: "dividendos_gravados",
    seccion: "dividendos",
    titulo: "¿Recibiste dividendos GRAVADOS (2a. subcédula) de sociedades colombianas?",
    detalle:
      "Son los distribuidos con utilidades EXENTAS en la sociedad (par. 2 art. 49, casilla 108): gravan al 35% (casilla 118) y su remanente entra a la tabla (casilla 111). Dan derecho al descuento del art. 254-1. Si no recibiste, responde 0.",
    ruta: "dividendos.gravados",
    tipo: "pesos",
    referencia: "Casillas 108 y 118 · art. 49 par. 2 y art. 254-1 ET",
  },
  {
    id: "dividendos_exterior",
    seccion: "dividendos",
    titulo: "¿Recibiste dividendos o participaciones del EXTERIOR?",
    detalle:
      "Gravan al 35% fijo (casilla 120, art. 244) y NO entran a la tabla del art. 241. Si parte fue exenta por convenio de no doble tributación, ajusta esa parte en el expediente (casilla 110). Si no recibiste, responde 0.",
    ruta: "dividendos.delExterior",
    tipo: "pesos",
    referencia: "Casillas 109/120 · art. 244 ET",
  },
  // Deducciones
  {
    id: "intereses_vivienda",
    seccion: "deducciones",
    titulo: "¿Pagaste intereses por crédito de vivienda o leasing habitacional en 2025?",
    detalle: "El certificado bancario anual los registra (art. 119, tope 1.200 UVT). Si no tuviste crédito de vivienda, responde 0.",
    ruta: "deducciones.interesesVivienda",
    tipo: "pesos",
    referencia: "Art. 119 ET · casilla 38",
  },
  {
    id: "medicina_prepagada",
    seccion: "deducciones",
    titulo: "¿Pagaste medicina prepagada o seguros de salud por ti y tus dependientes?",
    detalle: "Deducible con tope de 192 UVT al año (art. 387). Pide el certificado anual a la aseguradora.",
    ruta: "deducciones.medicinaPrepagada",
    tipo: "pesos",
    referencia: "Art. 387 ET",
  },
  {
    id: "gmf",
    seccion: "deducciones",
    titulo: "¿Cuánto pagaste de gravamen a los movimientos financieros (4x1000) en el año?",
    detalle: "El 50% del GMF pagado es deducible (art. 115). Tu banco lo certifica en el certificado tributario anual. Si no lo sabes, responde 0.",
    ruta: "deducciones.gmfPagado",
    tipo: "pesos",
    referencia: "Art. 115 ET",
  },
  {
    id: "factura_electronica",
    seccion: "deducciones",
    titulo: "¿Cuánto compraste con factura electrónica pagada por medios electrónicos?",
    detalle:
      "El 1% de esas compras es deducción (art. 336 num. 5, tope 240 UVT) y NO se somete al límite del 40%: es una de las dos palancas que siempre ahorran. El listado lo descargas del portal MUISCA. Si no lo sabes, responde 0.",
    ruta: "deducciones.comprasFacturaElectronica",
    tipo: "pesos",
    referencia: "Art. 336 num. 5 ET · casilla 28",
  },
  // Rentas exentas
  {
    id: "aportes_voluntarios",
    seccion: "rentas-exentas",
    titulo: "¿Hiciste aportes voluntarios a pensión obligatoria o voluntaria?",
    detalle: "Son renta exenta con tope combinado de 3.800 UVT (arts. 126-1 y 126-4). Ojo: si el límite del 40% ya está copado, aportar más no ahorra.",
    ruta: "rentasExentas.aportesVoluntariosPension",
    tipo: "pesos",
    referencia: "Arts. 126-1 y 126-4 ET · casilla 35",
  },
  {
    id: "afc",
    seccion: "rentas-exentas",
    titulo: "¿Consignaste a cuentas AFC (ahorro para el fomento de la construcción)?",
    detalle: "Comparten el mismo tope de 3.800 UVT con los aportes voluntarios a pensiones (art. 126-1).",
    ruta: "rentasExentas.afc",
    tipo: "pesos",
    referencia: "Art. 126-1 ET",
  },
  // Patrimonio
  {
    id: "patrimonio_bruto",
    seccion: "patrimonio",
    titulo: "¿Cuál fue tu patrimonio bruto a 31 de diciembre de 2025?",
    detalle: "Suma de todos tus bienes y deudas a favor (casilla 29). La declaro tu declaración del año anterior o el formulario de activos.",
    ruta: "patrimonio.bruto",
    tipo: "pesos",
    referencia: "Casilla 29",
  },
  {
    id: "deudas",
    seccion: "patrimonio",
    titulo: "¿Cuánto debías a 31 de diciembre de 2025?",
    detalle: "Deudas pasivas (casilla 30): créditos de vivienda, libranza, tarjetas, préstamos. Certificados bancarios.",
    ruta: "patrimonio.deudas",
    tipo: "pesos",
    referencia: "Casilla 30",
  },
  {
    id: "patrimonio_anterior_bruto",
    seccion: "patrimonio",
    titulo: "¿Cuál fue tu patrimonio bruto a 31 de diciembre de 2024 (año anterior)?",
    detalle:
      "Se toma de tu declaración 2024 (casillas 29-30) y define la renta presuntiva: 0,5% del patrimonio líquido anterior (art. 189-5, casilla 98). Si NO declaraste en 2024, responde 0.",
    ruta: "patrimonio.anioAnteriorBruto",
    tipo: "pesos",
    referencia: "Casilla 98 · art. 189-5 ET",
  },
  {
    id: "patrimonio_anterior_deudas",
    seccion: "patrimonio",
    titulo: "¿Cuánto debías a 31 de diciembre de 2024?",
    detalle:
      "De la casilla 30 de tu declaración 2024. Con el patrimonio bruto anterior calcula el patrimonio líquido de la renta presuntiva. Si no declaraste, responde 0.",
    ruta: "patrimonio.anioAnteriorDeudas",
    tipo: "pesos",
    referencia: "Casilla 98 · art. 189-5 ET",
  },
  // Retenciones
  {
    id: "retenciones_trabajo",
    seccion: "retenciones",
    titulo: "¿Cuánto te retuvieron en la fuente por rentas de trabajo en 2025?",
    detalle: "Aparece en tu certificado 220 (casilla 132). Es el principal reducer del saldo a pagar.",
    ruta: "retenciones.rentasTrabajo",
    tipo: "pesos",
    referencia: "Casilla 132 · certificado 220",
  },
  // Obligación a declarar
  {
    id: "consumos_tarjeta",
    seccion: "obligacion",
    titulo: "¿Cuánto consumiste con tarjetas de crédito en el año?",
    detalle: "Solo para evaluar si estás obligado a declarar (> 1.400 UVT). No afecta el cálculo del impuesto.",
    ruta: "consumosTarjeta",
    tipo: "pesos",
    referencia: "Art. 594-3 ET",
  },
  {
    id: "consignaciones",
    seccion: "obligacion",
    titulo: "¿Cuánto fue el total de consignaciones bancarias o depósitos del año?",
    detalle: "Solo para evaluar si estás obligado a declarar (> 1.400 UVT). Si no lo sabes, responde 0.",
    ruta: "consignaciones",
    tipo: "pesos",
    referencia: "Art. 594-3 ET",
  },
];

/** Lee una ruta "a.b.c" del expediente de forma segura. */
function leerRuta(e: Expediente, ruta: string): unknown {
  const partes = ruta.split(".");
  let actual: unknown = e;
  for (const p of partes) {
    if (actual && typeof actual === "object" && p in (actual as Record<string, unknown>)) {
      actual = (actual as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return actual;
}

function esDato(x: unknown): x is DatoConOrigen<number> {
  return typeof x === "object" && x !== null && "procedencia" in x;
}

function cumpleCondicion(e: Expediente, cond: NonNullable<Pregunta["condicion"]>): boolean {
  const valor = leerRuta(e, cond.ruta);
  const num = esDato(valor) ? valor.valor ?? 0 : typeof valor === "number" ? valor : 0;
  switch (cond.operador) {
    case ">": return num > (cond.valor as number ?? 0);
    case "<": return num < (cond.valor as number ?? 0);
    case "==": return num === cond.valor;
    case "!=": return num !== cond.valor;
    case "truthy": return Boolean(num);
    default: return false;
  }
}

/** ¿La pregunta ya tiene respuesta? (dato conocido o decisión explícita). */
export function respondida(e: Expediente, p: Pregunta): boolean {
  const valor = leerRuta(e, p.ruta);
  if (p.tipo === "booleano") return typeof valor === "boolean";
  if (p.tipo === "texto") return typeof valor === "string" && valor.length > 0;
  if (p.tipo === "numero") return typeof valor === "number";
  if (esDato(valor)) return !esDesconocido(valor);
  return false;
}

/** Siguiente pregunta adaptativa: la primera del catálogo pendiente y aplicable. */
export function siguientePregunta(e: Expediente): Pregunta | null {
  for (const p of CATALOGO_PREGUNTAS) {
    if (p.condicion && !cumpleCondicion(e, p.condicion)) continue;
    if (!respondida(e, p)) return p;
  }
  return null;
}

/** Aplica una respuesta al expediente, siempre con procedencia "confirmado". */
export function responder(e: Expediente, pregunta: Pregunta, respuesta: number | string | boolean): Expediente {
  const copia: Expediente = structuredClone(e);
  const partes = pregunta.ruta.split(".");
  let actual: any = copia;
  for (let i = 0; i < partes.length - 1; i++) {
    actual = actual[partes[i]];
  }
  const clave = partes[partes.length - 1];
  if (pregunta.tipo === "booleano") {
    actual[clave] = Boolean(respuesta);
  } else if (pregunta.tipo === "numero") {
    actual[clave] = Number(respuesta) || 0;
  } else if (pregunta.tipo === "texto") {
    actual[clave] = String(respuesta).trim().slice(0, 60);
  } else {
    const num = Number(respuesta) || 0;
    if (esDato(actual[clave])) {
      actual[clave] = datoConfirmado(num);
    } else {
      actual[clave] = num;
    }
  }
  return copia;
}

/** Registra un dato extraído de documento (procedencia "documento"). */
export function registrarDocumento(
  e: Expediente,
  ruta: string,
  valor: number,
  archivo: string,
): Expediente {
  const copia: Expediente = structuredClone(e);
  const partes = ruta.split(".");
  let actual: any = copia;
  for (let i = 0; i < partes.length - 1; i++) {
    actual = actual[partes[i]];
  }
  const clave = partes[partes.length - 1];
  if (esDato(actual[clave])) {
    actual[clave] = datoDocumento(valor, archivo);
  } else {
    actual[clave] = valor;
  }
  return copia;
}

// ---------------------------------------------------------------------------
// Importación de documentos en CSV (exógena simplificada / certificado 220)
// ---------------------------------------------------------------------------

export interface FilaImportada {
  ruta: string;
  concepto: string;
  valor: number;
}

const MAPA_CSV: { patrones: RegExp; ruta: string; concepto: string }[] = [
  // Los patrones más específicos van primero: el find devuelve el primero que coincida.
  { patrones: /patrimonio.*anterior.*bruto|bruto.*anterior|presuntiva/i, ruta: "patrimonio.anioAnteriorBruto", concepto: "Patrimonio bruto del año anterior (casilla 98 · renta presuntiva)" },
  { patrones: /deuda.*anterior/i, ruta: "patrimonio.anioAnteriorDeudas", concepto: "Deudas del año anterior (renta presuntiva)" },
  { patrones: /dividendo.*gravad|subcedula.*2|2a.*subcedula/i, ruta: "dividendos.gravados", concepto: "Dividendos gravados 2a subcédula (casilla 108)" },
  { patrones: /dividendo|participacion/i, ruta: "dividendos.noGravados", concepto: "Dividendos (verificar subcédula con el certificado de la sociedad; casilla 107)" },
  { patrones: /cdt|rendimiento.*financier|interes.*financier|fondo.*inversion|pagare/i, ruta: "rentasCapital.ingresosBrutos", concepto: "Rendimientos financieros gravados (casilla 58)" },
  { patrones: /ingreso.*trabajo|salario|laboral/i, ruta: "rentasTrabajo.ingresosBrutos", concepto: "Ingresos brutos rentas de trabajo (casilla 32)" },
  { patrones: /aporte.*salud/i, ruta: "rentasTrabajo.aportesObligatoriosSalud", concepto: "Aportes obligatorios a salud (casilla 33)" },
  { patrones: /aporte.*pension/i, ruta: "rentasTrabajo.aportesObligatoriosPension", concepto: "Aportes obligatorios a pensión (casilla 33)" },
  { patrones: /interes.*vivienda|hipotecari/i, ruta: "deducciones.interesesVivienda", concepto: "Intereses de vivienda (casilla 38)" },
  { patrones: /retencion.*fuente|retencion.*renta/i, ruta: "retenciones.rentasTrabajo", concepto: "Retenciones en la fuente (casilla 132)" },
  { patrones: /patrimonio.*bruto|activo/i, ruta: "patrimonio.bruto", concepto: "Patrimonio bruto (casilla 29)" },
  { patrones: /deuda|pasivo/i, ruta: "patrimonio.deudas", concepto: "Deudas (casilla 30)" },
];

/** Parsea un CSV con líneas "concepto,valor" y clasifica por concepto. */
export function importarCsv(csv: string, archivo: string, e: Expediente): { expediente: Expediente; importadas: FilaImportada[]; ignoradas: string[] } {
  let expediente = e;
  const importadas: FilaImportada[] = [];
  const ignoradas: string[] = [];
  const lineas = csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const linea of lineas) {
    const cols = linea.split(/[;,\t]/);
    if (cols.length < 2) continue;
    const concepto = cols[0].replace(/^"|"$/g, "").trim();
    if (/concepto|descripcion/i.test(concepto)) continue; // encabezado
    const raw = cols[cols.length - 1].replace(/[$\s."']/g, "").replace(/\./g, "").trim();
    const valor = Number(raw);
    if (!Number.isFinite(valor)) {
      ignoradas.push(linea);
      continue;
    }
    const mapeo = MAPA_CSV.find((m) => m.patrones.test(concepto));
    if (!mapeo) {
      ignoradas.push(linea);
      continue;
    }
    expediente = registrarDocumento(expediente, mapeo.ruta, valor, archivo);
    importadas.push({ ruta: mapeo.ruta, concepto: mapeo.concepto, valor });
  }
  return { expediente, importadas, ignoradas };
}
