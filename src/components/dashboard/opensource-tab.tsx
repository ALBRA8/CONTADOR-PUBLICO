"use client";

import { ExternalLink, TriangleAlert, Star, FlaskConical, Wrench } from "lucide-react";
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
  colombianRepos,
  licenseStyle,
  recommendationStyle,
  internationalRepos,
  internationalProducts,
  technicalPatterns,
} from "@/lib/albra-data";

export function OpensourceTab() {
  const topTwo = colombianRepos.slice(0, 2);
  const rest = colombianRepos.slice(2);

  return (
    <div className="space-y-6">
      {/* Advertencia general */}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-sm leading-relaxed text-amber-200/85">
          <span className="font-semibold text-amber-300">Advertencia: </span>
          una licencia abierta no certifica exactitud tributaria, seguridad ni preparación para
          producción. No confundir una funcionalidad anunciada con una funcionalidad verificada, ni un
          prototipo con un sistema apto para operar información tributaria real.
        </p>
      </div>

      {/* Top 2 candidatos */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {topTwo.map((r) => (
          <Card
            key={r.name}
            className={r.name.startsWith("open-renta") ? "albra-glow border-primary/30" : "albra-glow-cyan border-cyan-500/30"}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${
                      r.name.startsWith("open-renta")
                        ? "bg-primary/15 text-primary"
                        : "bg-cyan-500/15 text-cyan-300"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                  </span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {r.name}
                  </a>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </span>
                <Badge variant="outline" className="border-primary/40 bg-primary/10 text-[10px] text-primary">
                  CANDIDATO {r.name.startsWith("open-renta") ? "#1" : "#2"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs leading-relaxed text-muted-foreground">{r.contribution}</p>
              <p className="text-xs leading-relaxed text-foreground/80">{r.detail}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`text-[10px] ${licenseStyle[r.license].className}`}>
                  {r.licenseLabel}
                </Badge>
                <Badge variant="outline" className={`text-[10px] ${recommendationStyle[r.recommendation].className}`}>
                  {r.recommendationLabel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matriz de decisión */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Matriz de decisión — repositorios colombianos</CardTitle>
          <CardDescription className="text-xs">
            Aporte principal, situación de licencia y recomendación por repositorio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Proyecto</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Aporte principal</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Licencia</TableHead>
                  <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">Recomendación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rest.map((r) => (
                  <TableRow key={r.name} className="border-border/70">
                    <TableCell>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary"
                      >
                        {r.name}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                      <p className="mt-0.5 max-w-md text-[11px] leading-relaxed text-muted-foreground">{r.detail}</p>
                    </TableCell>
                    <TableCell className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                      {r.contribution}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`whitespace-nowrap text-[10px] ${licenseStyle[r.license].className}`}>
                        {r.licenseLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`whitespace-nowrap text-[10px] ${recommendationStyle[r.recommendation].className}`}>
                        {r.recommendationLabel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Referentes internacionales */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Referentes internacionales de código abierto</CardTitle>
          <CardDescription className="text-xs">
            Referencias arquitectónicas. Las reglas fiscales de EE. UU., Reino Unido, India, España,
            Australia o Brasil no deben trasladarse a Colombia.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {internationalRepos.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-lg border border-border bg-secondary/30 p-3.5 transition-colors hover:border-cyan-500/40"
            >
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-primary">
                <FlaskConical className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                {r.name}
              </p>
              <Badge variant="outline" className="mt-1.5 w-fit text-[10px] text-muted-foreground">
                {r.license}
              </Badge>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{r.lesson}</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-cyan-200/70">→ {r.use}</p>
            </a>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Productos comerciales internacionales */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Productos comerciales internacionales</CardTitle>
            <CardDescription className="text-xs">
              Referencias de mercado; no equivalen a una declaración colombiana de persona natural.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {internationalProducts.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 rounded-md border border-border/70 bg-secondary/20 px-3 py-2 transition-colors hover:border-cyan-500/40"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">{p.name}</p>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">{p.note}</p>
                </div>
                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </CardContent>
        </Card>

        {/* Patrones técnicos */}
        <Card className="albra-glow-cyan border-cyan-500/25">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Patrones técnicos que conviene estudiar</CardTitle>
            <CardDescription className="text-xs">
              Reglas de oro extraídas de los repositorios financieros y contables examinados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {technicalPatterns.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-500/15 font-mono text-[10px] text-cyan-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-md border border-primary/25 bg-primary/5 p-3">
              <Wrench className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p className="text-[11px] leading-relaxed text-primary/90">
                CloneaKit aplica estos patrones mediante la matriz de aprovechamiento: referente,
                capacidad, evidencia, valor, riesgos, licencia, decisión (adoptar / adaptar / inspirarse /
                descartar), destino y validación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
