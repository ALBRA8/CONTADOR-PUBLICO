"use client";

import { useState } from "react";
import { FolderOpen, Pencil, Check, X, FileText, User, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Expediente,
  DatoConOrigen,
  datoConfirmado,
  esDesconocido,
} from "@/lib/albra/tipos";
import { vencimientoPorNit } from "@/lib/albra/motor";

interface Props {
  expediente: Expediente;
  onCambiar: (e: Expediente) => void;
}

interface FilaDato {
  ruta: string;
  etiqueta: string;
  referencia: string;
}

const FILAS: FilaDato[] = [
  { ruta: "rentasTrabajo.ingresosBrutos", etiqueta: "Ingresos brutos por salarios", referencia: "Casilla 32" },
  { ruta: "rentasTrabajo.aportesObligatoriosSalud", etiqueta: "Aportes a salud (salarios)", referencia: "Casilla 33" },
  { ruta: "rentasTrabajo.aportesObligatoriosPension", etiqueta: "Aportes a pensión (salarios)", referencia: "Casilla 33" },
  { ruta: "rentasIndependientes.ingresosBrutos", etiqueta: "Ingresos por honorarios/servicios", referencia: "Casilla 43" },
  { ruta: "rentasIndependientes.aportesObligatoriosSalud", etiqueta: "Aportes a salud (independiente)", referencia: "Casilla 44" },
  { ruta: "rentasIndependientes.aportesObligatoriosPension", etiqueta: "Aportes a pensión (independiente)", referencia: "Casilla 44" },
  { ruta: "rentasIndependientes.costosGastos", etiqueta: "Costos y gastos de honorarios", referencia: "Casilla 45" },
  { ruta: "deducciones.interesesVivienda", etiqueta: "Intereses de crédito de vivienda", referencia: "Casilla 38 · art. 119" },
  { ruta: "deducciones.medicinaPrepagada", etiqueta: "Medicina prepagada y seguros de salud", referencia: "Art. 387" },
  { ruta: "deducciones.gmfPagado", etiqueta: "GMF 4x1000 pagado", referencia: "Art. 115" },
  { ruta: "deducciones.comprasFacturaElectronica", etiqueta: "Compras con factura electrónica", referencia: "Casilla 28 · art. 336-5" },
  { ruta: "rentasExentas.aportesVoluntariosPension", etiqueta: "Aportes voluntarios a pensión", referencia: "Casilla 35 · arts. 126-1/126-4" },
  { ruta: "rentasExentas.afc", etiqueta: "Cuentas AFC", referencia: "Art. 126-1" },
  { ruta: "rentasCapital.ingresosBrutos", etiqueta: "Rendimientos financieros gravados (CDT, fondos)", referencia: "Casilla 58 · art. 242" },
  { ruta: "rentasCapital.costosGastos", etiqueta: "Costos de las rentas de capital", referencia: "Casilla 60 · art. 242" },
  { ruta: "dividendos.noGravados", etiqueta: "Dividendos no gravados (1a subcédula)", referencia: "Casilla 107 · art. 49 num. 3" },
  { ruta: "dividendos.gravados", etiqueta: "Dividendos gravados (2a subcédula, 35%)", referencia: "Casilla 108 · art. 49 par. 2" },
  { ruta: "dividendos.delExterior", etiqueta: "Dividendos recibidos del exterior", referencia: "Casilla 109 · art. 244" },
  { ruta: "patrimonio.bruto", etiqueta: "Patrimonio bruto a 31-dic", referencia: "Casilla 29" },
  { ruta: "patrimonio.deudas", etiqueta: "Deudas a 31-dic", referencia: "Casilla 30" },
  { ruta: "patrimonio.anioAnteriorBruto", etiqueta: "Patrimonio bruto año anterior (2024)", referencia: "Casilla 98 · renta presuntiva art. 189-5" },
  { ruta: "patrimonio.anioAnteriorDeudas", etiqueta: "Deudas año anterior (2024)", referencia: "Casilla 98 · renta presuntiva art. 189-5" },
  { ruta: "retenciones.rentasTrabajo", etiqueta: "Retenciones en la fuente", referencia: "Casilla 132" },
  { ruta: "consumosTarjeta", etiqueta: "Consumos con tarjeta de crédito", referencia: "Obligación a declarar" },
  { ruta: "consignaciones", etiqueta: "Consignaciones bancarias", referencia: "Obligación a declarar" },
];

const estilosProcedencia: Record<string, string> = {
  confirmado: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  documento: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  calculado: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  desconocido: "border-amber-500/40 bg-amber-500/10 text-amber-300",
};

export function VistaExpediente({ expediente, onCambiar }: Props) {
  const [editando, setEditando] = useState<string | null>(null);
  const [valorTemporal, setValorTemporal] = useState("");
  const [aliasTemporal, setAliasTemporal] = useState<string | null>(null);
  const [nitTemporal, setNitTemporal] = useState<string | null>(null);

  const leerDato = (ruta: string): DatoConOrigen<number> | undefined => {
    const partes = ruta.split(".");
    let actual: any = expediente;
    for (const p of partes) actual = actual?.[p];
    return actual as DatoConOrigen<number> | undefined;
  };

  const escribirDato = (ruta: string, valor: number | null) => {
    const copia: Expediente = structuredClone(expediente);
    const partes = ruta.split(".");
    let actual: any = copia;
    for (let i = 0; i < partes.length - 1; i++) actual = actual[partes[i]];
    const clave = partes[partes.length - 1];
    actual[clave] = valor === null ? { valor: null, procedencia: "desconocido" } : datoConfirmado(valor);
    onCambiar(copia);
  };

  const guardarEdicion = (fila: FilaDato) => {
    const limpio = valorTemporal.replace(/[$\s.]/g, "");
    const num = Number(limpio);
    if (valorTemporal.trim() === "") escribirDato(fila.ruta, null);
    else if (Number.isFinite(num)) escribirDato(fila.ruta, num);
    setEditando(null);
    setValorTemporal("");
  };

  const vencimiento = vencimientoPorNit(expediente.contribuyente.nitUltimos2);

  return (
    <div className="space-y-5">
      {/* Identidad y calendario */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Expediente financiero — cada dato con su procedencia</CardTitle>
          </div>
          <CardDescription>
            Confirma con el certificado 220 (salarios y retenciones), certificados bancarios (intereses, GMF), el portal MUISCA
            (factura electrónica, exógena) y tus documentos de patrimonio. Puedes editar cualquier dato; queda como «confirmado».
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-3">
            <User className="h-4 w-4 shrink-0 text-cyan-400" />
            {aliasTemporal === null ? (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Alias del expediente</p>
                  <p className="truncate text-sm font-medium text-foreground">{expediente.contribuyente.alias || "Sin alias"}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => { setAliasTemporal(expediente.contribuyente.alias); setNitTemporal(expediente.contribuyente.nitUltimos2); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <div className="flex flex-1 items-center gap-2">
                <Input value={aliasTemporal} onChange={(e) => setAliasTemporal(e.target.value)} placeholder="Alias" className="h-8 bg-secondary/40 text-xs" />
                <Input value={nitTemporal ?? ""} onChange={(e) => setNitTemporal(e.target.value.replace(/\D/g, "").slice(0, 2))} placeholder="2 dígitos NIT" className="h-8 w-28 bg-secondary/40 font-mono text-xs" />
                <Button size="sm" className="h-8" onClick={() => {
                  const copia = structuredClone(expediente);
                  copia.contribuyente.alias = (aliasTemporal || "").trim();
                  copia.contribuyente.nitUltimos2 = (nitTemporal || "").slice(0, 2);
                  onCambiar(copia);
                  setAliasTemporal(null);
                  setNitTemporal(null);
                }}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8" onClick={() => setAliasTemporal(null)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-3">
            <CalendarClock className="h-4 w-4 shrink-0 text-cyan-400" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vencimiento (Decreto 2229 de 2023)</p>
              <p className="text-sm font-medium text-foreground">
                {vencimiento ?? "Faltan los 2 dígitos del NIT"}{" "}
                {expediente.contribuyente.obligadoContabilidad && (
                  <Badge variant="outline" className="ml-1 border-rose-500/40 bg-rose-500/10 text-[9px] text-rose-300">
                    OBLIGADO CONTABILIDAD → CONTADOR
                  </Badge>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datos del expediente */}
      <div className="grid gap-2 lg:grid-cols-2">
        {FILAS.map((fila) => {
          const dato = leerDato(fila.ruta);
          const desconocido = !dato || esDesconocido(dato);
          const enEdicion = editando === fila.ruta;
          return (
            <div key={fila.ruta} className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[12px] font-medium text-foreground">{fila.etiqueta}</p>
                  <Badge variant="outline" className={`shrink-0 text-[9px] ${estilosProcedencia[desconocido ? "desconocido" : dato!.procedencia]}`}>
                    {desconocido ? "PENDIENTE" : dato!.procedencia === "documento" ? "DOCUMENTO" : dato!.procedencia === "confirmado" ? "CONFIRMADO" : dato!.procedencia.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {fila.referencia}
                  {dato?.origen ? ` · origen: ${dato.origen}` : ""}
                </p>
              </div>
              {enEdicion ? (
                <div className="flex shrink-0 items-center gap-1">
                  <Input
                    autoFocus
                    value={valorTemporal}
                    onChange={(e) => setValorTemporal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && guardarEdicion(fila)}
                    placeholder="valor"
                    className="h-8 w-32 bg-secondary/40 text-right font-mono text-xs"
                  />
                  <Button size="sm" className="h-8 w-8 p-0" onClick={() => guardarEdicion(fila)}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setEditando(null); setValorTemporal(""); }}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className={`shrink-0 font-mono text-[13px] tabular-nums ${desconocido ? "text-muted-foreground/40" : "text-cyan-300"}`}>
                    {desconocido ? "— — —" : formatear(dato!.valor!)}
                  </span>
                  <Button variant="ghost" size="sm" className="h-7 w-7 shrink-0 p-0 text-muted-foreground" onClick={() => { setEditando(fila.ruta); setValorTemporal(desconocido ? "" : String(dato!.valor)); }}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatear(n: number): string {
  return `$${Math.round(n).toLocaleString("es-CO")}`;
}
