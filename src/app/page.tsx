"use client";

import { LayoutDashboard, Building2, Github, Layers, Wrench, ListChecks } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlbraHeader } from "@/components/dashboard/header";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { AlbraFooter } from "@/components/dashboard/footer";
import { ResumenTab } from "@/components/dashboard/resumen-tab";
import { ArquitecturaTab } from "@/components/dashboard/arquitectura-tab";
import { CloneakitTab } from "@/components/dashboard/cloneakit-tab";
import { CompetenciaTab } from "@/components/dashboard/competencia-tab";
import { OpensourceTab } from "@/components/dashboard/opensource-tab";
import { PlanTab } from "@/components/dashboard/plan-tab";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <AlbraHeader />

      <main className="albra-grid-bg flex-1">
        <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 sm:px-6">
          {/* Título de sección */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              CONTADOR PÚBLICO <span className="text-primary">ALBRA</span>
              <span className="text-muted-foreground"> · Panel de proyecto</span>
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Chaleco de especialización contable para AGENTE-GENERAL, construido con el método de
              CloneaKit. Fuentes reales del proyecto: Informe Maestro de Investigación (26-oct-2026),
              Prompt Maestro del Constructor y repositorio ClonaKit v0.1.0. Prioridad: personas naturales
              y Formulario 210 (DIAN / MUISCA).
            </p>
          </div>

          <KpiStrip />

          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary/50 p-1 sm:justify-center">
              <TabsTrigger value="resumen" className="gap-1.5 data-[state=active]:text-primary">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Resumen 360
              </TabsTrigger>
              <TabsTrigger value="chaleco" className="gap-1.5 data-[state=active]:text-primary">
                <Layers className="h-3.5 w-3.5" />
                Chaleco
              </TabsTrigger>
              <TabsTrigger value="cloneakit" className="gap-1.5 data-[state=active]:text-primary">
                <Wrench className="h-3.5 w-3.5" />
                CloneaKit real
              </TabsTrigger>
              <TabsTrigger value="competencia" className="gap-1.5 data-[state=active]:text-primary">
                <Building2 className="h-3.5 w-3.5" />
                Competencia COL
              </TabsTrigger>
              <TabsTrigger value="opensource" className="gap-1.5 data-[state=active]:text-primary">
                <Github className="h-3.5 w-3.5" />
                Open Source
              </TabsTrigger>
              <TabsTrigger value="plan" className="gap-1.5 data-[state=active]:text-primary">
                <ListChecks className="h-3.5 w-3.5" />
                Plan y Criterios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="mt-6">
              <ResumenTab />
            </TabsContent>
            <TabsContent value="chaleco" className="mt-6">
              <ArquitecturaTab />
            </TabsContent>
            <TabsContent value="cloneakit" className="mt-6">
              <CloneakitTab />
            </TabsContent>
            <TabsContent value="competencia" className="mt-6">
              <CompetenciaTab />
            </TabsContent>
            <TabsContent value="opensource" className="mt-6">
              <OpensourceTab />
            </TabsContent>
            <TabsContent value="plan" className="mt-6">
              <PlanTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AlbraFooter />
    </div>
  );
}
