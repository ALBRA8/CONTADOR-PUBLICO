"use client";

import {
  Lock,
  Scale,
  Target,
  Landmark,
  CircleAlert,
  CheckCircle2,
  Rocket,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { riskBlocks, dianPrinciples, dianAlert, officialSources, phases, acceptanceCriteria, nextStep } from "@/lib/albra-data";

const riskIcons: Record<string, LucideIcon> = {
  lock: Lock,
  scale: Scale,
  target: Target,
};

export function RiesgosPlanTab() {
  return (
    <div className="space-y-6">
      {/* Bloques de riesgo */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {riskBlocks.map((b) => {
          const Icon = riskIcons[b.icon] ?? Target;
          return (
            <Card key={b.title} style={{ borderColor: `${b.color}44` }}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm" style={{ color: b.color }}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: `${b.color}1f` }}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {b.title.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {b.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/85">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fuentes oficiales DIAN */}
      <Card className="border-cyan-500/25">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Landmark className="h-4 w-4 text-cyan-400" />
            Fuentes oficiales DIAN — base de todo motor tributario
          </CardTitle>
          <CardDescription className="text-xs">
            Principios obligatorios para cualquier procedimiento de declaración.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ul className="space-y-2">
            {dianPrinciples.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-500/15 font-mono text-[10px] text-cyan-300">
                  {i + 1}
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            {officialSources.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-md border border-border/70 bg-secondary/20 px-3 py-2 text-xs text-foreground transition-colors hover:border-cyan-500/40 hover:text-primary"
              >
                <span className="min-w-0 truncate">{s.name}</span>
                <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerta API DIAN */}
      <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
        <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
        <p className="text-sm leading-relaxed text-rose-200/90">{dianAlert}</p>
      </div>

      {/* Timeline de fases */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Plan de ejecución recomendado — 7 fases</CardTitle>
          <CardDescription className="text-xs">
            Progresión verificable: el alcance primero, la auditoría del motor antes de cualquier integración.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="relative space-y-0 border-l border-border/80 pl-0">
            {phases.map((p) => (
              <li key={p.n} className="relative flex gap-4 pb-5 last:pb-0">
                <span className="absolute -left-[13px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-primary/50 bg-[#0f1629] font-mono text-[10px] font-bold text-primary">
                  {p.n}
                </span>
                <div className="ml-6 flex-1 rounded-lg border border-border bg-secondary/30 p-3.5 transition-colors hover:border-primary/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <Badge variant="outline" className="border-primary/30 bg-primary/5 px-1.5 py-0 text-[10px] font-normal text-primary">
                      → {p.output}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Criterios de aceptación */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Criterios de aceptación del proyecto</CardTitle>
          <CardDescription className="text-xs">
            El proyecto no se considera terminado por tener carpetas, README o un agente que responde
            preguntas generales: cada criterio exige evidencia. Un criterio sin evidencia se reporta como
            pendiente, no como aprobado.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {acceptanceCriteria.map((g) => (
            <div key={g.group} className="rounded-lg border border-border bg-secondary/30 p-4">
              <p className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-300">
                {g.group}
              </p>
              <ul className="space-y-2.5">
                {g.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Checkbox checked className="mt-0.5 h-3.5 w-3.5 border-primary/60 bg-primary/20" aria-label={item} tabIndex={-1} />
                    <span className="text-xs leading-relaxed text-foreground/85">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Próximo paso */}
      <Card className="albra-glow border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Rocket className="h-4 w-4 text-primary" />
            PRÓXIMO PASO RECOMENDADO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm leading-relaxed text-foreground/90">
            <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-primary" />
            {nextStep}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
