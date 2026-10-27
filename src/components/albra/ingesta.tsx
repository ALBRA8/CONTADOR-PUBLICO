"use client";

/**
 * PANEL DE INGESTA DE DOCUMENTOS — Módulo 3 del chaleco (v1.1)
 * ============================================================
 * El contador suelta aquí el certificado 220 (PDF), un certificado bancario
 * (XLSX/CSV) o el consolidado de exógena; el sistema propone DATOS con su
 * clasificación y el humano acepta, corrige o rechaza cada uno. Solo los
 * aceptados entran al expediente con procedencia "documento" y el nombre
 * del archivo como origen — la ingesta jamás escribe por su cuenta.
 */

import { useCallback, useState } from "react";
import { FileUp, FileCheck2, Loader2, TriangleAlert, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Expediente } from "@/lib/albra/tipos";
import { ResultadoIngesta, SugeridoIngesta, ingestarCsv, ingestarXlsx, aplicarSugeridos, fmtValor } from "@/lib/albra/ingesta";

interface Props {
  expediente: Expediente;
  onAplicar: (e: Expediente) => void;
}

interface Estado {
  resultado: ResultadoIngesta | null;
  aceptados: boolean[];
  valores: string[];
}

const estadoInicial: Estado = { resultado: null, aceptados: [], valores: [] };

export function IngestaPanel({ expediente, onAplicar }: Props) {
  const [estado, setEstado] = useState<Estado>(estadoInicial);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const procesar = useCallback(async (archivo: File) => {
    setError(null);
    setCargando(true);
    try {
      const nombre = archivo.name.toLowerCase();
      let resultado: ResultadoIngesta;
      if (nombre.endsWith(".pdf")) {
        const form = new FormData();
        form.append("archivo", archivo);
        const res = await fetch("/api/albra/ingesta-pdf", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "No se pudo procesar el PDF.");
        resultado = data.ingesta as ResultadoIngesta;
      } else if (nombre.endsWith(".xlsx") || nombre.endsWith(".xls")) {
        resultado = await ingestarXlsx(await archivo.arrayBuffer(), archivo.name);
      } else if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) {
        resultado = ingestarCsv(await archivo.text(), archivo.name);
      } else {
        throw new Error("Formato no soportado: usa PDF, XLSX o CSV.");
      }
      setEstado({
        resultado,
        aceptados: resultado.sugeridos.map(() => true),
        valores: resultado.sugeridos.map((s) => String(s.valor)),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al procesar el archivo.");
      setEstado(estadoInicial);
    } finally {
      setCargando(false);
    }
  }, []);

  const aplicar = () => {
    const { resultado, aceptados, valores } = estado;
    if (!resultado) return;
    const elegidos: SugeridoIngesta[] = [];
    resultado.sugeridos.forEach((s, i) => {
      if (!aceptados[i]) return;
      const n = Number(valores[i].replace(/[$\s.]/g, ""));
      elegidos.push({ ...s, valor: Number.isFinite(n) ? n : s.valor });
    });
    if (elegidos.length === 0) return;
    onAplicar(aplicarSugeridos(expediente, elegidos, resultado.archivo));
    setEstado(estadoInicial);
  };

  const { resultado } = estado;
  const totalAceptados = estado.aceptados.filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileUp className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Ingesta de documentos — PDF · XLSX · CSV</CardTitle>
        </div>
        <CardDescription>
          Certificado 220 (PDF), certificado bancario o consolidado de exógena (XLSX/CSV). El sistema propone;
          tú decides dato por dato. Nada entra al expediente sin tu aceptación, y todo queda marcado como
          «documento» con el archivo de origen.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-secondary/20 px-4 py-6 text-center transition-colors hover:border-primary/50 hover:bg-secondary/30">
          {cargando ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <FileUp className="h-5 w-5 text-muted-foreground" />}
          <span className="text-xs text-muted-foreground">
            {cargando ? "Procesando documento…" : "Arrastra o haz clic para elegir un archivo (PDF · XLSX · CSV)"}
          </span>
          <input
            type="file"
            accept=".pdf,.xlsx,.xls,.csv,.txt"
            className="hidden"
            onChange={(ev) => {
              const f = ev.target.files?.[0];
              if (f) void procesar(f);
              ev.target.value = "";
            }}
          />
        </label>

        {error && (
          <p className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-300">
            <TriangleAlert className="h-3.5 w-3.5" /> {error}
          </p>
        )}

        {resultado && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-cyan-500/40 bg-cyan-500/10 text-[10px] text-cyan-300">
                {resultado.tipo.toUpperCase()}
              </Badge>
              <span className="truncate text-[11px] text-muted-foreground">{resultado.archivo}</span>
              <span className="text-[11px] text-muted-foreground">
                · {resultado.sugeridos.length} dato(s) propuesto(s), {resultado.noClasificados.length} sin clasificar
              </span>
            </div>

            {resultado.sugeridos.map((s, i) => (
              <div key={`${s.ruta}-${i}`} className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-2.5">
                <Checkbox
                  checked={estado.aceptados[i]}
                  onCheckedChange={(v) => {
                    const copia = [...estado.aceptados];
                    copia[i] = v === true;
                    setEstado({ ...estado, aceptados: copia });
                  }}
                  className="shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-foreground">{s.concepto}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {s.referencia} → se guardará en «{s.ruta}» con procedencia documento
                  </p>
                </div>
                <Input
                  value={estado.valores[i]}
                  onChange={(ev) => {
                    const copia = [...estado.valores];
                    copia[i] = ev.target.value;
                    setEstado({ ...estado, valores: copia });
                  }}
                  className="h-8 w-36 bg-secondary/40 text-right font-mono text-xs"
                />
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground/70">{fmtValor(s.valor)}</span>
              </div>
            ))}

            {resultado.noClasificados.length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5">
                <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                  <Info className="h-3 w-3" /> Conceptos que el clasificador no reconoció (revísalos a mano):
                </p>
                <ul className="space-y-0.5">
                  {resultado.noClasificados.map((f, i) => (
                    <li key={i} className="text-[10.5px] text-muted-foreground">
                      {f.concepto} · {fmtValor(f.valor)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8 text-xs" disabled={totalAceptados === 0} onClick={aplicar}>
                <FileCheck2 className="mr-1.5 h-3.5 w-3.5" />
                Aplicar {totalAceptados} dato(s) aceptado(s) al expediente
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEstado(estadoInicial)}>
                Descartar todo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
