# ALBRA — Agente Contador Digital con IA para Colombia

Sistema funcional que asiste al contador público colombiano en la preparación de la
**declaración de renta de personas naturales (Formulario 210, DIAN)**: entrevista
adaptativa, expediente financiero con procedencia, motor de cálculo determinista con
memoria de cálculo reconstruible, auditor de riesgos y ciclo de 7 estados del
procedimiento con evidencias.

Construido con el **método CloneaKit** (sala limpia): ADOPTAR/ADAPTAR código MIT
verificado (open-renta), INSPIRARSE por patrones de referentes propietarios
(Tributi, Justi, Taxon, Contadia, Counti, TribAI), DESCARTAR lo que su licencia prohíbe.

## Principios innegociables

1. **El contador no es un chatbot jurídico-tributario.** Necesita herramientas:
   expediente, cálculos, validaciones, evidencias.
2. **Agente ≠ Motor tributario.** El agente interpreta y coordina; el motor calcula
   de forma determinista y verificable. La IA nunca inventa cifras.
3. **Dato con procedencia.** Todo dato es `confirmado | documento | calculado | desconocido`.
   Los desconocidos se muestran como pendientes, nunca se rellenan.
4. **Memoria de cálculo.** Cada casilla se explica paso a paso con fórmula y norma citada.
5. **Nada de acciones sensibles automatizadas.** El sistema no firma, no presenta ni paga
   ante la DIAN; entrega hoja de digitación y memoria para revisión humana.

## Contenido

| Ruta | Qué es |
|------|--------|
| `/` | Dashboard de investigación (6 pestañas: Resumen 360, Chaleco, CloneaKit real con Matriz de Aprovechamiento, Competencia COL, Open Source, Plan y Criterios) |
| `/albra` | **Sistema funcional v1**: entrevista adaptativa → expediente → borrador F210 con memoria de cálculo → estados del procedimiento → exportaciones |
| `src/lib/albra/` | Motor F210 determinista (AG2025 versionado con fuentes normativas), agente de entrevista (21 preguntas), expediente con procedencia, exportaciones |
| `tests/albra-motor.test.ts` | 21 pruebas: paridad total contra los casos golden del motor open-renta (MIT) |
| `clones/albra/FICHA.md` | FICHA de sala limpia CloneaKit (Fase B) |
| `scripts/open-renta-ref/` | Casos golden de referencia ejecutados con el motor original |
| `worklog.md` | Registro de trabajo por tarea (trazabilidad CloneaKit) |

## Motor F210 (AG2025) — parámetros verificados

- UVT 2025: **$49.799** (Res. DIAN 000193/2024) · UVT 2026: **$52.374** (Res. 238/2025)
- Tarifa art. 241 (0/19/28/33/35/37/39 %) con adiciones 0/0/116/788/2296/5891/11245 UVT
- Límite cédula general 40 % / 1.340 UVT (art. 336-3) + beneficios fuera del límite
- Dividendos 35 % + descuento art. 254-1 · Ganancias ocasionales 15/20 % con exenciones
  art. 311-1 · Obligación a declarar art. 594-3 · Vencimientos Decreto 2229/2023
- Redondeos: pesos / aprox. a miles art. 577 / UVT 2 decimales
- Casillas F210: 91 = 41+42+53+57+69+73+86+90 · 92 = 28+41+53+69+86+139 · 93 = 91−92 · 97 = 93+96−94−95

## Ejecutar

```bash
bun install
bun run dev          # dashboard en / y sistema en /albra
bun run lint
bunx tsc --noEmit
bun test tests/albra-motor.test.ts   # 21/21 pass (paridad open-renta)
```

`DATABASE_URL` se configura en `.env` (ver `.env.example`).

## Límites honestos (v1)

- No presenta ante la DIAN (no existe API pública de radicación).
- Ingesta de exógena en CSV (PDF/XLSX en la hoja de ruta).
- Dividendos y rentas de capital detalladas, y renta presuntiva, quedan para v1.1.

## Licencias

- Código propio del proyecto: destinado al usuario (ALBRA).
- open-renta (MIT) y ClonaKit (MIT): integrados/referenciados respetando su licencia.
- Referentes propietarios: replicados solo por patrones de sala limpia, sin copiar código.
