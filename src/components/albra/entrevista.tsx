"use client";

import { useState } from "react";
import { MessageSquareText, CheckCircle2, ArrowRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Expediente } from "@/lib/albra/tipos";
import { CATALOGO_PREGUNTAS, Pregunta, importarCsv } from "@/lib/albra/agente";

interface Props {
  expediente: Expediente;
  onResponder: (pregunta: Pregunta, respuesta: number | string | boolean) => void;
  onImportarCsv: (archivo: File) => void;
  csvInfo: string | null;
  siguiente: Pregunta | null;
}

export function Entrevista({ expediente, onResponder, onImportarCsv, csvInfo, siguiente }: Props) {
  const [texto, setTexto] = useState("");

  const respondidas = CATALOGO_PREGUNTAS.filter((p) => !necesitaRespuesta(expediente, p));

  const enviar = () => {
    if (!siguiente) return;
    if (siguiente.tipo === "booleano") return; // las booleanas se responden con el switch
    if (!texto.trim()) return;
    onResponder(siguiente, texto.trim());
    setTexto("");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      {/* Pregunta activa */}
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Entrevista adaptativa</CardTitle>
          </div>
          <CardDescription>
            El agente pregunta SOLO lo que falta para liquidar. Nunca asume respuestas tributarias: lo que no respondes, queda pendiente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!siguiente ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              <p className="text-sm font-semibold text-foreground">Entrevista completa</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Todos los datos del catálogo v1 tienen respuesta. Revisa el expediente y el borrador; los hallazgos del auditor aparecen arriba.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10px] text-primary">
                  {seccionNombre(siguiente.seccion)}
                </Badge>
                <p className="mt-3 text-[15px] font-semibold leading-snug text-foreground">{siguiente.titulo}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{siguiente.detalle}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/30 px-2 py-1 font-mono text-[10px] text-cyan-300">
                  <Info className="h-3 w-3" /> {siguiente.referencia}
                </p>
              </div>

              {siguiente.tipo === "booleano" ? (
                <div className="flex items-center justify-between rounded-lg border border-border bg-card/60 p-3">
                  <span className="text-xs text-muted-foreground">Responder «No»</span>
                  <Switch onCheckedChange={(v) => onResponder(siguiente, v)} />
                </div>
              ) : siguiente.tipo === "texto" ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviar()}
                    placeholder="Escribe tu respuesta…"
                    className="bg-secondary/40"
                  />
                  <Button onClick={enviar} className="gap-1.5">
                    Responder <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviar()}
                    inputMode={siguiente.tipo === "numero" ? "numeric" : "decimal"}
                    placeholder="0"
                    className="bg-secondary/40 text-right font-mono"
                  />
                  <Button onClick={enviar} className="gap-1.5">
                    Responder <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progreso + importación */}
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progreso por sección</CardTitle>
            <CardDescription>Respondidas con datos confirmados por ti o importados de documentos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {["identidad", "rentas-trabajo", "rentas-independientes", "deducciones", "rentas-exentas", "patrimonio", "retenciones", "obligacion"].map((sec) => {
              const total = CATALOGO_PREGUNTAS.filter((p) => p.seccion === sec).length;
              const hechas = respondidas.filter((p) => p.seccion === sec).length;
              return (
                <div key={sec} className="flex items-center gap-2">
                  <span className="w-40 shrink-0 text-[11px] text-muted-foreground">{seccionNombre(sec as Pregunta["seccion"])}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all"
                      style={{ width: `${total ? (hechas / total) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">{hechas}/{total}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Importar documentos (CSV)</CardTitle>
            <CardDescription>
              Exógena o certificado 220 en CSV con líneas «concepto,valor». Los datos importados quedan con procedencia «documento» y la entrevista solo pregunta lo que siga faltando.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept=".csv,text/csv,text/plain"
              className="hidden"
              id="csv-doc"
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                if (f) onImportarCsv(f);
                ev.target.value = "";
              }}
            />
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => document.getElementById("csv-doc")?.click()}>
              Seleccionar CSV
            </Button>
            {csvInfo && <p className="mt-2 text-[11px] leading-relaxed text-emerald-300">{csvInfo}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function necesitaRespuesta(e: Expediente, p: Pregunta): boolean {
  // réplica ligera de respondida() para el progreso visual
  const partes = p.ruta.split(".");
  let actual: any = e;
  for (const parte of partes) {
    if (actual == null) return true;
    actual = actual[parte];
  }
  if (p.tipo === "booleano") return typeof actual !== "boolean";
  if (p.tipo === "texto") return !(typeof actual === "string" && actual.length > 0);
  if (typeof actual === "object" && actual !== null) return actual.valor == null;
  return actual == null;
}

function seccionNombre(s: Pregunta["seccion"]): string {
  const nombres: Record<Pregunta["seccion"], string> = {
    identidad: "Identidad",
    "rentas-trabajo": "Rentas de trabajo",
    "rentas-independientes": "Honorarios",
    "rentas-capital": "Rentas de capital",
    dividendos: "Dividendos",
    deducciones: "Deducciones",
    "rentas-exentas": "Rentas exentas",
    patrimonio: "Patrimonio",
    retenciones: "Retenciones",
    obligacion: "Obligación a declarar",
  };
  return nombres[s];
}
