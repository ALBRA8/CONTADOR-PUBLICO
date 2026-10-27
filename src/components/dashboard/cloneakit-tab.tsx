"use client";

import {
  Wrench,
  Terminal,
  ShieldCheck,
  FolderTree,
  UtensilsCrossed,
  GraduationCap,
  Workflow,
  Info,
  FileSearch,
  Camera,
  Play,
  CheckCircle2,
  Presentation,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  cloneakitFicha,
  cloneakitHerramientas,
  cloneakitComandos,
  metodoSalaLimpia,
  cloneakitRecetas,
  cloneakitFormacion,
  cloneakitUsoAlbra,
  cloneakitLimites,
} from "@/lib/albra-data";

const herramientaIcons = [FileSearch, Camera, Play, CheckCircle2, Presentation];

function FichaCard() {
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-base">
          Qué es CloneaKit <span className="text-muted-foreground">— analizado desde el zip real (v{cloneakitFicha.version})</span>
        </CardTitle>
        <CardDescription className="leading-relaxed">{cloneakitFicha.esencia}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Motor de investigación</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{cloneakitFicha.motorInvestigacion}</p>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Licencia y origen</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{cloneakitFicha.licencia}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cloneakitFicha.origen}</p>
          </div>
        </div>
        <p className="rounded-md border border-border bg-secondary/40 p-2.5 font-mono text-[11px] leading-relaxed text-cyan-300">
          Requisitos: {cloneakitFicha.requisitos}
        </p>
        <Separator />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Por qué importa para ALBRA:</span> el Prompt Maestro
          (§4) exige usar CloneaKit antes de programar funcionalidades nuevas — para investigar referentes,
          hacer ingeniería inversa funcional y alimentar la matriz de aprovechamiento. Este tab documenta el
          kit real, no una suposición.
        </p>
      </CardContent>
    </Card>
  );
}

function HerramientasCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Las 5 herramientas reales del kit (herramientas/*.mjs)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {cloneakitHerramientas.map((h, i) => {
          const Icon = herramientaIcons[i] ?? Wrench;
          return (
            <div key={h.script} className="flex gap-3 rounded-lg border border-border bg-card/60 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="break-words font-mono text-[12px] font-semibold text-cyan-300">{h.comando}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">{h.script}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{h.queHace}</p>
              </div>
            </div>
          );
        })}
        <div className="rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <p className="text-[13px] font-semibold text-foreground">Comandos de Claude Code del kit</p>
          </div>
          <div className="mt-2 grid gap-1.5">
            {cloneakitComandos.map((c) => (
              <div key={c.cmd} className="flex flex-wrap items-baseline gap-2 text-xs">
                <span className="font-mono font-semibold text-primary">{c.cmd}</span>
                <span className="text-muted-foreground">{c.hace}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SalaLimpiaCard() {
  return (
    <Card className="border-emerald-500/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <CardTitle className="text-base">Método de sala limpia — lo que ALBRA adopta tal cual</CardTitle>
        </div>
        <CardDescription className="leading-relaxed">{metodoSalaLimpia.principio}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-cyan-400" />
            <p className="text-[13px] font-semibold text-foreground">Estructura de un clon</p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {metodoSalaLimpia.estructura.map((e) => (
              <div key={e.carpeta} className="rounded-md border border-border bg-card/60 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="break-all font-mono text-[11px] text-cyan-300">{e.carpeta}</p>
                  <Badge
                    variant="outline"
                    className={`shrink-0 text-[9px] font-mono ${
                      e.sePublica
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    {e.sePublica ? "SE PUBLICA" : "NO SE PUBLICA"}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{e.contenido}</p>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <p className="mb-2 text-[13px] font-semibold text-foreground">Reglas legales que el kit nunca salta</p>
          <ul className="grid gap-1.5 md:grid-cols-2">
            {metodoSalaLimpia.reglas.map((r, i) => (
              <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function RecetasCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Las 9 recetas del catálogo (cada una con demo construida)</CardTitle>
        </div>
        <CardDescription>
          Recetas = fichas listas para clonar, inspiradas en apps de negocio. Sirven de modelo de cómo queda
          una buena FICHA.md — como la que ALBRA escribirá por cada referente.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cloneakitRecetas.map((r) => (
          <div key={r.nombre} className="rounded-lg border border-border bg-card/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-foreground">{r.nombre}</p>
              <span className="font-mono text-[11px] text-amber-400">{"★".repeat(r.dificultad)}</span>
            </div>
            <p className="mt-0.5 text-[11px] text-cyan-300">Inspirada en {r.inspirada}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.nota}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function UsoAlbraCard() {
  return (
    <Card className="border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-cyan-400" />
          <CardTitle className="text-base">
            Cómo se usará en ALBRA — mapeo de las Fases A–D del Prompt Maestro (§4) a herramientas reales
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {cloneakitUsoAlbra.map((f) => (
          <div key={f.fase} className="rounded-lg border border-border bg-card/60 p-3">
            <p className="text-[13px] font-semibold text-primary">{f.fase}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Cómo:</span> {f.como}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Aporta:</span> {f.aporta}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function LimitesCard() {
  return (
    <Card className="border-amber-500/25">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-amber-400" />
          <CardTitle className="text-base">Límites honestos de CloneaKit en este proyecto</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {cloneakitLimites.map((l, i) => (
            <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
              <span className="text-amber-400">▸</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
        <Separator className="my-3" />
        <div className="flex items-start gap-2">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Formación incluida en el kit:</span>{" "}
            {cloneakitFormacion.join(" · ")}. La lección «02 · Lo legal» y el AVISO-LEGAL.md son la base del
            criterio de reutilización que ALBRA aplica a los referentes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CloneakitTab() {
  return (
    <div className="space-y-6">
      <FichaCard />
      <div className="grid gap-6 lg:grid-cols-2">
        <HerramientasCard />
        <SalaLimpiaCard />
      </div>
      <RecetasCard />
      <UsoAlbraCard />
      <LimitesCard />
    </div>
  );
}
