"use client";

import { ShieldAlert, Database } from "lucide-react";

export function AlbraFooter() {
  return (
    <footer className="mt-auto w-full border-t border-border bg-[#0a0e1a]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <p className="flex items-center gap-2">
            <Database className="h-3.5 w-3.5 text-cyan-500" />
            Ecosistema ALBRA · Informe Maestro de Investigación · AGENTE-GENERAL + CloneaKit
          </p>
          <p className="flex items-center gap-2 max-w-xl sm:text-right">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            Capacidades comerciales según publicaciones propias; capacidades técnicas según código y
            documentación examinados. La investigación no constituye certificación independiente.
          </p>
        </div>
      </div>
    </footer>
  );
}
