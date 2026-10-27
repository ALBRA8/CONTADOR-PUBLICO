"use client";

import {
  Building2,
  Github,
  Coins,
  Globe,
  Layers,
  GitBranch,
  ListChecks,
  Target,
  type LucideIcon,
} from "lucide-react";
import { kpis } from "@/lib/albra-data";

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  github: Github,
  coins: Coins,
  globe: Globe,
  layers: Layers,
  branch: GitBranch,
  list: ListChecks,
  target: Target,
};

export function KpiStrip() {
  return (
    <section aria-label="Indicadores clave de la investigación" className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.icon] ?? Target;
        return (
          <div
            key={kpi.label}
            className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {kpi.value}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-foreground">{kpi.label}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{kpi.hint}</p>
          </div>
        );
      })}
    </section>
  );
}
