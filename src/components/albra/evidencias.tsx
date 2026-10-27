"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Download,
  FileCheck2,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  ESTADOS,
  EstadoProcedimiento,
  Expediente,
  REGLA_INNEGOCIABLE,
} from "@/lib/albra/tipos";
import { ResultadoLiquidacion, fmt } from "@/lib/albra/motor";
import { descargarTexto, hojaDigitacion, hojaDigitacionCsv, memoriaJson } from "@/lib/albra/exportar";

interface Props {
  estado: EstadoProcedimiento;
  resultado: ResultadoLiquidacion;
  expediente: Expediente;
  puedeValidar: boolean;
  aprobacionHumanos: boolean;
  onAprobacion: (v: boolean) => void;
  onAvanzar: (destino: EstadoProcedimiento, requisitosOk: boolean, mensajeRequisito: string) => void;
  onRegresar: (estado: EstadoProcedimiento) => void;
}

function BotonExportar({ titulo, detalle, onClick }: { titulo: string; detalle: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-border bg-card/60 p-3 text-left transition-colors hover:border-primary/40"
    >
      <Download className="h-4 w-4 shrink-0 text-cyan-400" />
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-medium text-foreground">{titulo}</p>
        <p className="text-[10px] text-muted-foreground">{detalle}</p>
      </div>
      <span className="shrink-0 font-mono text-[10px] text-primary">DESCARGAR</span>
    </button>
  );
}

export function VistaEvidencias({
  estado,
  resultado,
  expediente,
  puedeValidar,
  aprobacionHumanos,
  onAprobacion,
  onAvanzar,
  onRegresar,
}: Props) {
  const indice = ESTADOS.findIndex((e) => e.id === estado);
  const [comprobanteUrl, setComprobanteUrl] = useState("");
  const nFilas = hojaDigitacion(resultado).length;

  // Transiciones con requisitos reales (cada paso exige su evidencia)
  const irAPreparado = () => onAvanzar("PREPARADO", true, "");
  const irAValidado = () =>
    onAvanzar(
      "VALIDADO",
      estado === "PREPARADO" && puedeValidar && resultado.alertas.length === 0,
      estado !== "PREPARADO"
        ? "Primero genera el borrador (estado PREPARADO)."
        : !puedeValidar
          ? `Faltan ${resultado.pendientes.length} dato(s) por responder. La validación exige cero pendientes.`
          : "Hay hallazgos del auditor sin resolver: revísalos en la parte superior antes de validar.",
    );
  const irAAprobado = () =>
    onAvanzar(
      "APROBADO",
      estado === "VALIDADO" && aprobacionHumanos,
      estado !== "VALIDADO"
        ? "El estado debe ser VALIDADO antes de la aprobación humana."
        : "Debes revisar el borrador completo y activar la aprobación explícita al final de esta página.",
    );
  const irADiligenciado = () =>
    onAvanzar(
      "DILIGENCIADO",
      estado === "APROBADO",
      "El estado debe ser APROBADO antes de registrar el diligenciamiento en MUISCA.",
    );
  const irAPresentado = () =>
    onAvanzar(
      "PRESENTADO",
      estado === "DILIGENCIADO" && comprobanteUrl.trim().length > 0,
      estado !== "DILIGENCIADO"
        ? "El estado debe ser DILIGENCIADO antes de registrar la presentación."
        : "Pega el número/radicado del comprobante de presentación oficial: una pantalla de confirmación no sustituye el comprobante.",
    );
  const irASoportado = () =>
    onAvanzar("SOPORTADO", estado === "PRESENTADO", "El estado debe ser PRESENTADO antes de archivar soportes.");

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      {/* Ciclo de estados */}
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Estados del procedimiento — cada transición exige su requisito</CardTitle>
            </div>
            <CardDescription>
              El estado real nunca se salta por conveniencia narrativa: un borrador no es una declaración presentada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {ESTADOS.map((e, i) => {
              const actual = i === indice;
              const pasado = i < indice;
              const desbloqueado = i === indice + 1;
              return (
                <div
                  key={e.id}
                  className={`rounded-lg border p-3 ${
                    actual ? "border-primary/50 bg-primary/5" : pasado ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card/40 opacity-70"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {pasado ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : desbloqueado ? <Unlock className="h-4 w-4 text-amber-400" /> : <Lock className="h-4 w-4 text-muted-foreground/40" />}
                      <p className="text-[13px] font-semibold text-foreground">
                        {i + 1}. {e.titulo}
                        <span className="ml-2 font-mono text-[10px] text-muted-foreground">{e.id}</span>
                      </p>
                    </div>
                    {actual && <Badge className="border-primary/50 bg-primary/15 text-[10px] text-primary">ESTADO ACTUAL</Badge>}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{e.descripcion}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Siguiente transición</CardTitle>
            <CardDescription>El botón exige el requisito de la transición; si falta, explica qué falta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {estado === "INCOMPLETO" && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                Completa la entrevista para generar el borrador. El estado pasa a <b>PREPARADO</b> automáticamente al liquidar.
              </p>
            )}
            {(estado === "INCOMPLETO" || estado === "PREPARADO") && (
              <div className="flex flex-wrap gap-2">
                {estado === "INCOMPLETO" && (
                  <Button size="sm" variant="outline" className="text-xs" onClick={irAPreparado}>
                    Registrar borrador generado (PREPARADO)
                  </Button>
                )}
                <Button size="sm" className="gap-1.5 text-xs" onClick={irAValidado}>
                  <ShieldCheck className="h-3.5 w-3.5" /> Validar comprobaciones (VALIDADO)
                </Button>
              </div>
            )}
            {estado === "VALIDADO" && (
              <Button size="sm" className="gap-1.5 text-xs" onClick={irAAprobado}>
                Registrar aprobación humana (APROBADO)
              </Button>
            )}
            {estado === "APROBADO" && (
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Diligencia el formulario en MUISCA con la hoja de digitación. El sistema NO diligencia ni presenta: ese paso
                  es del declarante con su clave DIAN (no existe API pública de presentación para personas naturales).
                </p>
                <div className="flex flex-wrap gap-2">
                  <a href="https://muisca.dian.gov.co/WebDilIngresoFormRenta210/" target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" /> Abrir MUISCA — F210
                    </Button>
                  </a>
                  <Button size="sm" className="text-xs" onClick={irADiligenciado}>
                    Ya diligencié en MUISCA (DILIGENCIADO)
                  </Button>
                </div>
              </div>
            )}
            {estado === "DILIGENCIADO" && (
              <div className="space-y-2">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  La presentación requiere evidencia verificable: el número o archivo del comprobante oficial.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={comprobanteUrl}
                    onChange={(e) => setComprobanteUrl(e.target.value)}
                    placeholder="Número del comprobante / radicado DIAN"
                    className="h-8 w-full rounded-md border border-border bg-secondary/40 px-2 font-mono text-xs"
                  />
                  <Button size="sm" className="shrink-0 text-xs" onClick={irAPresentado}>
                    Registrar presentación (PRESENTADO)
                  </Button>
                </div>
              </div>
            )}
            {estado === "PRESENTADO" && (
              <Button size="sm" className="text-xs" onClick={irASoportado}>
                Comprobante archivado en el expediente (SOPORTADO)
              </Button>
            )}
            {estado === "SOPORTADO" && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p className="text-xs leading-relaxed text-emerald-200">
                  Procedimiento completo: borrador validado, aprobado por el contribuyente, diligenciado, presentado y
                  soportado. Conserva el expediente JSON y la memoria de cálculo como evidencia.
                </p>
              </div>
            )}
            {indice > 0 && (
              <>
                <Separator className="my-2" />
                <Button size="sm" variant="ghost" className="text-[10px] text-muted-foreground" onClick={() => onRegresar(ESTADOS[indice - 1].id)}>
                  ← Regresar al estado anterior (corrección)
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evidencias y exportaciones */}
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-base">Exportaciones de evidencia</CardTitle>
            </div>
            <CardDescription>Cada archivo es una evidencia del procedimiento, con advertencia de que NO es una declaración presentada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <BotonExportar titulo="Hoja de digitación (CSV)" detalle={`${nFilas} casillas en orden de captura para MUISCA`} onClick={() => descargarTexto("hoja-digitacion-f210-albra.csv", hojaDigitacionCsv(resultado), "text/csv")} />
            <BotonExportar titulo="Memoria de cálculo + expediente (JSON)" detalle={`${resultado.memoria.length} pasos trazables con norma citada`} onClick={() => descargarTexto("memoria-calculo-f210-albra.json", memoriaJson(resultado, expediente, estado), "application/json")} />
            <BotonExportar titulo="Expediente del declarante (JSON)" detalle="Datos con procedencia, para portar a otro dispositivo" onClick={() => descargarTexto("expediente-albra.json", JSON.stringify(expediente, null, 2), "application/json")} />
          </CardContent>
        </Card>

        <Card className="border-amber-500/25">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-base">Aprobación humana explícita</CardTitle>
            </div>
            <CardDescription>
              Requisito para pasar a APROBADO: el contribuyente revisó el borrador, la memoria y las alertas, y autoriza usarlo para diligenciar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-border bg-card/60 p-3">
              <div>
                <p className="text-xs font-medium text-foreground">Revisé el borrador completo y lo apruebo</p>
                <p className="text-[10px] text-muted-foreground">La responsabilidad de la declaración es del contribuyente (arts. 571 y 746 ET).</p>
              </div>
              <Switch checked={aprobacionHumanos} onCheckedChange={onAprobacion} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-base">Datos pendientes ({resultado.pendientes.length})</CardTitle>
            </div>
            <CardDescription>El motor nunca rellena con ceros: cada dato faltante queda registrado aquí.</CardDescription>
          </CardHeader>
          <CardContent>
            {resultado.pendientes.length === 0 ? (
              <p className="flex items-center gap-1.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> Sin pendientes: el expediente está completo para el alcance v1.
              </p>
            ) : (
              <ul className="max-h-40 space-y-1 overflow-y-auto">
                {resultado.pendientes.map((p, i) => (
                  <li key={i} className="text-[11px] leading-relaxed text-muted-foreground">
                    <span className="mr-1.5 text-amber-400">▸</span>
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <p className="rounded-lg border border-border bg-secondary/20 p-3 text-[10px] leading-relaxed text-muted-foreground">
          {REGLA_INNEGOCIABLE}
        </p>
      </div>
    </div>
  );
}
