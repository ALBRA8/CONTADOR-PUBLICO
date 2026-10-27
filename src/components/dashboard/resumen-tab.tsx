"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";
import { AlertTriangle, CheckCircle2, CircleDashed, Quote, Target, Compass, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  realidadDelProyecto,
  mision,
  competitors,
  solutionCategories,
  pilares,
  decisionFinal,
} from "@/lib/albra-data";

// ---------------------------------------------------------------------------
// Panel de estado real: ¿ya es un contador operativo o solo es un plan?
// ---------------------------------------------------------------------------
const estadoStyles: Record<string, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  existe: { label: "EXISTE", cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300", Icon: CheckCircle2 },
  parcial: { label: "PARCIAL", cls: "border-amber-500/40 bg-amber-500/10 text-amber-300", Icon: CircleDashed },
  "no-existe": { label: "NO EXISTE", cls: "border-rose-500/40 bg-rose-500/10 text-rose-300", Icon: AlertTriangle },
};

function EstadoRealPanel() {
  return (
    <Card className="border-amber-500/30">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-amber-500/40 bg-amber-500/10">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-base text-amber-300">
              Estado real del proyecto — ¿ya es un contador operativo?
            </CardTitle>
            <CardDescription className="mt-1 text-[13px] leading-relaxed text-amber-200/80">
              {realidadDelProyecto.veredicto}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="rounded-md border border-border bg-secondary/40 p-3 text-[13px] leading-relaxed text-muted-foreground">
          {realidadDelProyecto.explicacion}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {realidadDelProyecto.items.map((item) => {
            const st = estadoStyles[item.estado];
            const Icon = st.Icon;
            return (
              <div key={item.titulo} className="rounded-lg border border-border bg-card/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-foreground">{item.titulo}</p>
                  <Badge variant="outline" className={`shrink-0 gap-1 font-mono text-[10px] ${st.cls}`}>
                    <Icon className="h-3 w-3" />
                    {st.label}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.detalle}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Comparador de precios (planes con valor COP verificable)
// ---------------------------------------------------------------------------
function parsePrice(raw: string): number | null {
  if (/gratis/i.test(raw)) return 0;
  if (!raw.includes("$")) return null; // descarta textos como «7 días»
  const m = raw.replace(/[^\d]/g, "");
  if (!m) return null;
  return Number(m);
}

function PriceTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value ?? 0;
  return (
    <div className="rounded-md border border-primary/40 bg-[#0a0e1a]/95 px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="font-mono text-primary">
        ${v.toLocaleString("es-CO")} COP
      </p>
    </div>
  );
}

function ComparadorPrecios() {
  const points: { name: string; value: number; color: string; note?: string }[] = [];
  for (const c of competitors) {
    for (const p of c.plans) {
      const value = parsePrice(p.price);
      if (value !== null) points.push({ name: `${c.name} · ${p.plan}`, value, color: c.color, note: p.note });
    }
  }
  const valid = points.filter((p) => p.value > 0);
  const min = Math.min(...valid.map((p) => p.value));
  const max = Math.max(...valid.map((p) => p.value));
  const sorted = [...valid].sort((a, b) => a.value - b.value);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)].value : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparador de precios · planes F210 en COP</CardTitle>
        <CardDescription>
          {points.length} planes publicados por los 6 competidores. Valores según sus propias páginas
          (temporada 2025–2026): confirmar antes de una comparación comercial definitiva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <XAxis
                type="number"
                tickFormatter={(v: number) => `$${Math.round(v / 1000)}K`}
                stroke="#64748b"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={190}
                stroke="#94a3b8"
                fontSize={10.5}
                tickLine={false}
              />
              <Tooltip content={<PriceTooltip />} cursor={{ fill: "rgba(0,230,118,0.06)" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {points.map((p, i) => (
                  <Cell key={i} fill={p.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
          {[
            { k: "Mínimo", v: min },
            { k: "Mediana", v: median },
            { k: "Máximo", v: max },
          ].map((s) => (
            <div key={s.k} className="rounded-lg border border-border bg-secondary/40 p-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                ${s.v.toLocaleString("es-CO")}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Gratis = modalidad condicionada (p. ej. Clara es gratis solo si hay impuesto a pagar; $170.000
          en cero o saldo a favor). Counti promueve declaraciones desde $5.000 sin confirmar plan ni límites.
        </p>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tab principal
// ---------------------------------------------------------------------------
export function ResumenTab() {
  return (
    <div className="space-y-6">
      <EstadoRealPanel />

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Dictamen principal del informe maestro</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-[15px] font-medium leading-relaxed text-foreground">
              La oportunidad de ALBRA consiste en construir un <span className="text-primary">agente contador
              personal integral</span>, no simplemente otro chatbot tributario ni una calculadora del
              Formulario 210.
            </p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{decisionFinal.veredicto}</p>
            <Separator />
            <div className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
              <Compass className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <span>
                <span className="font-medium text-foreground">Misión:</span> {mision.objetivoCorto}
              </span>
            </div>
            <p className="break-all rounded-md border border-border bg-secondary/40 p-2 font-mono text-[11px] text-cyan-300">
              Repositorio base: {mision.repositorioBase}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Los 4 pilares del producto</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pilares.map((p) => (
              <div key={p.n} className="flex gap-3 rounded-lg border border-border bg-card/60 p-3">
                <span className="font-mono text-lg font-bold text-primary/80">0{p.n}</span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">{p.titulo}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{p.detalle}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <ComparadorPrecios />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Las cinco categorías de soluciones identificadas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {solutionCategories.map((c) => (
            <div key={c.n} className="rounded-lg border border-border bg-card/60 p-3">
              <span className="font-mono text-xs text-primary">CATEGORÍA {c.n}</span>
              <p className="mt-1 text-[13px] font-semibold text-foreground">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-cyan-500/30">
        <CardContent className="flex items-start gap-3 p-4">
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <div>
            <p className="text-[13px] font-semibold text-foreground">Próximo paso recomendado</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{decisionFinal.proximoPaso}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
