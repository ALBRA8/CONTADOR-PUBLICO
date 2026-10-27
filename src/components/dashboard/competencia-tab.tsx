"use client";

import {
  Check,
  X,
  Minus,
  HelpCircle,
  ExternalLink,
  TriangleAlert,
  Gem,
  Building,
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
  competitors,
  otherProviders,
  type CapStatus,
} from "@/lib/albra-data";

function CapIcon({ status, label }: { status: CapStatus; label: string }) {
  const cls =
    status === "si"
      ? "text-emerald-400"
      : status === "parcial"
        ? "text-amber-400"
        : status === "aclarar"
          ? "text-amber-300"
          : "text-rose-400";
  const size = "h-4 w-4";
  const icon =
    status === "si" ? (
      <Check className={size} strokeWidth={3} />
    ) : status === "parcial" ? (
      <Minus className={size} strokeWidth={3} />
    ) : status === "aclarar" ? (
      <HelpCircle className={size} strokeWidth={2.5} />
    ) : (
      <X className={size} strokeWidth={3} />
    );
  return (
    <span className="inline-flex items-center justify-center gap-1.5" title={label}>
      <span className={cls}>{icon}</span>
      <span className="hidden xl:inline text-[11px] text-muted-foreground">{label}</span>
    </span>
  );
}

const statusLabel: Record<CapStatus, string> = {
  si: "Sí",
  parcial: "Parcial",
  aclarar: "Aclarar",
  no: "No",
};

export function CompetenciaTab() {
  return (
    <div className="space-y-6">
      {/* Matriz de capacidades */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Matriz de capacidades — competencia colombiana</CardTitle>
          <CardDescription className="text-xs">
            Capacidades anunciadas por cada proveedor para el Formulario 210, procesamiento documental,
            IA conversacional y automatización MUISCA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Producto</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Mercado</TableHead>
                  <TableHead className="text-center text-xs uppercase tracking-wide text-muted-foreground">F210</TableHead>
                  <TableHead className="text-center text-xs uppercase tracking-wide text-muted-foreground">Docs / Exógena</TableHead>
                  <TableHead className="text-center text-xs uppercase tracking-wide text-muted-foreground">IA conversacional</TableHead>
                  <TableHead className="text-center text-xs uppercase tracking-wide text-muted-foreground">Automatización MUISCA</TableHead>
                  <TableHead className="text-right text-xs uppercase tracking-wide text-muted-foreground">Precio (COP)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors.map((c) => (
                  <TableRow key={c.id} className="border-border/70">
                    <TableCell>
                      <a
                        href={c.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
                      >
                        <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: c.color }} />
                        {c.name}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.market}</TableCell>
                    <TableCell className="text-center"><CapIcon status={c.f210} label={statusLabel[c.f210]} /></TableCell>
                    <TableCell className="text-center"><CapIcon status={c.docs} label={statusLabel[c.docs]} /></TableCell>
                    <TableCell className="text-center"><CapIcon status={c.aiChat} label={statusLabel[c.aiChat]} /></TableCell>
                    <TableCell className="text-center"><CapIcon status={c.muisca} label={statusLabel[c.muisca]} /></TableCell>
                    <TableCell className="text-right font-mono text-xs text-foreground">{c.priceRange}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-400" /> Sí / anunciado</span>
            <span className="flex items-center gap-1.5"><Minus className="h-3.5 w-3.5 text-amber-400" /> Parcial o asistido</span>
            <span className="flex items-center gap-1.5"><HelpCircle className="h-3.5 w-3.5 text-amber-300" /> Requiere aclaración contractual / técnica</span>
            <span className="flex items-center gap-1.5"><X className="h-3.5 w-3.5 text-rose-400" /> No documentado</span>
          </div>
        </CardContent>
      </Card>

      {/* Detalle por competidor */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {competitors.map((c) => (
          <Card key={c.id} className="transition-colors hover:border-cyan-500/35">
            <CardHeader className="pb-2">
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: `${c.color}22`, color: c.color }}>
                    <Building className="h-3.5 w-3.5" />
                  </span>
                  <a href={c.site} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {c.name}
                  </a>
                </span>
                <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
                  {c.priceRange} COP
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">Mercado: {c.market}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-1">
                {c.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="rounded-md border border-border/70 bg-secondary/30 p-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Planes publicados</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {c.plans.map((p) => (
                    <Badge
                      key={p.plan}
                      variant="outline"
                      className="border-border bg-background/60 text-[10px] font-normal text-foreground"
                    >
                      {p.plan}: <span className="ml-1 font-mono text-cyan-300">{p.price}</span>
                      {p.note ? <span className="ml-1 text-muted-foreground">· {p.note}</span> : null}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-md border border-amber-500/25 bg-amber-500/5 p-2.5">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                <p className="text-[11px] leading-relaxed text-amber-200/80">{c.observation}</p>
              </div>

              <div className="flex items-start gap-2 rounded-md border border-cyan-500/25 bg-cyan-500/5 p-2.5">
                <Gem className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                <p className="text-[11px] leading-relaxed text-cyan-100/80">
                  <span className="font-semibold text-cyan-300">Valor para ALBRA: </span>
                  {c.valueForAlbra}
                </p>
              </div>

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">MUISCA: </span>
                {c.muiscaNote}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Otros proveedores */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Otros proveedores colombianos por investigar</CardTitle>
          <CardDescription className="text-xs">
            No considerar equivalentes directos de un agente contador personal sin verificar su cobertura
            de F210, funciones de IA y capacidades de presentación.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {otherProviders.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:border-cyan-500/40"
            >
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary">
                {p.name}
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{p.note}</p>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
