"use client";

import {
  Brain,
  User,
  FileText,
  FolderOpen,
  Cpu,
  BookOpen,
  Lightbulb,
  ShieldCheck,
  ClipboardList,
  MousePointerClick,
  Archive,
  ArrowDown,
  Ban,
  Layers,
  ListChecks,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  mision,
  reglasInnegociables,
  capacidadesObjetivo,
  modulosChaleco,
  estadosDeclaracion,
  reglaInnegociableEstados,
  comparacionArquitectonica,
} from "@/lib/albra-data";

const moduleIcons: Record<string, LucideIcon> = {
  M1: Brain,
  M2: User,
  M3: FileText,
  M4: FolderOpen,
  M5: Cpu,
  M6: BookOpen,
  M7: Lightbulb,
  M8: ShieldCheck,
  M9: ClipboardList,
  M10: MousePointerClick,
  M11: Archive,
};

function MisionCard() {
  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-base">La metáfora arquitectónica es obligatoria</CardTitle>
        <CardDescription>
          AGENTE-GENERAL es el cuerpo; el contador es el chaleco que se pone; CloneaKit es la herramienta
          de ingeniería. El producto es un agente, no un ERP ni un programa de contabilidad.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {mision.metafora.map((m) => (
          <div key={m.rol} className="rounded-lg border border-border bg-card/60 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-semibold text-primary">{m.rol}</p>
              <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
                {m.parte}
              </Badge>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.detalle}</p>
          </div>
        ))}
        <div className="md:col-span-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3">
          <p className="text-[13px] font-semibold text-cyan-300">Prioridad inicial</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{mision.prioridad}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReglasCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ban className="h-4 w-4 text-rose-400" />
          <CardTitle className="text-base">Reglas arquitectónicas innegociables (Prompt Maestro §2)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {reglasInnegociables.map((r) => (
          <div key={r.n} className="rounded-lg border border-border bg-card/60 p-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-rose-400">§{r.n}</span>
              <p className="text-[13px] font-semibold text-foreground">{r.titulo}</p>
            </div>
            <ul className="mt-2 space-y-1.5">
              {r.puntos.map((p, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <span className="text-primary/60">▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function CapacidadesCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">
            15 capacidades objetivo del agente <span className="text-muted-foreground">(Prompt Maestro §3)</span>
          </CardTitle>
        </div>
        <CardDescription>
          El agente no se limita a responder preguntas: acompaña el procedimiento completo, de la recopilación
          a la preparación, validación y documentación del resultado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {capacidadesObjetivo.map((c, i) => (
            <li key={i} className="flex gap-2 rounded-md border border-border bg-card/50 p-2 text-xs leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

function ModulosCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">
            Los 11 módulos del chaleco <span className="text-muted-foreground">(Prompt Maestro §7)</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modulosChaleco.map((m) => {
          const Icon = moduleIcons[m.id] ?? Layers;
          return (
            <div
              key={m.id}
              className={`rounded-lg border p-3 ${
                m.destacado
                  ? "border-primary/50 bg-primary/5 shadow-[0_0_18px_-6px] shadow-primary/30"
                  : "border-border bg-card/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${m.destacado ? "text-primary" : "text-cyan-400"}`} />
                <span className="font-mono text-[10px] text-muted-foreground">{m.id}</span>
                <p className="text-[13px] font-semibold text-foreground">{m.nombre}</p>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.funcion}</p>
              <ul className="mt-2 space-y-1">
                {m.claves.map((k, i) => (
                  <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    <span className="text-primary/60">·</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function EstadosCard() {
  return (
    <Card className="border-amber-500/25">
      <CardHeader>
        <CardTitle className="text-base">
          7 estados obligatorios del procedimiento tributario <span className="text-muted-foreground">(Prompt Maestro §8)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-stretch gap-1.5">
          {estadosDeclaracion.map((e, i) => (
            <div key={e.n}>
              <div className="flex items-center gap-3 rounded-md border border-border bg-card/60 px-3 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-[11px] font-bold text-primary">
                  {e.n}
                </span>
                <Badge variant="outline" className="w-32 shrink-0 justify-center border-cyan-500/40 bg-cyan-500/10 font-mono text-[10px] text-cyan-300">
                  {e.estado}
                </Badge>
                <p className="text-xs leading-relaxed text-muted-foreground">{e.definicion}</p>
              </div>
              {i < estadosDeclaracion.length - 1 && (
                <ArrowDown className="mx-auto my-0.5 h-3 w-3 text-muted-foreground/50" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-200">
          <span className="font-semibold">Regla innegociable:</span> {reglaInnegociableEstados}
        </p>
      </CardContent>
    </Card>
  );
}

function ComparacionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparación arquitectónica — referencia por componente</CardTitle>
        <CardDescription>Del informe maestro (§10): qué referente prioritario estudiar para cada pieza.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Componente</TableHead>
              <TableHead>Referencia prioritaria</TableHead>
              <TableHead>Decisión</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparacionArquitectonica.map((row) => (
              <TableRow key={row.componente}>
                <TableCell className="text-[13px] font-medium text-foreground">{row.componente}</TableCell>
                <TableCell className="text-[13px] text-cyan-300">{row.referencia}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{row.decision}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ArquitecturaTab() {
  return (
    <div className="space-y-6">
      <MisionCard />
      <ReglasCard />
      <CapacidadesCard />
      <ModulosCard />
      <EstadosCard />
      <ComparacionCard />
    </div>
  );
}
