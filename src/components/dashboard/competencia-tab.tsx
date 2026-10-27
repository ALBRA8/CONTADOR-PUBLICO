"use client";

import {
  CheckCircle2,
  XCircle,
  CircleDashed,
  HelpCircle,
  Building2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { competitors, otrosProveedores, conclusionComercial, type CapStatus } from "@/lib/albra-data";

function CapIcon({ status, label }: { status: CapStatus; label: string }) {
  const cls =
    status === "si"
      ? "text-emerald-400"
      : status === "parcial"
        ? "text-amber-400"
        : status === "aclarar"
          ? "text-cyan-400"
          : "text-rose-400";
  const Icon =
    status === "si"
      ? CheckCircle2
      : status === "parcial"
        ? CircleDashed
        : status === "aclarar"
          ? HelpCircle
          : XCircle;
  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <Icon className={`h-4 w-4 ${cls}`} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function MatrizCapacidades() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Matriz de capacidades anunciadas</CardTitle>
        <CardDescription>
          Según las publicaciones propias de cada proveedor. «Anunciado» no equivale a «verificado».
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="hidden gap-2 border-b border-border pb-2 lg:grid lg:grid-cols-[190px_150px_70px_110px_130px_1fr]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Producto</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mercado</p>
          <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">F210</p>
          <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Docs + exógena</p>
          <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">IA conversacional</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Automatización MUISCA</p>
        </div>
        <div className="divide-y divide-border/60">
          {competitors.map((c) => (
            <div key={c.id} className="grid gap-1.5 py-3 lg:grid-cols-[190px_150px_70px_110px_130px_1fr] lg:items-center lg:gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-[13px] font-semibold text-foreground">{c.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{c.market}</p>
              <div className="flex gap-3 lg:justify-center"><CapIcon status={c.f210} label="F210" /></div>
              <div className="flex gap-3 lg:justify-center"><CapIcon status={c.docs} label="Documentos" /></div>
              <div className="flex gap-3 lg:justify-center"><CapIcon status={c.aiChat} label="IA" /></div>
              <p className="text-[11px] leading-snug text-muted-foreground">{c.muiscaNote}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CompetenciaTab() {
  return (
    <div className="space-y-6">
      <MatrizCapacidades />

      <div className="grid gap-4 lg:grid-cols-2">
        {competitors.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            <div className="h-1 w-full" style={{ backgroundColor: c.color }} />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4" style={{ color: c.color }} />
                  {c.name}
                </CardTitle>
                <a
                  href={c.site}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:underline"
                >
                  {c.site.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
                  {c.market}
                </Badge>
                <Badge variant="outline" className="border-primary/40 bg-primary/10 font-mono text-[10px] text-primary">
                  {c.priceRange} COP
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Planes publicados</p>
                <div className="mt-1.5 space-y-1">
                  {c.plans.map((p) => (
                    <div key={p.plan} className="flex flex-wrap items-baseline justify-between gap-1 rounded-md border border-border bg-secondary/30 px-2.5 py-1.5">
                      <span className="text-xs text-foreground">{p.plan}</span>
                      <span className="font-mono text-xs font-semibold text-cyan-300">{p.price}</span>
                      {p.note && <p className="w-full text-[10px] leading-snug text-muted-foreground">{p.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Funcionalidades anunciadas</p>
                <ul className="mt-1.5 space-y-1">
                  {c.highlights.map((h, i) => (
                    <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
                      <span style={{ color: c.color }}>·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-[11px] leading-relaxed text-amber-200/90">
                <span className="font-semibold">Observación:</span> {c.observation}
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Valor para ALBRA:</span> {c.valueForAlbra}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Otros proveedores colombianos por investigar</CardTitle>
          <CardDescription>
            No son equivalentes directos de un agente contador personal sin verificar su cobertura F210,
            funciones de IA y capacidades de presentación.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {otrosProveedores.map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-card/60 p-3">
              <p className="text-[13px] font-semibold text-foreground">{p.name}</p>
              <a href={p.site} target="_blank" rel="noreferrer" className="break-all font-mono text-[10px] text-cyan-400 hover:underline">
                {p.site.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/30">
        <CardContent className="p-4">
          <p className="text-[13px] leading-relaxed text-muted-foreground">{conclusionComercial}</p>
        </CardContent>
      </Card>
    </div>
  );
}
