/**
 * RUTA DE INGESTA PDF — extracción de texto en el servidor
 * =========================================================
 * El PDF del certificado 220 / certificado bancario se envía por POST
 * (multipart/form-data, campo "archivo"). El servidor extrae SOLO el texto
 * con pdf-parse y devuelve:
 *  - "texto": el texto plano completo (el navegador lo muestra como evidencia),
 *  - "ingesta": los datos reconocidos por ingesta.ingestarTextoPdf().
 *
 * El expediente sigue viviendo SOLO en el navegador: el servidor no guarda
 * nada (sin base de datos, sin logs de archivo); procesa y olvida.
 */

import { NextRequest, NextResponse } from "next/server";
import { ingestarTextoPdf } from "@/lib/albra/ingesta";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const archivo = form.get("archivo");
    if (!(archivo instanceof File)) {
      return NextResponse.json({ error: "Falta el campo «archivo» (PDF)." }, { status: 400 });
    }
    if (archivo.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "El PDF supera 10 MB." }, { status: 413 });
    }

    const { PDFParse } = await import("pdf-parse");
    const datos = new Uint8Array(await archivo.arrayBuffer());
    const parser = new PDFParse({ data: datos });
    try {
      const resultado = await parser.getText();
      const texto = resultado.text ?? "";
      const ingesta = ingestarTextoPdf(texto, archivo.name);
      return NextResponse.json({ texto, ingesta });
    } finally {
      await parser.destroy();
    }
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : "No se pudo procesar el PDF.";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
