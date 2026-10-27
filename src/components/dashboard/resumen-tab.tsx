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
import { Quote, Layers, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  pricePoints,
  competitorColorMap,
  solutionCategories,
  priorityCandidates,
  pillars,
} from "@/lib/albra-data";

const toneClasses: Record<string, string> = {
  green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  slate: "border-slate-500/40 bg-slate-500/10 text-slate-300",
};

const pillarIcons = ["📁", "⚙️", "🧠", "🖐️"];

function COP(value: number): string {
  return "$" + value.toLocaleString("es-CO");
}

function PriceTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload as { plan: string; competitor: string; price: number };
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-foreground">{d.plan}</p>
      <p className="text-muted-foreground">{d.competitor}</p>
      <p className="mt-1 font-mono text-sm font-bold" style={{ color: competitorColorMap[d.competitor] }}>
        {COP(d.price)} COP
      </p>
    </div>
  );
}

export function ResumenTab() {
  const prices = pricePoints.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const median = [...prices].sort((a, b) => a - b)[Math.floor(prices.length / 2)];

  return (
    <div className="space-y-6">
      {/* Dictamen principal */}
      <Card className="albra-glow border-primary/25">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Quote className="h-4 w-4 text-primary" />
            DICTAMEN PRINCIPAL DE LA INVESTIGACIÓN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-lg sm:text-xl font-semibold leading-snug text-foreground">
            La oportunidad de ALBRA consiste en construir{" "}
            <span className="text-primary">un agente contador personal integral</span>, no simplemente
            otro chatbot tributario ni una calculadora del Formulario 210.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            El producto debe mantener organizada la situación financiera del contribuyente durante todo
            el año: conciliar documentos y movimientos, preparar declaraciones, encontrar beneficios
            legalmente aplicables, proyectar impuestos, detectar inconsistencias y asistir en la
            presentación ante la DIAN. Ningún proyecto examinado reúne todas esas capacidades con
            exactitud tributaria validada de forma independiente y seguridad certificada de extremo a
            extremo. El contador <span className="text-cyan-300">no debe ser solo un chatbot jurídico-tributario</span>:
            necesita herramientas, expediente financiero, cálculos deterministas, validaciones y evidencias.
          </p>
        </CardContent>
      </Card>

      {/* Comparador de precios */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Comparador de precios — planes F210 publicados (COP)
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(competitorColorMap).map(([name, color]) => (
                <span key={name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
                  {name}
                </span>
              ))}
            </div>
          </CardTitle>
          <CardDescription className="flex items-start gap-1.5 text-xs">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            Precios por declaración/temporada publicados para el año gravable 2025 y la temporada 2026.
            Deben confirmarse antes de una comparación comercial definitiva; Counti no aclara qué incluye
            su precio de entrada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="rounded-md border border-border bg-secondary/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Mínimo publicado</p>
              <p className="font-mono text-lg font-bold text-primary">{COP(min)}</p>
              <p className="text-[11px] text-muted-foreground">Counti · entrada (sin aclarar)</p>
            </div>
            <div className="rounded-md border border-border bg-secondary/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Mediana del mercado</p>
              <p className="font-mono text-lg font-bold text-cyan-300">{COP(median)}</p>
              <p className="text-[11px] text-muted-foreground">14 planes comparados</p>
            </div>
            <div className="rounded-md border border-border bg-secondary/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Máximo publicado</p>
              <p className="font-mono text-lg font-bold text-amber-300">{COP(max)}</p>
              <p className="text-[11px] text-muted-foreground">Tributi · experto exprés</p>
            </div>
          </div>
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pricePoints} layout="vertical" margin={{ top: 4, right: 56, bottom: 4, left: 8 }}>
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`)}
                  stroke="#7c8aa5"
                  tick={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
                  axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="plan"
                  width={178}
                  stroke="#7c8aa5"
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: "rgba(148,163,184,0.2)" }}
                  tickLine={false}
                />
                <Tooltip content={<PriceTooltip />} cursor={{ fill: "rgba(34,211,238,0.06)" }} />
                <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={16}>
                  {pricePoints.map((p) => (
                    <Cell key={p.plan} fill={competitorColorMap[p.competitor]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Categorías de soluciones */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cinco categorías de soluciones identificadas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {solutionCategories.map((c) => (
            <div key={c.n} className="rounded-lg border border-border bg-secondary/30 p-4">
              <span className="font-mono text-xs text-cyan-400">0{c.n}</span>
              <p className="mt-1 text-sm font-semibold text-foreground">{c.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Candidatos prioritarios */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Candidatos prioritarios — decisión final</CardTitle>
            <CardDescription className="text-xs">
              Orden por impacto para el diseño técnico del chaleco contable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {priorityCandidates.map((c) => (
              <div
                key={c.rank}
                className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:border-cyan-500/40"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-sm font-bold ${
                    c.rank <= 2 ? "border-primary/50 bg-primary/15 text-primary" : toneClasses[c.tone]
                  }`}
                >
                  {c.rank}
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
                    {c.name}
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px] text-muted-foreground">
                      {c.tag}
                    </Badge>
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cuatro pilares */}
        <Card className="albra-glow-cyan border-cyan-500/25">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Veredicto: los cuatro pilares del Agente Contador ALBRA</CardTitle>
            <CardDescription className="text-xs">
              Un agente central coordina herramientas especializadas con una única fuente de verdad
              financiera, reglas fiscales verificables y controles explícitos en cada operación sensible.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.n} className="rounded-lg border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="text-lg">{pillarIcons[p.n - 1]}</span>
                  <span className="font-mono text-[11px] text-cyan-400">PILAR {p.n}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{p.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator className="bg-border/60" />
    </div>
  );
}
