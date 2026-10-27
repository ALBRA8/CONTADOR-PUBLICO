"use client";

import { Calculator, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AlbraHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-[#0a0e1a]/85 backdrop-blur-md supports-[backdrop-filter]:bg-[#0a0e1a]/70">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/40">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm sm:text-base font-semibold tracking-tight text-foreground">
                  CONTADOR PÚBLICO <span className="text-primary">ALBRA</span>
                </h1>
              </div>
              <p className="hidden sm:block text-xs text-muted-foreground">
                Chaleco de especialización para AGENTE-GENERAL · Informe Maestro + Prompt Maestro + CloneaKit v0.1.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="hidden md:inline-flex items-center gap-1.5 border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
              <Radio className="h-3 w-3" />
              Colombia · F210 · DIAN
            </Badge>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-mono">
              INFORME 26-OCT-2026
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
