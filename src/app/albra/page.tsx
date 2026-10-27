"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquareText,
  FolderOpen,
  FileSpreadsheet,
  ShieldCheck,
  ArrowLeft,
  Download,
  Upload,
  RotateCcw,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  expedienteVacio,
  fusionarExpediente,
  ESTADOS,
  EstadoProcedimiento,
  Expediente,
  REGLA_INNEGOCIABLE,
  esDesconocido,
} from "@/lib/albra/tipos";
import { liquidar, fmt } from "@/lib/albra/motor";
import { siguientePregunta, Pregunta, CATALOGO_PREGUNTAS, responder, importarCsv as importarCsvModulo } from "@/lib/albra/agente";
import { descargarTexto, hojaDigitacionCsv, memoriaJson } from "@/lib/albra/exportar";
import { Entrevista } from "@/components/albra/entrevista";
import { VistaExpediente } from "@/components/albra/expediente";
import { BorradorF210 } from "@/components/albra/borrador";
import { VistaEvidencias } from "@/components/albra/evidencias";
import { IngestaPanel } from "@/components/albra/ingesta";

const STORAGE_KEY = "albra-expediente-v1";
const ESTADO_KEY = "albra-estado-v1";

export default function AlbraPage() {
  const [expediente, setExpediente] = useState<Expediente>(expedienteVacio);
  const [estado, setEstado] = useState<EstadoProcedimiento>("INCOMPLETO");
  const [aprobacionHumanos, setAprobacionHumanos] = useState(false);
  const [cargado, setCargado] = useState(false);

  // ── Persistencia local (el expediente nunca sale del navegador) ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Hidratación desde localStorage: patrón legítimo solo-cliente; se desactiva
      // la regla de setState-en-efecto porque el estado inicial no puede leer
      // localStorage durante el render de servidor sin romper el hidratado.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setExpediente(fusionarExpediente(JSON.parse(raw)));
      const est = localStorage.getItem(ESTADO_KEY);
      if (est) setEstado(est as EstadoProcedimiento);
      if (localStorage.getItem("albra-aprobacion-v1") === "1") setAprobacionHumanos(true);
    } catch {
      // primera visita: expediente vacío
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) localStorage.setItem(STORAGE_KEY, JSON.stringify(expediente));
  }, [expediente, cargado]);
  useEffect(() => {
    if (cargado) localStorage.setItem(ESTADO_KEY, estado);
  }, [estado, cargado]);
  useEffect(() => {
    if (cargado) localStorage.setItem("albra-aprobacion-v1", aprobacionHumanos ? "1" : "0");
  }, [aprobacionHumanos, cargado]);

  // ── El motor corre en el cliente: determinista, sin envío a servicios externos ──
  const resultado = useMemo(() => liquidar(expediente), [expediente]);
  const siguiente = useMemo(() => siguientePregunta(expediente), [expediente]);

  const totalPreguntas = CATALOGO_PREGUNTAS.length;
  const pendientesEntrevista = useMemo(() => (siguiente ? contarPendientes(expediente) : 0), [siguiente, expediente]);
  const completitud = Math.round(((totalPreguntas - pendientesEntrevista) / totalPreguntas) * 100);

  const puedeValidar = resultado.pendientes.length === 0;
  const indiceEstado = ESTADOS.findIndex((e) => e.id === estado);

  const avanzarEstado = useCallback(
    (destino: EstadoProcedimiento, requisitosOk: boolean, mensajeRequisito: string) => {
      if (!requisitosOk) {
        alert(mensajeRequisito); // v1: aviso explícito; la transición exige su requisito
        return;
      }
      setEstado(destino);
    },
    [],
  );

  const cargarExpediente = (archivo: File) => {
    archivo.text().then((txt) => {
      try {
        const datos = JSON.parse(txt);
        if (datos && typeof datos === "object" && datos.contribuyente) {
          setExpediente(fusionarExpediente(datos));
          setEstado("INCOMPLETO");
        } else alert("El archivo no parece un expediente ALBRA.");
      } catch {
        alert("No se pudo leer el JSON del expediente.");
      }
    });
  };

  const reiniciar = () => {
    if (confirm("¿Reiniciar el expediente completo? Esta acción no se puede deshacer.")) {
      setExpediente(expedienteVacio());
      setEstado("INCOMPLETO");
      setAprobacionHumanos(false);
    }
  };

  const [csvInfo, setCsvInfo] = useState<string | null>(null);
  const importarCsvHandler = useCallback((archivo: File) => {
    archivo.text().then((contenido) => {
      const r = importarCsvModulo(contenido, archivo.name, expediente);
      setCsvInfo(
        `Archivo "${archivo.name}": ${r.importadas.length} dato(s) importado(s) con procedencia "documento"` +
          (r.ignoradas.length > 0 ? `, ${r.ignoradas.length} línea(s) sin concepto reconocido` : ""),
      );
      if (r.importadas.length > 0) setExpediente(r.expediente);
    });
  }, [expediente]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Encabezado */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/50 text-muted-foreground transition-colors hover:text-primary"
              title="Volver al panel de proyecto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-tight sm:text-base">
                CONTADOR PÚBLICO <span className="text-primary">ALBRA</span>
                <span className="ml-2 text-muted-foreground">· Sistema funcional v1.1</span>
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Formulario 210 · Año gravable 2025 · UVT $49.799 · Motor determinista validado por paridad · rentas de capital, dividendos y renta presuntiva incluidos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="application/json"
              className="hidden"
              id="cargar-expediente"
              onChange={(ev) => {
                const f = ev.target.files?.[0];
                if (f) cargarExpediente(f);
                ev.target.value = "";
              }}
            />
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => document.getElementById("cargar-expediente")?.click()}>
              <Upload className="mr-1 h-3.5 w-3.5" /> Cargar JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => descargarTexto(`expediente-albra-${expediente.contribuyente.alias || "sin-alias"}.json`, JSON.stringify(expediente, null, 2), "application/json")}
            >
              <Download className="mr-1 h-3.5 w-3.5" /> Exportar
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={reiniciar}>
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reiniciar
            </Button>
          </div>
        </div>

        {/* Estados del procedimiento (Prompt Maestro §8) */}
        <div className="mx-auto max-w-[1400px] overflow-x-auto px-4 pb-3 sm:px-6">
          <div className="flex min-w-max items-center gap-1">
            {ESTADOS.map((e, i) => {
              const activo = i === indiceEstado;
              const pasado = i < indiceEstado;
              return (
                <div key={e.id} className="flex items-center gap-1">
                  <div
                    className={`rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wide ${
                      activo
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : pasado
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-border bg-secondary/30 text-muted-foreground/60"
                    }`}
                    title={e.descripcion}
                  >
                    {e.id}
                  </div>
                  {i < ESTADOS.length - 1 && <span className={pasado ? "text-emerald-400" : "text-muted-foreground/30"}>→</span>}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className="albra-grid-bg flex-1">
        <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-6 sm:px-6">
          {/* KPIs del borrador */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard titulo="Completitud de la entrevista" valor={`${completitud}%`} detalle={`${totalPreguntas - pendientesEntrevista} de ${totalPreguntas} datos`} />
            <KpiCard
              titulo="Desenlace del motor"
              valor={
                resultado.desenlace === "R2_saldo_a_pagar"
                  ? "Saldo a pagar"
                  : resultado.desenlace === "R3_saldo_a_favor"
                    ? "Saldo a favor"
                    : resultado.desenlace === "R1_no_obligado"
                      ? "No obligado"
                      : resultado.desenlace === "R4_impuesto_cero"
                        ? "Impuesto cero"
                        : "Fuera de alcance"
              }
              detalle={`Estado: ${estado}`}
            />
            <KpiCard
              titulo={resultado.valores["saldo_a_pagar"] > 0 ? "Saldo a pagar (casilla 134/136)" : resultado.valores["saldo_a_favor"] > 0 ? "Saldo a favor (casilla 137)" : "Saldo"}
              valor={fmt(resultado.valores["saldo_a_pagar"] || resultado.valores["saldo_a_favor"] || 0)}
              detalle="Aproximado al mil (art. 577 ET)"
            />
            <KpiCard titulo="Vencimiento según NIT" valor={resultado.vencimiento ?? "Pendiente"} detalle="Decreto 2229 de 2023" />
          </div>

          {/* Alertas del auditor */}
          {resultado.alertas.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-amber-300">
                <ShieldCheck className="h-4 w-4" /> Hallazgos del auditor de riesgos (Módulo 8)
              </p>
              <ul className="space-y-1.5">
                {resultado.alertas.map((a, i) => (
                  <li key={i} className="text-xs leading-relaxed text-muted-foreground">
                    <span className="mr-1.5 text-amber-400">▸</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Tabs defaultValue="entrevista" className="w-full">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary/50 p-1 sm:justify-center">
              <TabsTrigger value="entrevista" className="gap-1.5 data-[state=active]:text-primary">
                <MessageSquareText className="h-3.5 w-3.5" /> Entrevista
              </TabsTrigger>
              <TabsTrigger value="expediente" className="gap-1.5 data-[state=active]:text-primary">
                <FolderOpen className="h-3.5 w-3.5" /> Expediente
              </TabsTrigger>
              <TabsTrigger value="borrador" className="gap-1.5 data-[state=active]:text-primary">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Borrador F210
              </TabsTrigger>
              <TabsTrigger value="evidencias" className="gap-1.5 data-[state=active]:text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Estados y Evidencias
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entrevista" className="mt-5 space-y-5">
              <IngestaPanel expediente={expediente} onAplicar={setExpediente} />
              <Entrevista
                expediente={expediente}
                onResponder={(p, r) => setExpediente(responder(expediente, p, r))}
                onImportarCsv={importarCsvHandler}
                csvInfo={csvInfo}
                siguiente={siguiente}
              />
            </TabsContent>
            <TabsContent value="expediente" className="mt-5">
              <VistaExpediente expediente={expediente} onCambiar={setExpediente} />
            </TabsContent>
            <TabsContent value="borrador" className="mt-5">
              <BorradorF210 resultado={resultado} />
            </TabsContent>
            <TabsContent value="evidencias" className="mt-5">
              <VistaEvidencias
                estado={estado}
                resultado={resultado}
                expediente={expediente}
                puedeValidar={puedeValidar}
                aprobacionHumanos={aprobacionHumanos}
                onAprobacion={setAprobacionHumanos}
                onAvanzar={avanzarEstado}
                onRegresar={setEstado}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="mt-auto border-t border-border/60 bg-background/80 py-3">
        <p className="mx-auto max-w-[1400px] px-4 text-center text-[10px] leading-relaxed text-muted-foreground sm:px-6">
          {REGLA_INNEGOCIABLE} · Asistencia de cálculo, no asesoría tributaria ni sustituto de un contador público (arts. 571 y 746 ET). Los datos viven solo en este navegador.
        </p>
      </footer>
    </div>
  );
}

function contarPendientes(e: Expediente): number {
  let n = 0;
  let cursor: Expediente = e;
  // Cuenta cuántas preguntas del catálogo siguen pendientes.
  const ya: Set<string> = new Set();
  while (true) {
    const p = siguientePregunta(cursor);
    if (!p || ya.has(p.id)) break;
    ya.add(p.id);
    n += 1;
    // marca provisional en memoria local para avanzar el cursor sin mutar el estado real
    cursor = { ...cursor };
    const partes = p.ruta.split(".");
    let obj: any = cursor;
    for (let i = 0; i < partes.length - 1; i++) obj = obj[partes[i]];
    const clave = partes[partes.length - 1];
    if (p.tipo === "booleano") obj[clave] = false;
    else if (p.tipo === "texto") obj[clave] = "x";
    else if (p.tipo === "numero") obj[clave] = 0;
    else if (esDatoEn(obj, clave)) obj[clave] = { valor: 0, procedencia: "confirmado" };
    else obj[clave] = 0;
  }
  return n;
}

function esDatoEn(obj: unknown, clave: string): boolean {
  const v = (obj as Record<string, unknown>)[clave];
  return typeof v === "object" && v !== null && "procedencia" in v;
}

function KpiCard({ titulo, valor, detalle }: { titulo: string; valor: string; detalle: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{titulo}</p>
      <p className="mt-1 truncate text-lg font-bold text-primary">{valor}</p>
      <p className="text-[10px] text-muted-foreground">{detalle}</p>
    </div>
  );
}

export type { Pregunta };
