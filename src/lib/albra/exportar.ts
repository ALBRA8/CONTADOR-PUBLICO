/**
 * EXPORTACIONES DEL BORRADOR — hoja de digitación y memoria de cálculo
 * =====================================================================
 * La hoja de digitación se entrega en orden de captura para MUISCA: cada fila
 * indica casilla, concepto, valor y si se digita o se verifica (fórmula).
 * La memoria de cálculo es el registro de evidencias del borrador.
 */

import { ResultadoLiquidacion, fmt } from "./motor";
import { Expediente, EstadoProcedimiento } from "./tipos";

interface FilaDigitacion {
  casilla: number;
  concepto: string;
  valor: number;
  modo: "digitar" | "verificar" | "opcional";
}

const NOMBRES_CASILLAS: Record<number, string> = {
  28: "Uno por ciento (1%) de compras con factura electrónica",
  29: "Total patrimonio bruto",
  30: "Deudas",
  31: "Total patrimonio líquido",
  32: "Ingresos brutos de las Rentas de trabajo",
  33: "Ingresos no constitutivos de renta de las Rentas de trabajo",
  34: "Renta líquida de las Rentas de trabajo",
  37: "Total rentas exentas de las Rentas de trabajo",
  38: "Deducciones imputables — Intereses de vivienda",
  39: "Deducciones imputables — Otras deducciones",
  40: "Total deducciones imputables a las Rentas de trabajo",
  41: "Rentas exentas y/o deducciones imputables a las Rentas de trabajo (limitadas)",
  42: "Renta líquida ordinaria de las Rentas de trabajo",
  43: "Ingresos brutos de las Rentas de trabajo sin relación laboral",
  44: "Ingresos no constitutivos de renta (sin relación laboral)",
  45: "Costos y deducciones procedentes (sin relación laboral)",
  46: "Renta líquida de las Rentas de trabajo sin relación laboral",
  53: "Rentas exentas y/o deducciones imputables (limitadas) — sin relación laboral",
  57: "Renta líquida ordinaria de las Rentas de trabajo sin relación laboral",
  91: "Renta líquida cédula general",
  92: "Rentas exentas y deducciones imputables limitadas",
  93: "Renta líquida ordinaria cédula general",
  96: "Rentas gravables",
  97: "Renta líquida gravable cédula general",
  99: "Ingresos brutos por rentas de pensiones",
  100: "Ingresos no constitutivos de renta (pensiones)",
  101: "Renta líquida cédula de pensiones",
  102: "Rentas exentas de pensiones",
  103: "Renta líquida gravable cédula de pensiones",
  104: "Dividendos no gravados (1a subcédula)",
  107: "Dividendos gravados (2a subcédula)",
  111: "Renta líquida gravable de dividendos (remanente)",
  112: "Ingresos por ganancias ocasionales",
  113: "Costos por ganancias ocasionales",
  114: "Ganancias ocasionales no gravadas y exentas",
  115: "Ganancias ocasionales gravables",
  116: "Impuesto sobre rentas líquidas gravables (tabla art. 241)",
  118: "Impuesto dividendos gravados (35%)",
  124: "Descuento por dividendos (art. 254-1)",
  125: "Total descuentos tributarios",
  126: "Impuesto neto de renta",
  127: "Impuesto de ganancias ocasionales",
  129: "Total impuesto a cargo",
  130: "Anticipo renta liquidado año gravable anterior",
  131: "Saldo a favor año anterior sin solicitud",
  132: "Retenciones año gravable a declarar",
  133: "Anticipo renta año gravable siguiente",
  134: "Saldo a pagar por impuesto",
  135: "Sanciones",
  136: "Total saldo a pagar",
  137: "Total saldo a favor",
  138: "Número de dependientes económicos",
  139: "Adición por dependientes a la casilla 92",
};

const CASILLAS_FORMULA = new Set([
  31, 34, 40, 41, 42, 46, 52, 53, 57, 61, 65, 68, 69, 73, 78, 82, 85, 86, 90, 91, 92, 93, 96, 97,
  101, 103, 115, 121, 125, 126, 129, 134, 136, 137,
]);

/** Orden de captura sugerido para MUISCA. */
export function hojaDigitacion(r: ResultadoLiquidacion): FilaDigitacion[] {
  return Object.entries(r.casillas)
    .map(([n, valor]) => ({
      casilla: Number(n),
      concepto: NOMBRES_CASILLAS[Number(n)] ?? `Casilla ${n}`,
      valor,
      modo: (CASILLAS_FORMULA.has(Number(n)) ? "verificar" : valor === 0 ? "opcional" : "digitar") as FilaDigitacion["modo"],
    }))
    .filter((f) => f.valor !== 0 || f.modo === "verificar")
    .sort((a, b) => a.casilla - b.casilla);
}

export function hojaDigitacionCsv(r: ResultadoLiquidacion): string {
  const lineas = ["casilla;concepto;valor_cop;modo"];
  for (const f of hojaDigitacion(r)) {
    lineas.push(`${f.casilla};"${f.concepto}";${f.valor};${f.modo}`);
  }
  return lineas.join("\n");
}

export function memoriaJson(r: ResultadoLiquidacion, e: Expediente, estado: EstadoProcedimiento): string {
  return JSON.stringify(
    {
      sistema: "CONTADOR PÚBLICO ALBRA — borrador F210",
      anio_gravable: 2025,
      anio_presentacion: 2026,
      estado_procedimiento: estado,
      generado: new Date().toISOString(),
      advertencia:
        "Este documento es un borrador de cálculo con memoria de cálculo trazable. NO es una declaración presentada ante la DIAN.",
      expediente: e,
      resultado: {
        desenlace: r.desenlace,
        valores: r.valores,
        casillas: r.casillas,
        alertas: r.alertas,
        pendientes: r.pendientes,
        casilla_140: r.casilla140,
        vencimiento: r.vencimiento,
        memoria_calculo: r.memoria,
      },
    },
    null,
    2,
  );
}

export function descargarTexto(nombre: string, contenido: string, mime = "text/plain") {
  const blob = new Blob([contenido], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

export { fmt };
