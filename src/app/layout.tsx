import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CONTADOR PÚBLICO ALBRA · Panel de proyecto",
  description:
    "Panel de proyecto del chaleco de especialización contable para AGENTE-GENERAL: estado real, arquitectura del chaleco (Prompt Maestro), análisis real de CloneaKit, competencia colombiana, repos open source, plan por fases y criterios de aceptación. F210 · DIAN · MUISCA.",
  keywords: ["ALBRA", "AGENTE-GENERAL", "CloneaKit", "contador digital", "Formulario 210", "DIAN", "MUISCA", "declaración de renta", "Colombia"],
  authors: [{ name: "Ecosistema ALBRA" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
