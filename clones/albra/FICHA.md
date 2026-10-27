# Ficha: CONTADOR PÚBLICO ALBRA — Núcleo funcional v1

> Inspirada en: open-renta (MIT) y los competidores del Informe Maestro (solo como referencia de funciones; no se copia interfaz ni marca)
> Método: sala limpia CloneaKit — este documento es el único insumo del constructor
> Fecha: 27-oct-2026 · AG 2025 (presentación 2026)

## 1. En una frase

Un sistema web que acompaña a una persona natural residente en Colombia a preparar su declaración de renta (Formulario 210, AG 2025): entrevista lo que falta, importa documentos, liquida de forma determinista con memoria de cálculo trazable y deja evidencias, sin presentar nada ante la DIAN por su cuenta.

## 2. Para quién y para qué

Para el contribuyente persona natural (y el contador que lo acompaña) durante la temporada de renta: convertir documentos dispersos y respuestas en un borrador de F210 verificable, con estados del procedimiento y riesgos auditados antes de digitar en MUISCA.

## 3. Funciones de la primera versión (MVP)

| # | Función | Qué hace, con nuestras palabras | Cómo se hará en la web |
| --- | --- | --- | --- |
| 1 | Entrevista adaptativa | El agente pregunta SOLO lo que falta para liquidar; nunca asume respuestas tributarias; cada respuesta queda con su fuente (confirmada por el usuario) | Generador de preguntas por completitud (TypeScript), una a una, guardando el expediente en el navegador |
| 2 | Expediente financiero | Los datos viven en un expediente con procedencia: confirmado / documento / calculado / desconocido; importación de exógena y certificado 220 en CSV; export/import JSON | Modelo de datos con campo procedencia + parsers CSV + persistencia localStorage |
| 3 | Motor determinista F210 | Liquida cédula general, pensiones, dividendos y ganancias ocasionales con parámetros AG2025 versionados; la misma entrada da siempre el mismo resultado | Funciones puras con redondeo DIAN (pesos, aprox. a miles art. 577), tabla art. 241, límite 40%/1.340 UVT art. 336 |
| 4 | Borrador F210 + memoria | Muestra las casillas calculadas del formulario 210 y, por cada una, la memoria de cálculo (fórmula + norma) que la reconstruye | Vista borrador con casillas expandibles y memoria de cálculo por paso |
| 5 | Validaciones y estados | Auditor de riesgos (inconsistencias, topes copados, obligación a declarar, plazos por NIT) y ciclo de estados INCOMPLETO → SOPORTADO con transiciones exigentes | Reglas de validación + barra de estados; export hoja de digitación CSV y memoria JSON |

## 4. Pantallas

### Pantalla principal (/albra)
- **Qué se ve:** barra de estado del procedimiento (7 estados), KPIs del expediente (completitud, saldo estimado), y 4 pestañas: Entrevista · Expediente · Borrador F210 · Estados y Evidencias.
- **Qué se puede hacer:** responder la entrevista, importar CSV, editar datos con procedencia, liquidar, descargar hoja de digitación CSV / memoria JSON / expediente JSON, cargar expediente JSON.

### Dashboard de investigación (/)
- Se conserva: panel de proyecto con competencia, open source, CloneaKit y matriz de aprovechamiento. Enlace cruzado a /albra.

## 5. Flujos paso a paso

### Flujo 1 — De cero a borrador
1. La persona abre /albra y responde la entrevista (identidad, rentas de trabajo, deducciones, patrimonio, retenciones).
2. Si importa una exógena/certificado en CSV, los campos extraídos quedan como "documento" y la entrevista solo pregunta lo que siga faltando.
3. Al completar lo mínimo, el motor liquida: ve casillas + memoria + validaciones.
4. El borrador pasa de INCOMPLETO a PREPARADO; si todas las validaciones pasan, puede marcar VALIDADO; tras revisar, APROBADO (acción del usuario).
5. La vista le guía el diligenciamiento manual en MUISCA (enlace oficial), con la hoja de digitación en orden de captura; registrar que diligenció pasa el estado a DILIGENCIADO; al guardar el comprobante, SOPORTADO.

### Flujo 2 — Evidencia de un número
1. En el borrador, la persona hace clic en cualquier casilla (ej. 92).
2. Se expande la memoria: fórmula, valores de entrada y norma (art. ET) de cada paso.
3. Cada cifra se reconstruye desde el expediente; ningún valor sale del modelo de lenguaje.

## 6. Datos

- **Qué guarda:** expediente del declarante (alias, NIT 2 últimos dígitos, dependientes), ingresos, aportes, deducciones, rentas exentas, patrimonio, retenciones, anticipos, año anterior — cada dato con procedencia y, si viene de documento, el archivo de origen.
- **Dónde:** localStorage del navegador (v1) + export/import JSON. Nada sale a servicios externos.
- **Datos personales:** sí (financieros). Sin credenciales DIAN jamás. Sin envío a terceros.

## 7. Para más adelante (fuera de esta versión)

- Parseo real de PDFs de la DIAN (exógena XLSX/PDF), optimizador de escenarios, beneficio de auditoría art. 689-3, calendario de correcciones, integración con AGENTE-GENERAL como skill.

## 8. Identidad propia

- **Nombre:** CONTADOR PÚBLICO ALBRA
- **Colores y estilo:** dark premium #0A0E1A con verde neón/cyan, densidad ejecutiva (consistente con el panel de proyecto)
- **Idioma de la interfaz:** español

## 9. Reglas innegociables de contenido (del Prompt Maestro)

- El LLM no suma: toda la aritmética vive en el motor determinista. Cero invención de cifras: lo que falta se marca PENDIENTE/desconocido, nunca se estima ni se rellena con ceros.
- Diligenciar no es presentar: el sistema nunca afirma que se presentó; la presentación es del declarante en MUISCA.
- Un borrador no es una declaración presentada; una respuesta del agente no sustituye el comprobante oficial.
- Si un caso sale del alcance (contabilidad obligatoria, no residente, activos en el exterior, RST, sucesiones, ECE), el sistema lo dice y recomienda contador (desenlace R7).
- Los parámetros van versionados por año gravable con fuente normativa; AG2025 usa UVT $49.799 (Res. DIAN 000193/2024) y UVT presentación $52.374 (Res. DIAN 000238/2025).

## 10. Checklist de sala limpia

- [x] Las funciones están descritas con nuestras palabras; no hay textos copiados del original.
- [x] No hay capturas, iconos, logos ni imágenes del original en este documento.
- [x] La implementación es original en TypeScript; de open-renta se adoptan reglas funcionales públicas (normativa ET) y parámetros oficiales (datos), bajo licencia MIT con atribución, validadas por paridad contra sus casos golden.
- [x] El nombre y la identidad visual son propios (ALBRA).
- [x] Ninguna función se salta pagos, licencias, logins o protecciones: no automatiza MUISCA ni pide credenciales DIAN.

---

## v1.1 — Rentas de capital, dividendos detallados, renta presuntiva e ingesta (2026-10-27)

Ampliación del núcleo validada con el mismo método: paridad contra el motor real del
referente + casillas oficiales del instructivo F210 v16 (mapa de casillas verificado de
open-renta, extraído del PDF oficial de la DIAN).

### Decisiones con evidencia

1. **Corrección del mapeo de casillas de dividendos (hallazgo de auditoría).** En v1 los
   dividendos no gravados iban a la casilla 104 y los gravados a la 107; el instructivo
   oficial define: 104 = dividendos año 2016 y anteriores (fuera de alcance v1.1),
   **107 = 1a. subcédula (num. 3 art. 49, no gravados)** y **108 = 2a. subcédula
   (par. 2 art. 49, gravados al 35% → casilla 118)**. Corregido y cubierto por pruebas.
2. **Casilla 111 con fórmula oficial.** «Renta líquida gravable (cédula general o renta
   presuntiva, de pensiones y dividendos) base casillas **97 o 98 + 103 + 107 + 108 − 118**».
   El remanente de los gravados (108 − 118) SÍ entra a la tabla del art. 241; los
   dividendos del exterior NO (tributan 35% fijo en la casilla 120, art. 244).
3. **Renta presuntiva (art. 189-5 ET).** 0,5% del patrimonio líquido del año anterior →
   casilla 98; la base de la tabla usa la mayor entre 97 y 98. El exceso de presuntiva se
   anuncia como compensación de los 5 años siguientes (casilla 95). Sin datos del año
   anterior NO se inventa: la memoria lo deja «sin verificar» y entra a pendientes.
4. **Divergencia documentada — descuento art. 254-1.** open-renta lo liquida sobre el
   TOTAL de dividendos; aquí se aplica el texto del artículo (condición: gravados con la
   tarifa del par. 2 art. 49 → base = casilla 108), con nota en la memoria de cálculo.
   Además el descuento se resta desde la casilla 121 (instructivo: 126 = 121 − 125), y el
   anticipo del art. 807 usa la casilla 126 completa. Diferencias materializadas en
   pruebas (caso-e: open-renta $25.339.837 de neto vs. $40.726.464 con esta lectura).
5. **Rentas de capital (casillas 58-73, art. 242).** Ingresos por rendimientos financieros
   gravados (CDT, fondos, pagarés). Los intereses de cuentas de ahorro están exentos
   (art. 206 num. 3) y NO se registran. v1.1 no pide exentas/deducciones imputadas al
   bloque → casilla 69 = 0 y 73 = 61 (la limitación 40%/1.340 UVT opera por bloque y solo
   procede con imputables). Pérdidas → casilla 71 con alerta de compensación 5 años.
6. **Ingesta de documentos (Módulo 3).** PDF (certificado 220, pdf-parse en ruta de API),
   XLSX (SheetJS en el navegador, agrupa por concepto tipo exógena Res. 1628) y CSV.
   La ingesta SOLO PROPONE: cada dato se acepta, corrige o rechaza en la UI y entra al
   expediente con procedencia «documento» y el archivo de origen. Sin cookies ni
   persistencia en servidor.
7. **Entrevista ampliada:** 6 preguntas nuevas (rendimientos financieros, 3 de
   dividendos, patrimonio del año anterior ×2) y clasificador de documentos ampliado.

### Paridad y pruebas (36 en total)

- Golden-e creado ejecutando el motor Python real de open-renta con un caso propio de
  dividendos (scripts/open-renta-ref/golden-e.json): cg 102.478.944, div_renta_liquida
  69.500.000, RLG 171.978.944, impuesto 30.226.464 — paridad exacta en ALBRA.
- Golden A/B intactos (21 pruebas originales). 15 pruebas nuevas: capital (2), dividendos
  con paridad y divergencias (4), presuntiva (3), obligación (2), ingesta (3), fusión de
  expedientes v1 (1).

### Fuera de alcance v1.1 (sigue en la hoja de ruta)

Dividendos año 2016 y anteriores (casillas 104/106/119), compensaciones de pérdidas de
capital entre años (casilla 72), impuestos pagados en el exterior (122/128), exógena
PDF con formatos arbitrarios (v1.1: 220 y etiquetas DIAN conocidas).
