"use client";

import {
  Github,
  ExternalLink,
  ShieldAlert,
  Star,
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Ban,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  reposColombia,
  advertenciaLicencias,
  referentesInternacionales,
  productosInternacionales,
  patronesTecnicos,
  jvzooResultado,
  type RepoCOL,
} from "@/lib/albra-data";

const nivelStyle: Record<RepoCOL["nivel"], { cls: string; Icon: typeof Star }> = {
  primero: { cls: "border-emerald-500/50 bg-emerald-500/15 text-emerald-300", Icon: Star },
  segundo: { cls: "border-cyan-500/50 bg-cyan-500/15 text-cyan-300", Icon: Star },
  secundaria: { cls: "border-slate-500/50 bg-slate-500/15 text-slate-300", Icon: CircleDashed },
  auditar: { cls: "border-amber-500/50 bg-amber-500/15 text-amber-300", Icon: AlertTriangle },
  "no-copiar": { cls: "border-rose-500/50 bg-rose-500/15 text-rose-300", Icon: Ban },
};

const licenciaStyle: Record<RepoCOL["licenciaStatus"], string> = {
  verificada: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  reportada: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  "sin-licencia": "border-rose-500/40 bg-rose-500/10 text-rose-300",
  pendiente: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

function CandidatoCard({ repo, rank }: { repo: RepoCOL; rank: number }) {
  return (
    <Card className="border-primary/40 shadow-[0_0_24px_-8px] shadow-primary/25">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 font-mono text-xs font-bold text-primary">
              #{rank}
            </span>
            {repo.name}
          </CardTitle>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 font-mono text-[10px] text-cyan-400 hover:underline"
          >
            GitHub <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <CardDescription>{repo.aporte}</CardDescription>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="outline" className={`font-mono text-[10px] ${licenciaStyle[repo.licenciaStatus]}`}>
            Licencia: {repo.licencia}
          </Badge>
          <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
            {repo.recomendacion}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs leading-relaxed text-muted-foreground">{repo.detalle}</p>
        {repo.riesgos && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5">
            <p className="text-[11px] font-semibold text-amber-300">Riesgos pendientes</p>
            <ul className="mt-1 space-y-1">
              {repo.riesgos.map((r, i) => (
                <li key={i} className="flex gap-1.5 text-[11px] leading-relaxed text-amber-200/80">
                  <span>▸</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OpensourceTab() {
  const prioritarios = reposColombia.filter((r) => r.nivel === "primero" || r.nivel === "segundo");
  const resto = reposColombia.filter((r) => r.nivel !== "primero" && r.nivel !== "segundo");

  return (
    <div className="space-y-6">
      <Card className="border-amber-500/40 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-[13px] leading-relaxed text-amber-200/90">{advertenciaLicencias}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {prioritarios.map((r, i) => (
          <CandidatoCard key={r.name} repo={r} rank={i + 1} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Matriz de decisión de los 8 repositorios colombianos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden gap-2 border-b border-border pb-2 md:grid md:grid-cols-[220px_1fr_130px_260px]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Proyecto</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Principal aporte</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Licencia</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recomendación</p>
          </div>
          <div className="divide-y divide-border/60">
            {reposColombia.map((r) => {
              const st = nivelStyle[r.nivel];
              const Icon = st.Icon;
              return (
                <div
                  key={r.name}
                  className="grid gap-1.5 py-2.5 md:grid-cols-[220px_1fr_130px_260px] md:items-center md:gap-2"
                >
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-words text-[13px] font-medium text-cyan-300 hover:underline"
                  >
                    {r.name}
                  </a>
                  <p className="text-xs leading-relaxed text-muted-foreground">{r.aporte}</p>
                  <div>
                    <Badge variant="outline" className={`font-mono text-[10px] ${licenciaStyle[r.licenciaStatus]}`}>
                      {r.licencia}
                    </Badge>
                  </div>
                  <div>
                    <Badge variant="outline" className={`gap-1 whitespace-normal text-[10px] leading-tight ${st.cls}`}>
                      <Icon className="h-3 w-3 shrink-0" />
                      {r.recomendacion}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Referentes internacionales — patrón arquitectónico, nunca reglas fiscales</CardTitle>
          </div>
          <CardDescription>
            No se trasladan reglas de EE. UU., Reino Unido, India, España, Australia ni Brasil a Colombia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {referentesInternacionales.map((r) => (
              <div key={r.name} className="rounded-lg border border-border bg-card/60 p-3">
                <a href={r.url} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-cyan-300 hover:underline">
                  {r.name}
                </a>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.uso}</p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <p className="mb-2 text-[13px] font-semibold text-foreground">Productos comerciales internacionales (referencia de mercado)</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {productosInternacionales.map((p) => (
              <div key={p.name} className="rounded-md border border-border bg-secondary/30 p-2.5">
                <a href={p.site} target="_blank" rel="noreferrer" className="text-xs font-semibold text-foreground hover:text-cyan-300 hover:underline">
                  {p.name}
                </a>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{p.valor}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Patrones técnicos que conviene estudiar</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-1.5 sm:grid-cols-2">
              {patronesTecnicos.map((p, i) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-base">Marketplace JVZoo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-muted-foreground">{jvzooResultado}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
