"use client";

import {
  ListOrdered,
  ClipboardCheck,
  Ban,
  ShieldCheck,
  Scale,
  FileOutput,
  Landmark,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  fasesPlan,
  criteriosAceptacion,
  reglaCriterios,
  reglasEjecucion,
  controlesSeguridad,
  prohibicionesProfesionales,
  procesoLicencias,
  reglasLicencias,
  informeFinal,
  fuentesDian,
  principiosDian,
  alertaApiDian,
  riesgosBloques,
  decisionFinal,
} from "@/lib/albra-data";

function FasesCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListOrdered className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">
            Plan de construcción por fases <span className="text-muted-foreground">(Prompt Maestro §11 — progresivo y verificable)</span>
          </CardTitle>
        </div>
        <CardDescription>
          «No detenerse después de entregar una arquitectura teórica»: cada fase produce un resultado concreto.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {fasesPlan.map((f) => (
          <div key={f.id} className="rounded-lg border border-border bg-card/60 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 font-mono text-[11px] font-bold text-primary">
                {f.id}
              </Badge>
              <p className="text-[14px] font-semibold text-foreground">{f.nombre}</p>
              <span className="text-xs text-muted-foreground">— {f.objetivo}</span>
            </div>
            <ul className="mt-2 grid gap-1 md:grid-cols-2">
              {f.pasos.map((p, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <span className="text-primary/60">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 rounded-md border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-1.5 text-[11px] leading-relaxed text-cyan-200/90">
              <span className="font-semibold">Resultado:</span> {f.resultado}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CriteriosCard() {
  return (
    <Card className="border-amber-500/25">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-amber-400" />
          <CardTitle className="text-base">
            23 criterios de aceptación <span className="text-muted-foreground">(Prompt Maestro §12)</span>
          </CardTitle>
        </div>
        <CardDescription className="leading-relaxed">{reglaCriterios}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {criteriosAceptacion.map((b) => (
          <div key={b.bloque} className="rounded-lg border border-border bg-card/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-foreground">{b.bloque}</p>
              <span className="font-mono text-[10px] text-muted-foreground">{b.items.length} ítems</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {b.items.map((item, i) => (
                <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  <span className="mt-0.5 block h-3 w-3 shrink-0 rounded-sm border border-muted-foreground/40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ReglasEjecucionCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ban className="h-4 w-4 text-rose-400" />
          <CardTitle className="text-base">Reglas de ejecución para el constructor (Prompt Maestro §13)</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-1.5 md:grid-cols-2">
          {reglasEjecucion.map((r, i) => (
            <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
              <span className="text-rose-400">✕</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SeguridadCard() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-base">Controles de seguridad requeridos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5">
            {controlesSeguridad.map((c, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="border-rose-500/25">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <CardTitle className="text-base">Responsabilidad profesional — prohibiciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5">
            {prohibicionesProfesionales.map((p, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                <span className="text-rose-400">▸</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function LicenciasCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Proceso obligatorio antes de incorporar código externo (Prompt Maestro §10)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ol className="grid gap-1.5 md:grid-cols-2">
          {procesoLicencias.map((p, i) => (
            <li key={i} className="flex gap-2 rounded-md border border-border bg-card/50 p-2 text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] font-bold text-primary">{i + 1}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
        <p className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5 text-[11px] leading-relaxed text-amber-200/90">
          {reglasLicencias}
        </p>
      </CardContent>
    </Card>
  );
}

function InformeFinalCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileOutput className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">
            Informe final obligatorio — 14 secciones <span className="text-muted-foreground">(Prompt Maestro §14)</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-1.5 sm:grid-cols-2">
          {informeFinal.map((s, i) => (
            <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] font-semibold text-cyan-400">{String(i + 1).padStart(2, "0")}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function FuentesDianCard() {
  return (
    <Card className="border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-cyan-400" />
          <CardTitle className="text-base">Fuentes oficiales DIAN — base de cualquier motor tributario</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-1.5 sm:grid-cols-2">
          {fuentesDian.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-2 rounded-md border border-border bg-card/50 px-2.5 py-1.5 text-xs text-foreground transition-colors hover:border-cyan-500/40"
            >
              <span>{f.name}</span>
              <ExternalLink className="h-3 w-3 shrink-0 text-cyan-400" />
            </a>
          ))}
        </div>
        <Separator />
        <div>
          <p className="mb-1.5 text-[13px] font-semibold text-foreground">Principios del procedimiento oficial</p>
          <ul className="grid gap-1 md:grid-cols-2">
            {principiosDian.map((p, i) => (
              <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                <span className="text-cyan-400">▸</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-200">
          <span className="font-semibold">Alerta:</span> {alertaApiDian}
        </p>
      </CardContent>
    </Card>
  );
}

function RiesgosCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <CardTitle className="text-base">Riesgos legales, fiscales y de seguridad (Informe Maestro §13)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {riesgosBloques.map((r) => (
          <div key={r.titulo} className="rounded-lg border border-border bg-card/60 p-3">
            <p className="text-[13px] font-semibold text-foreground">{r.titulo}</p>
            <ul className="mt-2 space-y-1.5">
              {r.items.map((item, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <span className="text-amber-400">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PlanTab() {
  return (
    <div className="space-y-6">
      <FasesCard />
      <CriteriosCard />
      <ReglasEjecucionCard />
      <SeguridadCard />
      <LicenciasCard />
      <InformeFinalCard />
      <FuentesDianCard />
      <RiesgosCard />
      <Card className="border-primary/40 shadow-[0_0_24px_-8px] shadow-primary/25">
        <CardContent className="flex items-start gap-3 p-4">
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-[13px] font-semibold text-foreground">Próximo paso</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{decisionFinal.proximoPaso}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
