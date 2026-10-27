"use client";

import { useState } from "react";
import { FileSpreadsheet, ChevronDown, ChevronRight, Sigma, Scale, Landmark, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResultadoLiquidacion, fmt } from "@/lib/albra/motor";
import { hojaDigitacion } from "@/lib/albra/exportar";

interface Props {
  resultado: ResultadoLiquidacion;
}

const NOMBRES_CASILLAS: Record<number, string> = {
  28: "1% de compras con factura electrónica",
  29: "Total patrimonio bruto",
  30: "Deudas",
  31: "Total patrimonio líquido",
  32: "Ingresos brutos de las Rentas de trabajo",
  33: "Ingresos no constitutivos de renta de las Rentas de trabajo",
  34: "Renta líquida de las Rentas de trabajo",
  37: "Total rentas exentas de las Rentas de trabajo",
  38: "Deducciones imputables — Intereses de vivienda",
  39: "Deducciones imputables — Otras deducciones",
  41: "Rentas exentas y/o deducciones imputables a las Rentas de trabajo (limitadas)",
  42: "Renta líquida ordinaria de las Rentas de trabajo",
  43: "Ingresos brutos de las Rentas de trabajo sin relación laboral",
  44: "Ingresos no constitutivos de renta (sin relación laboral)",
  45: "Costos y deducciones procedentes (sin relación laboral)",
  46: "Renta líquida de las Rentas de trabajo sin relación laboral",
  53: "Rentas exentas y/o deducciones imputables (limitadas) — sin relación laboral",
  57: "Renta líquida ordinaria de las Rentas de trabajo sin relación laboral",
  58: "Ingresos brutos de las Rentas de capital",
  59: "Ingresos no constitutivos de renta de las Rentas de capital",
  60: "Costos y deducciones procedentes de las Rentas de capital",
  61: "Renta líquida de las Rentas de capital",
  69: "Rentas exentas y/o deducciones imputables a las Rentas de capital (limitadas)",
  70: "Renta líquida ordinaria del ejercicio de las Rentas de capital",
  71: "Pérdida líquida del ejercicio de las Rentas de capital",
  73: "Renta líquida ordinaria de las Rentas de capital",
  91: "Renta líquida cédula general",
  92: "Rentas exentas y deducciones imputables limitadas",
  93: "Renta líquida ordinaria cédula general",
  96: "Rentas gravables",
  97: "Renta líquida gravable cédula general",
  98: "Renta presuntiva (art. 189-5)",
  99: "Ingresos brutos por rentas de pensiones",
  100: "Ingresos no constitutivos de renta (pensiones)",
  101: "Renta líquida cédula de pensiones",
  102: "Rentas exentas de pensiones",
  103: "Renta líquida gravable cédula de pensiones",
  104: "Dividendos año 2016 y anteriores (fuera de alcance v1.1)",
  107: "Dividendos no gravados — 1a subcédula (num. 3 art. 49)",
  108: "Dividendos gravados — 2a subcédula (par. 2 art. 49)",
  109: "Dividendos y participaciones recibidas del exterior",
  110: "Rentas exentas de la casilla 109",
  111: "Renta líquida gravable total (97 o 98 + 103 + 107 + 108 − 118)",
  112: "Ingresos por ganancias ocasionales",
  113: "Costos por ganancias ocasionales",
  114: "Ganancias ocasionales no gravadas y exentas",
  115: "Ganancias ocasionales gravables",
  116: "Impuesto sobre rentas líquidas gravables (tabla art. 241)",
  118: "Impuesto dividendos gravados 35% (2a subcédula)",
  120: "Impuesto dividendos del exterior 35% (109 − 110)",
  121: "Total impuesto sobre las rentas líquidas gravables",
  124: "Descuento por dividendos gravados (art. 254-1)",
  125: "Total descuentos tributarios",
  126: "Impuesto neto de renta",
  127: "Impuesto de ganancias ocasionales",
  129: "Total impuesto a cargo",
  130: "Anticipo renta liquidado año gravable anterior",
  131: "Saldo a favor año anterior sin solicitud",
  132: "Retenciones año gravable a declarar",
  133: "Anticipo renta año gravable siguiente",
  134: "Saldo a pagar por impuesto",
  136: "Total saldo a pagar",
  137: "Total saldo a favor",
  138: "Número de dependientes económicos",
  139: "Adición por dependientes a la casilla 92",
};

export function BorradorF210({ resultado }: Props) {
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set());

  const alternar = (clave: string) => {
    const copia = new Set(abiertas);
    if (copia.has(clave)) copia.delete(clave);
    else copia.add(clave);
    setAbiertas(copia);
  };

  const casillasOrdenadas = Object.entries(resultado.casillas)
    .map(([n, v]) => ({ n: Number(n), v }))
    .filter((f) => f.v !== 0 || [91, 92, 93, 97, 98, 111, 116, 121, 126, 129].includes(f.n))
    .sort((a, b) => a.n - b.n);

  const memoriaDeCasilla = (n: number) =>
    resultado.memoria.filter((paso) => paso.formula.includes(String(n)) || paso.concepto.includes(`casilla ${n}`) || paso.concepto.includes(`(casilla ${n}`));

  const filasDigitacion = hojaDigitacion(resultado);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      {/* Borrador casilla por casilla */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Borrador del Formulario 210 — casilla por casilla</CardTitle>
          </div>
          <CardDescription>
            Haz clic en cualquier casilla para ver la memoria de cálculo que la reconstruye: fórmula, entradas y norma. La misma entrada produce siempre el mismo resultado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {casillasOrdenadas.map(({ n, v }) => {
            const clave = `c${n}`;
            const abierta = abiertas.has(clave);
            const pasos = memoriaDeCasilla(n);
            return (
              <div key={n} className="rounded-lg border border-border bg-card/60">
                <button
                  type="button"
                  onClick={() => alternar(clave)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left"
                >
                  {abierta ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-primary" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                  <span className="w-9 shrink-0 rounded border border-border bg-secondary/40 px-1 py-0.5 text-center font-mono text-[11px] text-cyan-300">{n}</span>
                  <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">{NOMBRES_CASILLAS[n] ?? `Casilla ${n}`}</span>
                  <span className={`shrink-0 font-mono text-[12px] tabular-nums ${v === 0 ? "text-muted-foreground/40" : "text-foreground"}`}>{fmt(v)}</span>
                </button>
                {abierta && (
                  <div className="space-y-1.5 border-t border-border/60 px-3 py-2">
                    {pasos.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">
                        Casilla determinada directamente por el motor (fórmula del instructivo F210 v16, Res. DIAN 000044/2024). Consulta la memoria completa en la columna de evidencias.
                      </p>
                    ) : (
                      pasos.map((paso, i) => (
                        <div key={i} className="rounded-md border border-border/60 bg-secondary/20 p-2">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-[11px] font-medium text-foreground">{paso.concepto.trim()}</p>
                            <p className="shrink-0 font-mono text-[11px] text-primary">{fmt(paso.valor)}</p>
                          </div>
                          {paso.formula && <p className="mt-0.5 font-mono text-[10px] text-cyan-300">{paso.formula}</p>}
                          {paso.nota && <p className="mt-0.5 text-[10px] text-amber-300">{paso.nota}</p>}
                          {paso.norma && <p className="mt-0.5 text-[10px] text-muted-foreground">Norma: {paso.norma}</p>}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Resumen y hoja de digitación */}
      <div className="space-y-5">
        <Card className={resultado.desenlace === "R2_saldo_a_pagar" ? "border-amber-500/30" : "border-emerald-500/30"}>
          <CardHeader>
            <div className="flex items-center gap-2">
              {resultado.valores["saldo_a_pagar"] > 0 ? <Coins className="h-4 w-4 text-amber-400" /> : <Scale className="h-4 w-4 text-emerald-400" />}
              <CardTitle className="text-base">Resultado de la liquidación</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <LineaResumen etiqueta="Renta líquida gravable (cédulas integradas)" valor={fmt(resultado.valores["renta_liquida_gravable"])} />
            <LineaResumen etiqueta="Impuesto sobre la renta (art. 241)" valor={fmt(resultado.valores["impuesto_renta"])} />
            {resultado.valores["go_impuesto"] > 0 && <LineaResumen etiqueta="Impuesto de ganancias ocasionales" valor={fmt(resultado.valores["go_impuesto"])} />}
            <LineaResumen etiqueta="Total impuesto a cargo" valor={fmt(resultado.valores["total_impuesto_cargo"])} />
            <LineaResumen etiqueta="Retenciones (casilla 132)" valor={fmt(resultado.valores["retenciones"])} />
            <LineaResumen etiqueta="Anticipo para el año siguiente (art. 807)" valor={fmt(resultado.valores["anticipo_siguiente"])} />
            <div className="my-2 border-t border-border/60" />
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] font-semibold text-foreground">
                {resultado.valores["saldo_a_pagar"] > 0 ? "Saldo a pagar (art. 577 ET)" : "Saldo a favor (art. 577 ET)"}
              </span>
              <span className={`font-mono text-base font-bold ${resultado.valores["saldo_a_pagar"] > 0 ? "text-amber-300" : "text-emerald-300"}`}>
                {fmt(resultado.valores["saldo_a_pagar"] || resultado.valores["saldo_a_favor"] || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sigma className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-base">Hoja de digitación (orden de captura)</CardTitle>
            </div>
            <CardDescription>
              Casillas a digitar en MUISCA en orden, con su modo: «digitar» (valor directo), «verificar» (debe coincidir con la fórmula) u «opcional» (cero).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
              {filasDigitacion.map((f) => (
                <div key={f.casilla} className="flex items-center gap-2 rounded-md border border-border/60 bg-secondary/20 px-2 py-1.5">
                  <span className="w-8 shrink-0 text-center font-mono text-[10px] text-cyan-300">{f.casilla}</span>
                  <span className="min-w-0 flex-1 truncate text-[10.5px] text-muted-foreground">{f.concepto}</span>
                  <Badge variant="outline" className={`shrink-0 text-[8.5px] ${f.modo === "digitar" ? "border-emerald-500/40 text-emerald-300" : f.modo === "verificar" ? "border-cyan-500/40 text-cyan-300" : "border-border text-muted-foreground"}`}>
                    {f.modo.toUpperCase()}
                  </Badge>
                  <span className="w-24 shrink-0 text-right font-mono text-[10.5px] tabular-nums text-foreground">{fmt(f.valor)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-start gap-2 py-3">
            <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Este borrador NO es una declaración presentada. El diligenciamiento y la presentación en MUISCA los hace el
              declarante con su clave; el sistema registra después cada paso como evidencia (pestaña «Estados y Evidencias»).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LineaResumen({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11.5px] text-muted-foreground">{etiqueta}</span>
      <span className="font-mono text-[12.5px] tabular-nums text-foreground">{valor}</span>
    </div>
  );
}
