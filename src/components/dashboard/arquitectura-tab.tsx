"use client";

import {
  Brain,
  User,
  FileText,
  FolderOpen,
  Cpu,
  BookOpen,
  Sparkles,
  ShieldAlert,
  ClipboardList,
  Hand,
  Fingerprint,
  ArrowRight,
  ArrowDown,
  Scale,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  corePrinciple,
  albraModules,
  declarationStates,
  ironRule,
  architectureComparison,
  scopeFlow,
} from "@/lib/albra-data";

const moduleIcons: Record<string, LucideIcon> = {
  brain: Brain,
  user: User,
  file: FileText,
  folder: FolderOpen,
  cpu: Cpu,
  book: BookOpen,
  sparkles: Sparkles,
  "shield-alert": ShieldAlert,
  clipboard: ClipboardList,
  hand: Hand,
  fingerprint: Fingerprint,
};

const toneRow: Record<string, string> = {
  green: "text-emerald-300",
  cyan: "text-cyan-300",
  amber: "text-amber-300",
};

export function ArquitecturaTab() {
  const { agent, engine, rationale } = corePrinciple;

  return (
    <div className="space-y-6">
      {/* Principio rector: agente ≠ motor */}
      <Card className="border-cyan-500/25 albra-glow-cyan">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Scale className="h-4 w-4 text-cyan-400" />
            PRINCIPIO RECTOR — el agente y el motor son piezas diferentes
          </CardTitle>
          <CardDescription className="text-xs">{rationale}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
            {/* Agente */}
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
              <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-wide" style={{ color: agent.color }}>
                <Brain className="h-4 w-4" />
                {agent.title}
              </p>
              <ul className="mt-3 space-y-2">
                {agent.points.map((p, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-xs leading-relaxed ${
                      i === agent.points.length - 1 ? "font-semibold text-rose-300" : "text-foreground/85"
                    }`}
                  >
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" style={{ color: agent.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Conector */}
            <div className="flex flex-row items-center justify-center gap-2 lg:flex-col">
              <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                Contratos
                <br className="hidden lg:block" /> verificables
              </span>
              <ArrowDown className="h-4 w-4 rotate-90 text-primary lg:rotate-0" />
              <span className="rounded-full border border-border bg-secondary px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Evidencia
                <br className="hidden lg:block" /> por operación
              </span>
            </div>

            {/* Motor */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="flex items-center gap-2 font-mono text-xs font-bold tracking-wide" style={{ color: engine.color }}>
                <Cpu className="h-4 w-4" />
                {engine.title}
              </p>
              <ul className="mt-3 space-y-2">
                {engine.points.map((p, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-xs leading-relaxed ${
                      i === engine.points.length - 1 ? "font-semibold text-primary" : "text-foreground/85"
                    }`}
                  >
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" style={{ color: engine.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alcance del flujo prioritario */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Compass className="h-4 w-4 text-primary" />
            Alcance prioritario — demostrar un flujo colombiano realista antes de expandir
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {scopeFlow.map((s) => (
            <div key={s.step} className="rounded-lg border border-border bg-secondary/30 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/40 bg-primary/10 font-mono text-xs font-bold text-primary">
                {s.step}
              </span>
              <p className="mt-2.5 text-sm font-semibold text-foreground">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 11 módulos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Los 11 módulos del chaleco contable</CardTitle>
          <CardDescription className="text-xs">
            Componentes especializados que AGENTE-GENERAL se pone cuando actúa como contador público;
            sin convertirlos en la identidad del agente central.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {albraModules.map((m) => {
            const Icon = moduleIcons[m.icon] ?? Brain;
            const isEngine = m.n === 5;
            return (
              <div
                key={m.n}
                className={`group rounded-lg border p-4 transition-colors ${
                  isEngine
                    ? "border-primary/35 bg-primary/5 hover:border-primary/60"
                    : "border-border bg-secondary/30 hover:border-cyan-500/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                      isEngine ? "bg-primary/15 text-primary" : "bg-cyan-500/10 text-cyan-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold leading-tight text-foreground">
                    <span className="font-mono text-[10px] text-muted-foreground">M{String(m.n).padStart(2, "0")} · </span>
                    {m.name}
                  </p>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {m.key.map((k) => (
                    <Badge key={k} variant="outline" className="border-border/80 bg-background/40 px-1.5 py-0 text-[10px] font-normal text-muted-foreground">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Estados de la declaración */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ciclo de vida obligatorio de una declaración</CardTitle>
          <CardDescription className="text-xs">
            Cada transición exige requisitos y evidencia; ningún modelo de lenguaje cambia un estado por
            conveniencia narrativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-stretch gap-1.5 md:flex-row md:items-center md:gap-0 md:overflow-x-auto md:pb-1">
            {declarationStates.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center gap-1.5 md:contents">
                <div
                  className="flex-1 rounded-lg border bg-secondary/40 p-3 md:min-w-[124px]"
                  style={{ borderColor: `${s.color}55` }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px]" style={{ color: s.color }}>
                      {String(s.n).padStart(2, "0")}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                  </div>
                  <p className="mt-1 text-[11px] font-bold leading-tight md:text-xs" style={{ color: s.color }}>
                    {s.name}
                  </p>
                  <p className="mt-1 hidden text-[10px] leading-snug text-muted-foreground lg:block">{s.desc}</p>
                </div>
                {i < declarationStates.length - 1 && (
                  <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground md:block" />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <p className="text-sm font-semibold leading-relaxed text-rose-200">
              Regla innegociable: <span className="font-normal">{ironRule}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Comparación arquitectónica */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Comparación arquitectónica — referente por componente</CardTitle>
          <CardDescription className="text-xs">
            Para cada componente del chaleco, el referente prioritario identificado en la investigación y
            la decisión correspondiente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Componente</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Referente prioritario</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Decisión</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {architectureComparison.map((row) => (
                  <TableRow key={row.component} className="border-border/70">
                    <TableCell className="text-sm font-medium text-foreground">{row.component}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-cyan-500/30 bg-cyan-500/10 text-[11px] font-normal text-cyan-300">
                        {row.reference}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-xs font-medium ${toneRow[row.tone]}`}>{row.decision}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
