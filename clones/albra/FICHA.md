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
