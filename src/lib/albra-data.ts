// ============================================================================
// DATOS ESTRUCTURADOS — PROYECTO CONTADOR PÚBLICO ALBRA
// Fuentes reales (verificadas, en /upload):
//   1. Informe Maestro de Investigación (26-oct-2026) — Pasted Content_1793076237083.txt
//   2. Prompt Maestro para el Constructor — Pasted Content_1793076871286.txt
//   3. ClonaKit.zip (v0.1.0, MIT, Divisual Project) — analizado en /upload/clonakit-extracted
// ============================================================================

// ---------------------------------------------------------------------------
// CATEGORÍAS DE SOLUCIONES IDENTIFICADAS (Informe Maestro §1)
// ---------------------------------------------------------------------------
export const solutionCategories = [
  { n: 1, title: "Preparadoras de renta PN", desc: "Plataformas que preparan declaraciones de renta para personas naturales." },
  { n: 2, title: "Copilotos IA contables", desc: "Asistentes de inteligencia artificial para contadores profesionales." },
  { n: 3, title: "Motores deterministas F210", desc: "Cálculo reproducible del Formulario 210 sin depender del LLM." },
  { n: 4, title: "Agentes documentales", desc: "Procesan documentos, exógena y certificados tributarios." },
  { n: 5, title: "Automatización de formulario", desc: "Diligenciamiento asistido de formularios mediante navegador." },
] as const;

// ---------------------------------------------------------------------------
// KPIs GLOBALES
// ---------------------------------------------------------------------------
export const kpis = [
  { label: "Estado del contador", value: "Plan", hint: "Nada construido aún: sin motor ni agente", icon: "gauge" },
  { label: "Competidores COL", value: "6", hint: "Justi, Tributi, Taxon, Contadia, Counti, TribAI", icon: "building" },
  { label: "Repos GitHub COL", value: "8", hint: "Auditados en la matriz de decisión", icon: "github" },
  { label: "Módulos del chaleco", value: "11", hint: "Prompt Maestro §7, M1→M11", icon: "layers" },
  { label: "Capacidades objetivo", value: "15", hint: "Prompt Maestro §3", icon: "target" },
  { label: "Fases del plan", value: "7", hint: "Fase 0 (inspección) → Fase 6 (entrega)", icon: "list" },
  { label: "Criterios de aceptación", value: "23", hint: "5 bloques verificables con evidencia", icon: "check" },
  { label: "Herramientas CloneaKit", value: "5", hint: "investigar · capturas · probar · comprobar · diapositivas", icon: "wrench" },
] as const;

// ---------------------------------------------------------------------------
// ESTADO REAL DEL PROYECTO (respuesta honesta a: ¿ya es operativo o es mock?)
// ---------------------------------------------------------------------------
export interface RealidadItem {
  estado: "existe" | "parcial" | "no-existe";
  titulo: string;
  detalle: string;
}

export const realidadDelProyecto: {
  veredicto: string;
  explicacion: string;
  items: RealidadItem[];
} = {
  veredicto: "Este dashboard es una herramienta de gestión del proyecto, no el contador.",
  explicacion:
    "CONTADOR PÚBLICO ALBRA aún no existe como software operativo. Lo que existe hoy es la fase de investigación y definición: el informe maestro de competencia, el prompt maestro que define el chaleco para AGENTE-GENERAL y el análisis del kit CloneaKit. El primer código del contador (motor F210, agente, expediente) llega en las Fases 2–4 del plan, después de auditar open-renta y completar la matriz de aprovechamiento. Este panel refleja el estado real, sin maquillar.",
  items: [
    {
      estado: "existe",
      titulo: "Informe maestro de investigación",
      detalle: "Completo: 6 competidores COL con precios, 8 repos GitHub auditados, referentes internacionales, fuentes DIAN, riesgos y plan. Fecha 26-oct-2026.",
    },
    {
      estado: "existe",
      titulo: "Prompt maestro del constructor",
      detalle: "Especificación completa del chaleco: misión, reglas arquitectónicas innegociables, 11 módulos, 7 estados, fases 0–6, 23 criterios de aceptación e informe final obligatorio.",
    },
    {
      estado: "existe",
      titulo: "Análisis real de CloneaKit",
      detalle: "Kit estudiado desde el zip (v0.1.0): REA 6.4.0, 5 herramientas, método de sala limpia, 9 recetas, formación de 9 lecciones. Mapeado a las Fases A–D del prompt.",
    },
    {
      estado: "existe",
      titulo: "Este dashboard de gestión",
      detalle: "Visualización de investigación y plan. No calcula impuestos ni toca MUISCA.",
    },
    {
      estado: "no-existe",
      titulo: "Motor tributario determinista F210",
      detalle: "No hay código. El plan prevé auditar open-renta (MIT) como base conceptual y construir el motor con reglas versionadas por año gravable (Fases 2–4).",
    },
    {
      estado: "no-existe",
      titulo: "Agente conversacional contador",
      detalle: "No hay agente. Debe ser un chaleco que se activa sobre AGENTE-GENERAL (repo ALBRA8/AGENTE-GENERAL), no un chatbot independiente.",
    },
    {
      estado: "no-existe",
      titulo: "Expediente financiero, ingestión documental y Hands",
      detalle: "Sin modelo de datos, sin extracción de certificados/exógena, sin operador de navegador. Pertenecen a las Fases 2–6.",
    },
    {
      estado: "no-existe",
      titulo: "Integración con AGENTE-GENERAL y pruebas tributarias",
      detalle: "El repositorio AGENTE-GENERAL no ha sido inspeccionado aún (Fase 0). Sin casos de paridad ni validación con contador público (Fase 5).",
    },
  ],
};

// ---------------------------------------------------------------------------
// MISIÓN Y METÁFORA ARQUITECTÓNICA (Prompt Maestro §1)
// ---------------------------------------------------------------------------
export const mision = {
  repositorioBase: "https://github.com/ALBRA8/AGENTE-GENERAL.git",
  herramienta: "CloneaKit (ingenería y análisis de referentes)",
  objetivoCorto:
    "Construir CONTADOR PÚBLICO ALBRA, un arnés/chaleco de especialización contable que AGENTE-GENERAL se pone cuando necesita actuar como contador público colombiano. No es un ERP, no es otro agente autónomo, no es un chatbot tributario.",
  metafora: [
    {
      rol: "AGENTE-GENERAL",
      parte: "El cuerpo central",
      detalle:
        "Conserva su identidad, su arquitectura cognitiva, sus capacidades generales, su memoria, sus guardrails, su observabilidad y sus mecanismos de orquestación existentes.",
    },
    {
      rol: "CONTADOR PÚBLICO ALBRA",
      parte: "El chaleco especializado",
      detalle:
        "Incorpora el conocimiento, las herramientas, los procedimientos, las reglas, los contratos y las capacidades para resolver tareas contables y tributarias.",
    },
    {
      rol: "CloneaKit",
      parte: "Herramienta de ingeniería",
      detalle:
        "Estudia referentes, identifica patrones útiles y mejora la implementación sin convertir el proyecto en una colección desordenada de copias.",
    },
    {
      rol: "Motores y validadores",
      parte: "Componentes del chaleco",
      detalle:
        "Los motores de cálculo, validadores, conectores y herramientas especializadas son piezas del chaleco, no identidad del agente.",
    },
  ],
  prioridad:
    "Colombia y personas naturales, con énfasis en renta y complementarios, Formulario 210 y procedimientos DIAN. Arquitectura ampliable sin reconstruir desde cero.",
};

// ---------------------------------------------------------------------------
// REGLAS ARQUITECTÓNICAS INNEGOCIABLES (Prompt Maestro §2)
// ---------------------------------------------------------------------------
export const reglasInnegociables = [
  {
    n: "2.1",
    titulo: "No modificar innecesariamente AGENTE-GENERAL",
    puntos: [
      "Inspeccionar el repositorio real antes de desarrollar: la implementación es la fuente de verdad, no este prompt.",
      "Preservar identidad, orquestación, memoria, guardrails, observabilidad y conectores existentes.",
      "No reescribir el núcleo, no meter dependencias contables en el centro, no duplicar el agente, no fusionar indiscriminadamente.",
      "Integrar por el mecanismo real más compatible (skill, capability, módulo, adaptador, contrato o herramienta).",
      "La especialización debe poder incorporarse, actualizarse, probarse y retirarse sin destruir el agente central.",
    ],
  },
  {
    n: "2.2",
    titulo: "El producto es un agente, no un programa de contabilidad",
    puntos: [
      "No convertir el proyecto en ERP, facturación, libro diario, nómina ni aplicación de formularios.",
      "La interfaz principal es el agente conversacional que razona, investiga, recopila, usa herramientas y explica.",
      "Motores deterministas y bases de datos son válidos cuando sirven al agente, no cuando lo sustituyen.",
      "Cada componente debe justificar su existencia respondiendo: ¿qué necesita AGENTE-GENERAL para actuar como especialista en contaduría pública colombiana?",
    ],
  },
  {
    n: "2.3",
    titulo: "El arnés debe ser agnóstico y reutilizable",
    puntos: [
      "Separar instrucciones, herramientas, contratos, adaptadores, integraciones, permisos y evidencias.",
      "AGENTE-GENERAL es el primer anfitrión, no una dependencia que impida otros agentes compatibles.",
      "No desarrollar adaptadores hipotéticos: implementar primero el camino real y comprobable.",
    ],
  },
];

// ---------------------------------------------------------------------------
// 15 CAPACIDADES OBJETIVO (Prompt Maestro §3)
// ---------------------------------------------------------------------------
export const capacidadesObjetivo = [
  "Comprender la situación económica, patrimonial y tributaria del usuario.",
  "Formular preguntas para identificar información faltante.",
  "Recopilar y organizar documentos financieros y tributarios.",
  "Extraer información de certificados, extractos, PDF y hojas de cálculo.",
  "Identificar ingresos, costos, gastos, patrimonio, deudas y retenciones.",
  "Contrastar la información con fuentes oficiales y normativa aplicable.",
  "Calcular obligaciones con motores deterministas y reglas versionadas.",
  "Identificar beneficios tributarios potenciales y verificar requisitos.",
  "Detectar inconsistencias, omisiones, duplicidades y riesgos.",
  "Explicar los cálculos y decisiones de manera comprensible.",
  "Preparar borradores, reportes, soportes y datos estructurados.",
  "Asistir en la presentación oficial cuando exista un mecanismo autorizado y verificable.",
  "Mantener trazabilidad entre conclusión, documento de origen, regla y cálculo.",
  "Registrar decisiones, aprobaciones y acciones relevantes.",
  "Reconocer cuándo hace falta más información o un profesional humano.",
] as const;

// ---------------------------------------------------------------------------
// 11 MÓDULOS DEL CHALECO (Prompt Maestro §7)
// ---------------------------------------------------------------------------
export interface ModuloChaleco {
  id: string;
  nombre: string;
  funcion: string;
  claves: string[];
  destacado?: boolean;
}

export const modulosChaleco: ModuloChaleco[] = [
  {
    id: "M1",
    nombre: "Identidad y orquestación contable",
    funcion:
      "Define cómo AGENTE-GENERAL activa el modo especialista, qué instrucciones recibe, qué herramientas puede usar, cómo selecciona procedimientos y cuándo pedir intervención humana.",
    claves: ["Conserva la identidad del agente central", "Activación y desactivación limpia"],
  },
  {
    id: "M2",
    nombre: "Perfil económico y tributario",
    funcion:
      "Recopila la información para comprender la situación del usuario, distinguiendo el origen y la confianza de cada dato.",
    claves: [
      "7 tipos de dato: confirmado, extraído, importado, calculado, inferencia pendiente, desconocido, contradictorio",
      "Cada dato conserva procedencia, fecha y período fiscal",
    ],
  },
  {
    id: "M3",
    nombre: "Ingestión documental",
    funcion:
      "Procesa documentos compatibles, extrae campos y mantiene trazabilidad hasta el archivo y fragmento de origen.",
    claves: [
      "Detecta ilegibles, faltantes, duplicados, períodos incorrectos y discrepancias",
      "La extracción IA nunca se convierte automáticamente en dato contable definitivo",
    ],
  },
  {
    id: "M4",
    nombre: "Expediente financiero longitudinal",
    funcion:
      "Estructura que mantiene la información a través del tiempo: la capa que convierte el producto en contador permanente y no en app de temporada.",
    claves: [
      "Ingresos, retenciones, patrimonio, deudas, movimientos, costos, exógena, declaraciones previas",
      "Diseñada para ampliar sin duplicar datos ni perder procedencia",
    ],
    destacado: true,
  },
  {
    id: "M5",
    nombre: "Motor de reglas y cálculos deterministas",
    funcion:
      "Ejecuta las operaciones fiscales formalizables como reglas comprobables. El agente interpreta, pregunta y explica; el motor calcula.",
    claves: [
      "Reglas versionadas por período fiscal, fórmulas reproducibles, topes, redondeo",
      "Manejo explícito de valores desconocidos, referencias normativas, pruebas unitarias",
      "Cada cifra debe poder reconstruirse desde sus entradas y operaciones",
    ],
    destacado: true,
  },
  {
    id: "M6",
    nombre: "Investigación normativa",
    funcion:
      "Busca y recupera normativa, doctrina y documentación oficial, distinguiendo fuentes vinculantes, orientaciones, conceptos interpretativos y fuentes secundarias.",
    claves: ["Cada conclusión identifica sus fuentes", "La recuperación no sustituye la comprobación de vigencia"],
  },
  {
    id: "M7",
    nombre: "Optimizador tributario legal",
    funcion:
      "Identifica alternativas lícitas que mejoren la posición tributaria. Nunca inventa deducciones, gastos ficticios ni asume requisitos cumplidos.",
    claves: [
      "Explica requisitos, evidencias, efecto económico, límites, riesgos y razón de la decisión",
      "Sin pruebas, la alternativa queda como potencial, no como beneficio confirmado",
    ],
  },
  {
    id: "M8",
    nombre: "Auditor de riesgos e inconsistencias",
    funcion:
      "Detecta omisiones, contradicciones, cifras atípicas, datos sin soporte, errores de clasificación y diferencias entre documentos y resultados.",
    claves: ["Clasifica hallazgos por severidad", "Una anomalía no es una infracción confirmada"],
  },
  {
    id: "M9",
    nombre: "Preparación de declaraciones y reportes",
    funcion:
      "Prepara borradores, cálculos, informes y estructuras de datos para el formulario correspondiente.",
    claves: [
      "El usuario ve: qué se usó, qué falta, qué reglas se aplicaron, qué validaciones corrieron, qué riesgos siguen abiertos y qué requiere aprobación humana",
    ],
  },
  {
    id: "M10",
    nombre: "Operador de herramientas y navegador (Hands)",
    funcion:
      "Ejecutor especializado reutilizando capacidades del ecosistema ALBRA compatibles con Hands: navegación, diligenciamiento y verificación con permisos explícitos.",
    claves: [
      "Ciclo: observar → identificar → actuar → verificar",
      "No inventa resultados ni afirma que algo fue presentado si solo fue preparado",
    ],
  },
  {
    id: "M11",
    nombre: "Evidencias y auditoría",
    funcion:
      "Registra datos, reglas, cálculos, decisiones, aprobaciones y acciones para poder reconstruir el procedimiento completo.",
    claves: [
      "Distingue lo calculado, lo verificado, lo aprobado por el usuario y lo ejecutado en sistema externo",
      "Protege confidencialidad; nunca guarda credenciales en registros ordinarios",
    ],
  },
];

// ---------------------------------------------------------------------------
// 7 ESTADOS OBLIGATORIOS DEL PROCEDIMIENTO (Prompt Maestro §8)
// ---------------------------------------------------------------------------
export interface EstadoDeclaracion {
  n: number;
  estado: string;
  definicion: string;
}

export const estadosDeclaracion: EstadoDeclaracion[] = [
  { n: 1, estado: "INCOMPLETO", definicion: "Falta información necesaria." },
  { n: 2, estado: "PREPARADO", definicion: "Existe un borrador generado." },
  { n: 3, estado: "VALIDADO", definicion: "Se ejecutaron las comprobaciones previstas y se documentaron los resultados." },
  { n: 4, estado: "APROBADO", definicion: "El usuario autorizó la siguiente etapa correspondiente." },
  { n: 5, estado: "DILIGENCIADO", definicion: "Los datos se incorporaron al sistema oficial, cuando ese paso se haya realizado y comprobado." },
  { n: 6, estado: "PRESENTADO", definicion: "Existe evidencia verificable de la presentación oficial." },
  { n: 7, estado: "SOPORTADO", definicion: "Se archivaron los comprobantes y evidencias disponibles." },
];

export const reglaInnegociableEstados =
  "Diligenciar no significa presentar. Guardar no significa firmar. Una pantalla de confirmación no sustituye el comprobante oficial. Ningún LLM puede cambiar un estado por conveniencia narrativa: cada transición exige requisitos y evidencia.";

// ---------------------------------------------------------------------------
// CLONEAKIT REAL (analizado desde ClonaKit.zip v0.1.0)
// ---------------------------------------------------------------------------
export const cloneakitFicha = {
  nombre: "ClonaKit",
  version: "0.1.0",
  licencia: "MIT (ClonaKit © 2026 Divisual Project) · dependencia REA también MIT",
  origen: "Regalo de Divisual Project Academy (divisualproject.academy)",
  esencia:
    "Kit que convierte a Claude Code en tutor para crear tu propia versión de las apps que usas en un negocio, de forma legal y sin saber programar. No es un framework de agentes ni un motor tributario: es un conjunto de herramientas de investigación + método de sala limpia + recetas con demos.",
  motorInvestigacion:
    "REA (rea-agents 6.4.0, de morluto, MIT): averigua cómo está construida una app SIN ver su código — analiza binarios, paquetes, permisos, frameworks, librerías y plugins, y produce un informe en lenguaje sencillo.",
  requisitos: "Node.js LTS (^22.19 || ^24.11 || >=26), Git, Claude Code (cuenta de pago), Chrome opcional para webs.",
};

export const cloneakitHerramientas = [
  {
    comando: "npm run investigar -- \"<app o URL>\" --nombre <clon>",
    script: "herramientas/investigar.mjs",
    queHace:
      "Analiza la app con REA y escribe clones/<clon>/investigacion/informe.md: tipo de app, permisos, piezas del sistema, librerías, plugins y pistas de arquitectura. Guarda datos en bruto en datos/ (nunca se publican).",
  },
  {
    comando: "npm run capturas -- <clon>",
    script: "herramientas/capturas.mjs",
    queHace:
      "Prepara clones/<clon>/investigacion/capturas/ para el modo capturas: investigar apps con inicio de sesión a partir de capturas de pantalla que hace la persona.",
  },
  {
    comando: "npm run probar -- <clon>",
    script: "herramientas/probar.mjs",
    queHace: "Sirve clones/<clon>/app/ en http://localhost:3000 (puertos 3000–3010) para probar el clon en el navegador.",
  },
  {
    comando: "npm run comprobar",
    script: "herramientas/comprobar.mjs",
    queHace: "Revisa que el ordenador tiene Node.js, Git, REA, Chrome y GitHub CLI correctamente instalados.",
  },
  {
    comando: "npm run diapositivas",
    script: "herramientas/diapositivas.mjs",
    queHace: "Abre la formación exprés (formacion/diapositivas.html) de 5 minutos.",
  },
];

export const cloneakitComandos = [
  { cmd: "/empezar", hace: "Formación exprés + comprobar el ordenador + primer contacto con un clon." },
  { cmd: "/clonar", hace: "De una receta o cualquier app a tu propia versión funcionando (investigar → ficha → construir → probar)." },
  { cmd: "/desplegar", hace: "Publicar en Git, GitHub y Vercel, y actualizarla después." },
];

export const metodoSalaLimpia = {
  principio:
    "Investigar y construir son fases separadas. Quien escribe el código solo ve la FICHA.md (especificación funcional con palabras propias del usuario), nunca la app original ni el informe de investigación.",
  estructura: [
    { carpeta: "clones/<clon>/investigacion/", contenido: "informe.md, datos/ en bruto de REA, capturas/ y observaciones.md — NUNCA se publica", sePublica: false },
    { carpeta: "clones/<clon>/FICHA.md", contenido: "Especificación funcional escrita con palabras propias — único insumo del constructor", sePublica: true },
    { carpeta: "clones/<clon>/CONSTRUCCION.md", contenido: "Nota de los ayudantes entre etapas de construcción — no se publica", sePublica: false },
    { carpeta: "clones/<clon>/app/", contenido: "El código: lo único que se sube a GitHub y Vercel", sePublica: true },
  ],
  reglas: [
    "No copiar nada protegido: ni código, ni textos, ni imágenes, iconos, sonidos, nombres o logos.",
    "No reproducir lo que REA muestre (pseudocódigo, scripts, nombres internos de funciones).",
    "Nombre e identidad propios; «Inspirado en X» está bien, usar la marca de X no.",
    "Nunca ayudar a saltarse pagos, licencias, DRM, logins ni protecciones.",
    "Si el original es open source, se estudia pero por defecto no se copia su código: cumplir la licencia (p. ej. GPL exige publicar).",
    "Antes de cada git add, revisar git status para no subir investigación/ ni .env.",
  ],
};

export const cloneakitRecetas = [
  { nombre: "MiEnlace (enlaces-bio)", inspirada: "Linktree", dificultad: 1, nota: "Página de enlaces para la bio. La más sencilla." },
  { nombre: "Columnas (tablero-tareas)", inspirada: "Trello", dificultad: 2, nota: "Tablero de tareas por fases." },
  { nombre: "Pregunta (formularios)", inspirada: "Typeform", dificultad: 2, nota: "Formularios con webhook a n8n/Make/Zapier." },
  { nombre: "Corrillo (chat-equipo)", inspirada: "Slack", dificultad: 2, nota: "Chat por canales e hilos (demo un dispositivo)." },
  { nombre: "Taller (editor-codigo-ia)", inspirada: "Google Antigravity", dificultad: 2, nota: "Editor web con misiones para IA." },
  { nombre: "MiniEstudio (estudio-grabacion)", inspirada: "OBS Studio", dificultad: 2, nota: "Ya construida como ejemplo completo del kit, con informe de investigación real." },
  { nombre: "Trazo (pizarra-flujos)", inspirada: "Excalidraw", dificultad: 3, nota: "Pizarra de diagramas con exportación." },
  { nombre: "Celda (base-datos-visual)", inspirada: "Airtable", dificultad: 3, nota: "Base visual con vistas tabla/tablero/galería." },
  { nombre: "Embudo (email-marketing)", inspirada: "ActiveCampaign", dificultad: 3, nota: "Contactos, emails y secuencias (no envía de verdad)." },
];

export const cloneakitFormacion = [
  "00 · Bienvenida",
  "01 · Prepara tu ordenador",
  "02 · Lo legal",
  "03 · Investigar una app",
  "04 · De la ficha al código",
  "05 · Probar en local",
  "06 · Git y GitHub",
  "07 · Desplegar en Vercel",
  "08 · Dominio y actualizaciones",
  "+ Glosario en español",
];

// Cómo se usará CloneaKit en ALBRA: mapeo Fases A–D (Prompt Maestro §4) ↔ herramientas reales
export const cloneakitUsoAlbra = [
  {
    fase: "A · Investigación de referentes",
    como: "npm run investigar contra los repos/productos prioritarios (open-renta, Finance Substrate, renta-facil…) y el modo capturas para las plataformas comerciales con login (Justi, Tributi, Taxon…).",
    aporta: "Informes en lenguaje sencillo de cada referente: qué usa, qué permisos pide, cómo está montado, sin fiarse solo del README comercial.",
  },
  {
    fase: "B · Ingeniería inversa funcional",
    como:
      "Los informes de REA alimentan el análisis de 11 preguntas por referente: problema que resuelve, capacidades reales, arquitectura, limitaciones, riesgos, pruebas, licencia, qué adoptar, qué hacer distinto y qué descartar.",
    aporta: "Evidencia técnica verificada que separa funcionalidad anunciada de funcionalidad real, y prototipo de sistema apto para datos tributarios reales.",
  },
  {
    fase: "C · Matriz de aprovechamiento",
    como:
      "Cada hallazgo se registra con los 9 campos obligatorios: referente, capacidad, evidencia, valor para ALBRA, riesgos, licencia verificada, decisión (adoptar/adaptar/inspirarse/descartar), destino en el chaleco y validación.",
    aporta: "Evita integrar componentes por moda o semejanza superficial. La regla de sala limpia de CloneaKit refuerza las reglas de licencias del prompt (§10).",
  },
  {
    fase: "D · Construcción original",
    como:
      "Se construye desde las decisiones de la matriz, como los clones de CloneaKit se construyen desde su FICHA.md: código original, sin copiar repos completos ni acumular fragmentos incompatibles.",
    aporta: "Un chaleco coherente con la arquitectura ALBRA, con reutilización legal y técnicamente segura, y soluciones originales donde son más adecuadas.",
  },
];

// ---------------------------------------------------------------------------
// MATRIZ DE APROVECHAMIENTO (Prompt Maestro §4 Fase C, poblada con los
// hallazgos verificados del Informe Maestro §2–§7 y §10–§15)
// ---------------------------------------------------------------------------
export type DecisionMatriz = "adoptar" | "adaptar" | "inspirarse" | "descartar";

export interface FilaMatriz {
  referente: string;
  url: string;
  capacidad: string;
  evidencia: string;
  valor: string;
  riesgos: string;
  licencia: string;
  decision: DecisionMatriz;
  destino: string;
  validacion: string;
}

export const decisionLabels: Record<DecisionMatriz, string> = {
  adoptar: "ADOPTAR",
  adaptar: "ADAPTAR",
  inspirarse: "INSPIRARSE",
  descartar: "DESCARTAR",
};

export const matrizAprovechamiento: FilaMatriz[] = [
  {
    referente: "open-renta",
    url: "https://github.com/Riskbreaker2077/open-renta",
    capacidad: "Motor determinista del Formulario 210 en Python con memoria de cálculo trazable",
    evidencia:
      "README declara 56 pruebas sobre 5 casos de referencia; cálculo 100% en código (el LLM no hace la aritmética fiscal); sin credenciales DIAN ni automatización de MUISCA; LICENSE MIT verificada en el archivo LICENSE del repo.",
    valor: "Base conceptual del motor F210 de ALBRA: reglas versionadas, memoria de cálculo y hoja de digitación.",
    riesgos:
      "Las pruebas no demuestran cobertura fiscal completa; parámetros por año sin contrastar con normas oficiales; dependencias y licencias transitivas por auditar; sin paridad contra contador.",
    licencia: "MIT verificada",
    decision: "adoptar",
    destino: "Módulo 5 · Motor de reglas y cálculos deterministas",
    validacion:
      "Auditoría reproducible (commit + dependencias), ejecución de sus 56 pruebas, contraste de parámetros con DIAN y pruebas de paridad contra declaraciones revisadas por contador público.",
  },
  {
    referente: "Finance Substrate (broomva/skills)",
    url: "https://github.com/broomva/skills/tree/main/skills/finance/finance-substrate",
    capacidad: "Finanzas personales longitudinales conectadas a proyección tributaria y diligenciamiento F210",
    evidencia:
      "Scripts fill_form210.py y tax_projection.py inspeccionados; asistente MUISCA de 15 pasos; registro de movimientos, certificados, historial y proyección.",
    valor: "Modelo de datos para el expediente financiero permanente y patrón de automatización de navegador.",
    riesgos:
      "Asigna respuestas «No» automáticas (residencia fiscal, contabilidad, convenios, condición personal) que deben confirmarse con el contribuyente; casilla de deudas predeterminada en cero; mapeo sin cobertura completa; navegador con sesiones autenticadas sensibles.",
    licencia: "MIT en el repo padre (revisar dependencias)",
    decision: "adaptar",
    destino: "Módulo 4 · Expediente financiero longitudinal",
    validacion:
      "Revisión del mapeo de casillas + ejecución con datos sintéticos verificando que ninguna respuesta fiscal se asume: todo dato desconocido queda pendiente de confirmación del usuario.",
  },
  {
    referente: "Tributi / Clara",
    url: "https://www.tributi.com/",
    capacidad: "Entrevista conversacional adaptativa conectada a un motor tributario propio",
    evidencia:
      "Producto comercial activo; Clara integrada con ChatGPT/Claude; integración MCP publicada en mcp.tributi.com/mcp (permisos y condiciones actuales por verificar).",
    valor: "Separación agente ↔ motor tributario: el agente entrevista y recopila, la tecnología fiscal calcula.",
    riesgos: "Producto cerrado: no hay código auditable; condiciones del MCP no verificadas con el proveedor.",
    licencia: "Propietaria (no reutilizable)",
    decision: "inspirarse",
    destino: "Módulos 1–2 · Identidad/orquestación y perfil económico",
    validacion: "Prototipo propio de entrevista adaptativa que solo pregunta lo faltante y nunca asume valores.",
  },
  {
    referente: "Justi",
    url: "https://justitax.com/",
    capacidad: "Experiencia de usuario para el contribuyente: lectura IA de certificados, explicación de casillas y optimización de deducciones",
    evidencia:
      "Sitio comercial y pricing verificados (estándar $120.000 / exprés $200.000 / experto $220.000 COP); discrepancia contractual detectada sobre la presentación ante la DIAN.",
    valor: "Referencia de entrevista conversacional, explicación tributaria y optimización de beneficios.",
    riesgos:
      "Presentación automática anunciada pero términos previos asignaban la presentación al usuario: requiere confirmación escrita antes de atribuirle la capacidad.",
    licencia: "Propietaria",
    decision: "inspirarse",
    destino: "Módulos 2 y 7 · Perfil económico y optimizador legal",
    validacion: "Matriz de beneficios propios validada contra normativa vigente por período fiscal.",
  },
  {
    referente: "Taxon",
    url: "https://taxon.co/",
    capacidad: "Cálculo por casilla + extensión de Chrome que escribe y verifica valores en MUISCA",
    evidencia:
      "Producto comercial con precios localizados (~$90.000 / ~$160.000 COP por temporada); su documentación indica que la extensión escribe y verifica pero NO firma, presenta ni paga.",
    valor: "Patrón para el operador de navegador de ALBRA: escribir → releer → comparar → evidenciar.",
    riesgos: "Dependencia de la UI de MUISCA (cambios rompen la automatización); precios por confirmar en temporada vigente.",
    licencia: "Propietaria",
    decision: "inspirarse",
    destino: "Módulo 10 · Operador de herramientas y navegador",
    validacion: "Piloto controlado con datos sintéticos: ciclo observar → identificar → actuar → verificar, sin acciones sensibles.",
  },
  {
    referente: "Contadia",
    url: "https://www.contadia.com/",
    capacidad: "Gestión de cartera de declarantes con conexión automatizada a MUISCA",
    evidencia:
      "Plan ilimitado 2025 localizado ($270.000 COP/año gravable); la web anuncia presentación directa en MUISCA, capacidad no verificada de forma independiente.",
    valor: "Referencia para expedientes fiscales, gestión de múltiples declaraciones y flujo operativo de contadores.",
    riesgos:
      "Presentación directa anunciada sin verificación técnica de autorizaciones, tratamiento de errores ni recuperación ante fallos.",
    licencia: "Propietaria",
    decision: "inspirarse",
    destino: "Módulo 9 · Preparación de declaraciones y reportes",
    validacion: "El flujo diligenciar → presentar → comprobante se modela con estados verificables (§8 del Prompt Maestro).",
  },
  {
    referente: "Counti",
    url: "https://counti.co/",
    capacidad: "Copiloto de IA para contadores: estación de trabajo con motor F210, auditoría y normativa",
    evidencia:
      "Sitio promociona declaraciones desde $5.000 COP y prueba de 7 días; capacidades publicadas sin auditoría independiente.",
    valor: "Integración de gestión de clientes, consultas tributarias y herramientas auxiliares en una estación de trabajo.",
    riesgos:
      "Cifras de usuarios, precisión y seguridad publicadas sin auditoría; no debe suponerse presentación automática en MUISCA.",
    licencia: "Propietaria",
    decision: "inspirarse",
    destino: "Módulos 6 y 8 · Investigación normativa y auditor de riesgos",
    validacion: "Consultas normativas propias siempre con fuente oficial vinculante identificada (norma, fecha, artículo).",
  },
  {
    referente: "TribAI",
    url: "https://tribai.co/declaracion",
    capacidad: "OCR/extracción documental + F210 + XML para DIAN + optimización y escenarios",
    evidencia:
      "Planes publicados (PN $79.900 / Pro $149.900 COP); exportación PDF/Excel/CSV y XML anunciadas; presentación en MUISCA no verificada.",
    valor: "Combinación de extracción documental, preparación del F210 y análisis de riesgos de fiscalización.",
    riesgos: "Generar XML no demuestra presentación automática; planes por verificar antes de comparación final.",
    licencia: "Propietaria",
    decision: "inspirarse",
    destino: "Módulo 3 · Ingestión documental",
    validacion: "Extracción IA con trazabilidad al fragmento del documento origen y corrección manual siempre disponible.",
  },
  {
    referente: "renta-facil",
    url: "https://github.com/emunozd/renta-facil",
    capacidad: "Bot de Telegram con entrevista, extracción IA visual y borrador Excel del F210",
    evidencia: "Repo inspeccionado: RAG sobre documentos DIAN, modelo local, cálculos en Python; sin archivo LICENSE en la raíz.",
    valor: "Patrones conceptuales de entrevista conversacional y procesamiento documental (no su código).",
    riesgos: "Sin licencia verificable: copia comercial prohibida; permisos amplios en instrucciones de instalación; solo un año gravable.",
    licencia: "Sin licencia (todos los derechos reservados por defecto)",
    decision: "descartar",
    destino: "Ninguno como código — patrones absorbidos con implementación original",
    validacion: "n/a: no se integra su código; solo se estudia el patrón de interacción.",
  },
  {
    referente: "renta-declaracion",
    url: "https://github.com/estebanduse-ai-data/renta-declaracion",
    capacidad: "Aplicación completa de gestión de declarantes y liquidación (FastAPI + React + PostgreSQL)",
    evidencia:
      "ESTADO_ACTUAL.md, RIESGOS.md y PLAN_DE_TRABAJO.md públicos; su propia documentación reconoce riesgo de presentar antes de demostrar paridad.",
    valor: "Referencia de arquitectura de gestión tributaria y de documentación honesta de riesgos.",
    riesgos: "Licencia formal pendiente; diferencias con el Excel contable; protección de NIT y datos patrimoniales.",
    licencia: "Pendiente / derechos reservados",
    decision: "descartar",
    destino: "Ninguno como código — solo referencia arquitectónica",
    validacion: "n/a: no se integra su código sin autorización escrita del titular.",
  },
  {
    referente: "Terminal Tax MCP Server",
    url: "https://github.com/terminaltax/terminal-tax-mcp-server",
    capacidad: "Interfaz MCP con flujo de revisión y aprobación antes de la presentación",
    evidencia: "Servidor MCP público con LICENSE MIT verificada; la plataforma completa no es open source.",
    valor: "Patrón de separación preparación ↔ autorización ↔ presentación controlada.",
    riesgos: "Lógica fiscal de EE. UU. no trasladable a Colombia; solo el servidor es MIT.",
    licencia: "MIT (solo el servidor)",
    decision: "inspirarse",
    destino: "Módulos 9 y 11 · Preparación, aprobaciones y evidencias",
    validacion: "Ciclo de estados del chaleco con transiciones que exigen requisito + evidencia.",
  },
  {
    referente: "OpenAccountants",
    url: "https://github.com/openaccountants/openaccountants",
    capacidad: "Base de conocimiento tributario estructurado con guías y herramientas para agentes",
    evidencia: "Repo con corpus tributario y herramientas de recuperación; código reportado bajo AGPL-3.0.",
    valor: "Organización de conocimiento normativo (el corpus NO se copia).",
    riesgos:
      "AGPL puede imponer obligaciones si se ofrece como servicio; las guías/contenido pueden tener licencia distinta restrictiva.",
    licencia: "AGPL-3.0 (código) + contenido con licencia por confirmar",
    decision: "descartar",
    destino: "Ninguno — el Módulo 6 se construye con fuentes oficiales DIAN",
    validacion: "n/a: no copiar corpus a RAG comercial sin resolver licencias primero.",
  },
];

// Resumen de decisiones de la matriz (para el strip del tab CloneaKit)
export const matrizResumen = {
  adoptar: matrizAprovechamiento.filter((f) => f.decision === "adoptar").length,
  adaptar: matrizAprovechamiento.filter((f) => f.decision === "adaptar").length,
  inspirarse: matrizAprovechamiento.filter((f) => f.decision === "inspirarse").length,
  descartar: matrizAprovechamiento.filter((f) => f.decision === "descartar").length,
  nota:
    "Regla de la matriz: nadie se integra por moda o popularidad. Cada adopción exige evidencia verificada, licencia resuelta, destino en el chaleco y prueba de validación.",
};

export const cloneakitLimites = [
  "CloneaKit no calcula impuestos ni contiene nada contable: su dominio es investigar y recrear apps de negocio.",
  "Sus recetas son web estáticas HTML+CSS+JS; no definen la tecnología del chaleco ALBRA (esa decide el repositorio real de AGENTE-GENERAL).",
  "No reemplaza la auditoría fiscal: ejecuta pruebas de paridad contra casos revisados por contador público sigue siendo requisito del Prompt Maestro (Fase 5).",
  "El método sala limpia SÍ se adopta tal cual: investigar (REA) y construir (ficha → código) permanecen separados para cumplir licencias.",
  "Para ALBRA se usan las herramientas y el método, no el tutor conversacional ni la publicación en Vercel de recetas.",
];

// ---------------------------------------------------------------------------
// COMPETENCIA COMERCIAL COLOMBIANA (Informe Maestro §2–§3, datos exactos)
// ---------------------------------------------------------------------------
export type CapStatus = "si" | "no" | "parcial" | "aclarar";

export interface Competitor {
  id: string;
  name: string;
  site: string;
  market: string;
  f210: CapStatus;
  docs: CapStatus;
  aiChat: CapStatus;
  muisca: CapStatus;
  muiscaNote: string;
  priceRange: string;
  plans: { plan: string; price: string; note?: string }[];
  highlights: string[];
  observation: string;
  valueForAlbra: string;
  color: string;
}

export const competitors: Competitor[] = [
  {
    id: "justi",
    name: "Justi",
    site: "https://justitax.com/",
    market: "Personas naturales",
    f210: "si",
    docs: "si",
    aiChat: "si",
    muisca: "aclarar",
    muiscaNote:
      "La web anuncia presentación ante la DIAN, pero términos contractuales previos describían entrega de borrador y presentación por el usuario. Requiere confirmación escrita.",
    priceRange: "$120K – $220K",
    plans: [
      { plan: "Estándar", price: "$120.000" },
      { plan: "Exprés", price: "$200.000" },
      { plan: "Con experto", price: "$220.000" },
    ],
    highlights: [
      "Lectura IA de certificados 220, exógena y facturación electrónica",
      "Preparación F210 + optimización de deducciones y beneficios",
      "Explicación de casillas y auditoría de riesgos",
      "Borrador de declaración + agente conversacional",
      "Modalidad con experto tributario",
    ],
    observation:
      "Precios para año gravable 2025 / temporada 2026: confirmar antes de una comparación comercial definitiva.",
    valueForAlbra:
      "Referencia de UX: lectura de documentos, entrevista conversacional, explicación tributaria y optimización de deducciones.",
    color: "#00E676",
  },
  {
    id: "tributi",
    name: "Tributi / Clara",
    site: "https://www.tributi.com/",
    market: "Personas naturales",
    f210: "si",
    docs: "si",
    aiChat: "si",
    muisca: "parcial",
    muiscaNote: "La presentación depende de la modalidad contratada.",
    priceRange: "$0 – $550K",
    plans: [
      { plan: "Clara con impuesto a pagar", price: "Gratis", note: "$170.000 si queda en cero o saldo a favor" },
      { plan: "App sin afán", price: "$170.000" },
      { plan: "App exprés", price: "$470.000" },
      { plan: "Experto sin afán", price: "$250.000" },
      { plan: "Experto exprés", price: "$550.000" },
    ],
    highlights: [
      "Agente conversacional Clara integrable con ChatGPT o Claude",
      "Preguntas adaptativas y solicitud de documentos",
      "Cálculo con tecnología tributaria propia",
      "Integración MCP publicada: https://mcp.tributi.com/mcp",
    ],
    observation:
      "Disponibilidad, permisos y condiciones de la integración MCP deben verificarse directamente con el proveedor.",
    valueForAlbra:
      "El referente clave para separar agente conversacional de motor tributario: Clara entrevista y recopila; la tecnología fiscal calcula.",
    color: "#22D3EE",
  },
  {
    id: "taxon",
    name: "Taxon",
    site: "https://taxon.co/",
    market: "Contadores",
    f210: "si",
    docs: "si",
    aiChat: "parcial",
    muisca: "parcial",
    muiscaNote:
      "Extensión de Chrome que escribe y verifica campos en MUISCA, pero NO firma, NO presenta, NO paga: el usuario revisa y presenta.",
    priceRange: "$0 – $160K",
    plans: [
      { plan: "Gratuito limitado", price: "$0" },
      { plan: "Estándar", price: "~$90.000", note: "Por temporada" },
      { plan: "Completo", price: "~$160.000", note: "Por temporada" },
    ],
    highlights: [
      "Importación de información exógena",
      "Cálculos por casilla con explicación de fórmulas y normas",
      "Optimización tributaria y gestión de clientes",
      "Extensión Chrome con verificación de valores introducidos",
    ],
    observation: "Precios aproximados localizados durante la investigación; comprobar la temporada vigente.",
    valueForAlbra:
      "Referencia especialmente útil para la futura integración entre el motor tributario y las manos de navegador (Hands) de ALBRA.",
    color: "#F59E0B",
  },
  {
    id: "contadia",
    name: "Contadia",
    site: "https://www.contadia.com/",
    market: "Contadores",
    f210: "si",
    docs: "si",
    aiChat: "parcial",
    muisca: "aclarar",
    muiscaNote:
      "Anuncia presentación directa en MUISCA, pero no se realizó presentación de prueba: mecanismo técnico, autorizaciones, errores y recuperación sin verificar.",
    priceRange: "$270K / año",
    plans: [{ plan: "Ilimitado AG 2025", price: "$270.000", note: "Por año gravable; primera declaración gratis anunciada" }],
    highlights: [
      "Gestión de declarantes y expedientes fiscales",
      "Procesamiento de exógena y lectura de certificados",
      "Conexión automatizada con MUISCA",
      "Soporte de expertos y múltiples declaraciones",
    ],
    observation: "Capacidad anunciada por el proveedor, no auditada de forma independiente.",
    valueForAlbra:
      "Referencia para gestión de carteras de clientes, expedientes fiscales y automatización operativa para contadores.",
    color: "#A78BFA",
  },
  {
    id: "counti",
    name: "Counti",
    site: "https://counti.co/",
    market: "Contadores",
    f210: "si",
    docs: "si",
    aiChat: "si",
    muisca: "no",
    muiscaNote: "No debe suponerse presentación automática: no está documentada.",
    priceRange: "Desde $5.000",
    plans: [
      { plan: "Declaraciones desde", price: "$5.000", note: "Qué plan lo incluye y límites: sin confirmar" },
      { plan: "Prueba gratuita", price: "7 días" },
    ],
    highlights: [
      "Copiloto de IA para contadores colombianos",
      "Lectura de certificados 220, exógena y facturación electrónica",
      "Motor tributario F210 + auditoría de riesgos",
      "Normativa, calendario, calculadoras de IVA y retención, informes",
    ],
    observation:
      "Cifras de usuarios, precisión y seguridad publicadas por el proveedor no han sido auditadas independientemente.",
    valueForAlbra:
      "Referencia para integrar gestión de clientes, consultas, preparación de declaraciones y herramientas auxiliares en una misma estación de trabajo.",
    color: "#FB7185",
  },
  {
    id: "tribai",
    name: "TribAI",
    site: "https://tribai.co/declaracion",
    market: "Personas naturales y profesionales",
    f210: "si",
    docs: "si",
    aiChat: "si",
    muisca: "parcial",
    muiscaNote:
      "Genera XML para DIAN, pero el XML por sí solo no demuestra presentación automática en MUISCA.",
    priceRange: "$0 – $149.9K",
    plans: [
      { plan: "Gratuito", price: "$0", note: "Análisis limitado + vista parcial del F210" },
      { plan: "Declaración PN", price: "$79.900" },
      { plan: "Declaración Pro", price: "$149.900" },
    ],
    highlights: [
      "Análisis de documentos con OCR y extracción IA",
      "Preparación F210 con exportación PDF, Excel, CSV y XML DIAN",
      "Sugerencias de optimización y comparación de escenarios",
      "Consulta con recuperación de información y referencias normativas",
      "Análisis de riesgos de fiscalización",
    ],
    observation: "Planes y precios por verificar antes de la comparación comercial final.",
    valueForAlbra:
      "Combina preparación F210, extracción documental, optimización y consulta normativa en un competidor adicional relevante.",
    color: "#34D399",
  },
];

export const otrosProveedores = [
  { name: "Tributa Bien", site: "https://www.tributa.com.co/", note: "Servicios tributarios con IA + asistencia humana. Sin precio público comparable." },
  { name: "Finantic", site: "https://finantic.com.co/", note: "Soluciones financieras y contables." },
  { name: "Finark", site: "https://www.finark.net/", note: "Herramientas financieras y contables." },
  { name: "Siigo", site: "https://www.siigo.com/", note: "Software contable y de gestión empresarial." },
  { name: "NETSOLIN", site: "https://www.netsolin.com/", note: "Soluciones contables y tecnológicas." },
];

export const conclusionComercial =
  "Cada proveedor resuelve una parte: Justi la experiencia del contribuyente; Tributi/Clara el agente conversacional sobre tecnología tributaria; Taxon el motor de cálculo + navegador; Contadia la gestión operativa; Counti la estación de trabajo de IA para contadores; TribAI la preparación documental. La oportunidad de ALBRA es integrar esas capacidades en un sistema financiero y tributario permanente.";

// ---------------------------------------------------------------------------
// GITHUB COLOMBIA (Informe Maestro §4, veredictos exactos)
// ---------------------------------------------------------------------------
export interface RepoCOL {
  name: string;
  url: string;
  aporte: string;
  licencia: string;
  licenciaStatus: "verificada" | "reportada" | "sin-licencia" | "pendiente";
  recomendacion: string;
  nivel: "primero" | "segundo" | "secundaria" | "auditar" | "no-copiar";
  detalle: string;
  riesgos?: string[];
}

export const reposColombia: RepoCOL[] = [
  {
    name: "open-renta",
    url: "https://github.com/Riskbreaker2077/open-renta",
    aporte: "Motor F210 determinista en Python con memoria de cálculo trazable",
    licencia: "MIT",
    licenciaStatus: "verificada",
    recomendacion: "Auditar primero",
    nivel: "primero",
    detalle:
      "Procesa exógena, organiza el expediente tributario, calcula de forma determinista, genera informes, réplica visual del F210, hoja de digitación, parámetros por año, validaciones, optimización de beneficios y pruebas automatizadas (56 pruebas sobre 5 casos de referencia declaradas en el README). Declara no solicitar credenciales DIAN ni automatizar MUISCA. Principio arquitectónico: el LLM no hace la aritmética fiscal.",
    riesgos: [
      "Las pruebas existentes no demuestran cobertura completa de todas las situaciones fiscales",
      "Parámetros por año deben contrastarse con normas oficiales",
      "Auditar dependencias y licencias transitivas",
      "Requiere pruebas de paridad contra declaraciones revisadas por contador",
    ],
  },
  {
    name: "Finance Substrate (broomva/skills)",
    url: "https://github.com/broomva/skills/tree/main/skills/finance/finance-substrate",
    aporte: "Finanzas personales longitudinales + proyección + automatización F210",
    licencia: "MIT",
    licenciaStatus: "reportada",
    recomendacion: "Estudiar y corregir supuestos",
    nivel: "segundo",
    detalle:
      "Organiza información financiera personal y la conecta con la preparación tributaria: registro de movimientos, gestión de documentos, lectura de certificados, procesamiento DIAN, historial, proyección de impuestos, planes de diligenciamiento y asistente MUISCA de 15 pasos. Script fill_form210.py genera comandos de diligenciamiento desde una proyección; tax_projection.py proyecta impuestos.",
    riesgos: [
      "Asigna automáticamente respuestas «No» (residencia fiscal, contabilidad, convenios, condición personal) que deben confirmarse con el contribuyente",
      "Casilla de deudas aparece con valor predeterminado cero, no incorporada a la proyección",
      "Mapeo de campos sin cobertura completa demostrada",
      "Usa navegador autenticado con sesiones sensibles; cobertura de firma/presentación sin auditar",
    ],
  },
  {
    name: "renta-facil",
    url: "https://github.com/emunozd/renta-facil",
    aporte: "Bot conversacional de Telegram + extracción IA visual + borrador Excel",
    licencia: "Sin licencia",
    licenciaStatus: "sin-licencia",
    recomendacion: "No copiar sin permiso del titular",
    nivel: "no-copiar",
    detalle:
      "Guía al contribuyente por el F210: análisis de exógena, recopilación de documentos, preguntas sobre dependientes y vivienda, cálculos en Python, modelo local con RAG sobre documentos DIAN y borrador en Excel. La IA extrae y explica; la lógica tributaria está en código.",
    riesgos: ["Sin LICENSE verificable", "Permisos amplios en instrucciones de instalación", "Solo el año gravable configurado"],
  },
  {
    name: "renta-declaracion",
    url: "https://github.com/estebanduse-ai-data/renta-declaracion",
    aporte: "Aplicación completa de gestión y liquidación (FastAPI + React + PostgreSQL)",
    licencia: "Pendiente",
    licenciaStatus: "pendiente",
    recomendacion: "No reutilizar sin autorización escrita",
    nivel: "no-copiar",
    detalle:
      "Gestión de declarantes, wizard de captura, liquidación tributaria, persistencia, importación masiva, panel de administración y parámetros por año. Su propia documentación reconoce riesgos: diferencias con el Excel contable, actualización normativa, protección de NIT y datos patrimoniales, copias de seguridad y riesgo de presentar antes de demostrar paridad.",
  },
  {
    name: "asesor-dian-claude",
    url: "https://github.com/juandiegoandres/asesor-dian-claude",
    aporte: "Instrucciones de agente tributario para Claude Code",
    licencia: "MIT reportada",
    licenciaStatus: "reportada",
    recomendacion: "Referencia secundaria",
    nivel: "secundaria",
    detalle:
      "Útil como referencia para instrucciones de un agente tributario, organización de herramientas, consultas de renta e interacción modelo-herramientas. Requiere revisar código, pruebas, actividad y cobertura fiscal.",
  },
  {
    name: "Declaracion-Renta-Automated",
    url: "https://github.com/nicolasdcubillos/Declaracion-Renta-Automated",
    aporte: "Automatización de formularios F210, F160 y F490",
    licencia: "MIT reportada",
    licenciaStatus: "reportada",
    recomendacion: "Auditar antes de adoptar",
    nivel: "auditar",
    detalle: "Verificar estado actual del repositorio, cobertura de pruebas y licencia en la versión exacta a utilizar.",
  },
  {
    name: "calculadora-declaracion-renta",
    url: "https://github.com/jsowl044/calculadora-declaracion-renta",
    aporte: "Cálculo offline del F210 con importación de exógena",
    licencia: "MIT reportada",
    licenciaStatus: "reportada",
    recomendacion: "Auditar antes de adoptar",
    nivel: "auditar",
    detalle: "Actividad reciente en octubre de 2026, sin madurez productiva ni paridad fiscal independiente demostrada.",
  },
  {
    name: "contaia-colombia",
    url: "https://github.com/Jhonnymgx115/contaia-colombia",
    aporte: "Asistente contable con funciones tributarias, exógena y calendario DIAN",
    licencia: "MIT reportada",
    licenciaStatus: "reportada",
    recomendacion: "Auditar antes de adoptar",
    nivel: "auditar",
    detalle: "Revisar el LICENSE vigente, dependencias y cobertura del motor antes de usar código.",
  },
];

export const advertenciaLicencias =
  "Una licencia abierta no certifica exactitud tributaria, seguridad ni preparación para producción. Un repositorio sin licencia explícita no es de libre reutilización comercial.";

// ---------------------------------------------------------------------------
// REFERENTES INTERNACIONALES (Informe Maestro §5–§7, uso recomendado)
// ---------------------------------------------------------------------------
export const referentesInternacionales = [
  { name: "Terminal Tax MCP Server", url: "https://github.com/terminaltax/terminal-tax-mcp-server", uso: "Patrón MCP de integración, revisión y aprobación con presentación controlada. Licencia MIT del servidor; la plataforma completa no es open source." },
  { name: "Taxfill MCP", url: "https://github.com/Ryanczj0306/taxfill-mcp", uso: "Flujo de recolección, cálculo determinista y generación de documentos. Cobertura fiscal estadounidense: no reutilizar para Colombia." },
  { name: "FreeTaxUSA MCP", url: "https://github.com/schwarztim/freetaxusa-mcp", uso: "Referencia de automatización de navegador; revisar código antes de adoptar patrones. Manejo de sesión autenticada y funciones en desarrollo." },
  { name: "OpenTax (Filed)", url: "https://opentax.filed.com/", uso: "Separación de reglas fiscales y datos, cálculo determinista. AGPL-3.0: revisar impacto antes de integrar en servicio comercial." },
  { name: "OpenAccountants", url: "https://github.com/openaccountants/openaccountants", uso: "Base de conocimiento tributario con fuentes y herramientas para agentes. AGPL-3.0; el contenido puede tener otra licencia: no copiar corpus a RAG comercial sin resolver licencias." },
  { name: "OpenAccountant Skills", url: "https://github.com/openaccountant/skills", uso: "Biblioteca de habilidades financieras para agentes; revisar licencia de la versión a reutilizar." },
  { name: "India ITR Prep Skill", url: "https://github.com/NidheeshJain/itr-prep-skill", uso: "Referencia de preparación tributaria por agente (India)." },
  { name: "AU Tax Return", url: "https://github.com/kiwizznz/au-tax-return", uso: "Referencia de flujo de preparación (Australia)." },
  { name: "Spain IRPF Helper", url: "https://github.com/antonioibars/irpf-declaration-helper", uso: "Referencia de ayudante IRPF (España)." },
  { name: "Brazil MCP Fiscal", url: "https://github.com/DeHor-Labs/mcp-fiscal-brasil", uso: "Herramientas fiscales por MCP (Brasil)." },
];

export const productosInternacionales = [
  { name: "Instead", site: "https://www.instead.com/", valor: "Plataforma de agentes tributarios especializados. Desde US$30 por crédito." },
  { name: "Filed", site: "https://www.filed.com/", valor: "Trazabilidad de datos, extracción y revisión profesional para profesionales." },
  { name: "Black Ore", site: "https://blackore.ai/", valor: "Automatización de tareas de alto volumen con supervisión profesional." },
  { name: "TaxGPT", site: "https://www.taxgpt.com/", valor: "Investigación tributaria asistida y soporte a profesionales." },
  { name: "Dezu", site: "https://www.dezu.ai/", valor: "Automatización tributaria internacional." },
  { name: "UpTax", site: "https://uptax.ai/", valor: "Herramientas tributarias digitales." },
  { name: "E2E Compliance", site: "https://e2ecomply.com/", valor: "Cumplimiento tributario (mercado británico)." },
  { name: "TaxGo", site: "https://taxgo.uk/pricing", valor: "£79 una modalidad; £149 con revisión completa (confirmar oferta)." },
  { name: "Valarix", site: "https://valarix.com/", valor: "Referencia del mercado mexicano." },
  { name: "Avalara", site: "https://www.avalara.com/", valor: "Automatización internacional de impuestos, más relevante para empresas." },
  { name: "Fonoa", site: "https://www.fonoa.com/", valor: "Automatización fiscal e impuestos indirectos." },
  { name: "OpenTax", site: "https://opentax.filed.com/", valor: "Motor determinista de preparación (ver §5.4)." },
];

export const patronesTecnicos = [
  "No delegar aritmética fiscal al modelo de lenguaje.",
  "Representar dinero con tipos y reglas de redondeo controlados.",
  "Mantener libros y registros auditables.",
  "Usar herramientas específicas para operaciones contables.",
  "Exigir aprobación para operaciones sensibles.",
  "Separar consulta normativa, cálculo y ejecución.",
  "Mantener evidencia de cada modificación.",
];

export const jvzooResultado =
  "JVZoo: sin competidor directo verificable para un agente contador de personas naturales colombianas y el F210. No permite asegurar que no exista en ofertas privadas; no se asignan nombres ni precios no verificados.";

// ---------------------------------------------------------------------------
// PLAN DE CONSTRUCCIÓN POR FASES (Prompt Maestro §11, real: Fase 0–6)
// ---------------------------------------------------------------------------
export interface FasePlan {
  id: string;
  nombre: string;
  objetivo: string;
  pasos: string[];
  resultado: string;
}

export const fasesPlan: FasePlan[] = [
  {
    id: "F0",
    nombre: "Inspección del entorno",
    objetivo: "Conocer el estado real antes de escribir una línea.",
    pasos: [
      "Identificar repositorio y rama de trabajo de AGENTE-GENERAL",
      "Examinar instrucciones, pruebas, contratos, herramientas y mecanismos de extensión",
      "Comprobar capacidades reales de CloneaKit",
      "Identificar estado del árbol de trabajo y cambios preexistentes (no sobrescribir)",
    ],
    resultado: "Informe breve de situación y plan técnico adaptado al repositorio real.",
  },
  {
    id: "F1",
    nombre: "Investigación y evaluación de referentes",
    objetivo: "Convertir el informe maestro en decisiones técnicas justificadas.",
    pasos: [
      "Examinar referentes prioritarios (open-renta, Finance Substrate, renta-facil…) con CloneaKit/REA",
      "Verificar funcionalidades, código, pruebas y licencias",
      "Elaborar la matriz de aprovechamiento (9 campos: referente, capacidad, evidencia, valor, riesgos, licencia, decisión, destino, validación)",
      "Establecer qué construir, reutilizar, adaptar o descartar",
    ],
    resultado: "Decisiones técnicas justificadas y mapa de componentes.",
  },
  {
    id: "F2",
    nombre: "Diseño del arnés",
    objetivo: "Arquitectura implementable sin rediseñar el núcleo general.",
    pasos: [
      "Estructura de archivos y contratos de entrada/salida",
      "Interfaz de activación por AGENTE-GENERAL",
      "Herramientas, permisos, flujo de información y gestión del expediente",
      "Motor tributario, evidencias, gestión de errores y pruebas",
      "Estrategia de integración",
    ],
    resultado: "Arquitectura implementable, sin rediseñar innecesariamente el núcleo general.",
  },
  {
    id: "F3",
    nombre: "Construcción del núcleo funcional",
    objetivo: "Primera versión que ejecute un flujo tributario realista de principio a fin con datos de prueba.",
    pasos: [
      "Activación de la especialización + recopilación estructurada de información",
      "Gestión explícita de datos desconocidos (nunca asumir valores)",
      "Ingestión o importación de los documentos del alcance inicial",
      "Cálculos deterministas, validaciones y referencias normativas",
      "Borrador con soportes + registro de evidencias + errores y limitaciones visibles",
      "No simular integraciones ausentes para aparentar que el flujo está terminado",
    ],
    resultado: "Flujo F210 de persona natural con datos de prueba, con evidencias y límites declarados.",
  },
  {
    id: "F4",
    nombre: "Integración con AGENTE-GENERAL",
    objetivo: "Conectar el chaleco por la interfaz compatible con el repositorio real.",
    pasos: [
      "AGENTE-GENERAL puede activar la especialización",
      "Las herramientas cumplen sus contratos de entrada/salida",
      "Los permisos se respetan y los errores se manejan correctamente",
      "El núcleo general y las demás capacidades siguen funcionando (regresión)",
      "La especialización se prueba sin ejecutar acciones tributarias externas",
    ],
    resultado: "Chaleco operativo sobre el agente central, probado sin acciones externas.",
  },
  {
    id: "F5",
    nombre: "Pruebas y validación tributaria",
    objetivo: "Demostrar exactitud con casos reproducibles, nunca declararla sin evidencia.",
    pasos: [
      "Casos ordinarios, con información faltante, contradictoria, límite y de error documental",
      "Diferentes períodos fiscales, reglas y topes relevantes",
      "Recuperación después de fallo + pruebas de permisos y seguridad",
      "Regresión de AGENTE-GENERAL",
      "Comparación contra casos de referencia revisados por contador público competente y normativa oficial",
      "No marcar una prueba como aprobada si solo se ejecutó sin comprobar resultados",
    ],
    resultado: "Informe de paridad y limitaciones con evidencia verificable.",
  },
  {
    id: "F6",
    nombre: "Documentación y entrega",
    objetivo: "Que el arnés sepa instalarlo, usarlo, probarlo y mantenerlo.",
    pasos: [
      "Documentación de instalación, configuración, uso, pruebas y mantenimiento",
      "Limitaciones conocidas, componentes pendientes, fuentes normativas y versiones de reglas",
      "Instrucciones para incorporar futuras capacidades",
      "Registro de cambios de arquitectura y hallazgos en el mecanismo de contexto del proyecto",
    ],
    resultado: "Informe final obligatorio con 14 secciones y estado IMPLEMENTADO / PROBADO / VALIDADO / PENDIENTE / NO VERIFICADO.",
  },
];

// ---------------------------------------------------------------------------
// CRITERIOS DE ACEPTACIÓN (Prompt Maestro §12 — 23 ítems, 5 bloques)
// ---------------------------------------------------------------------------
export interface CriterioBloque {
  bloque: string;
  items: string[];
}

export const criteriosAceptacion: CriterioBloque[] = [
  {
    bloque: "Arquitectura",
    items: [
      "AGENTE-GENERAL conserva su identidad y su funcionamiento central",
      "CONTADOR PÚBLICO ALBRA existe como especialización modular",
      "La integración utiliza contratos e interfaces verificables",
      "Las dependencias están justificadas y documentadas",
    ],
  },
  {
    bloque: "Inteligencia especializada",
    items: [
      "El agente distingue datos confirmados, desconocidos, extraídos y calculados",
      "Puede solicitar la información faltante",
      "Puede explicar los resultados",
      "Utiliza fuentes normativas verificables",
      "No inventa requisitos, cifras ni beneficios tributarios",
    ],
  },
  {
    bloque: "Cálculo y validación",
    items: [
      "Los cálculos críticos se realizan mediante reglas deterministas cuando corresponda",
      "Las reglas están versionadas por período fiscal",
      "Los resultados se pueden reconstruir",
      "Existen pruebas reproducibles",
      "Los resultados se compararon con casos de referencia apropiados",
    ],
  },
  {
    bloque: "Operación",
    items: [
      "Los procedimientos tienen estados explícitos",
      "Se distinguen los borradores de las declaraciones presentadas",
      "Las acciones sensibles requieren las autorizaciones correspondientes",
      "Los errores no producen afirmaciones falsas de éxito",
      "Las evidencias se conservan de manera segura",
    ],
  },
  {
    bloque: "Seguridad y mantenimiento",
    items: [
      "Se revisaron licencias y dependencias",
      "Se protegieron documentos, credenciales y sesiones",
      "Existen instrucciones de configuración y uso",
      "Se documentaron las limitaciones y las funciones que todavía no están implementadas",
    ],
  },
];

export const reglaCriterios =
  "El proyecto no se considera terminado por tener estructura de carpetas, README, interfaz atractiva o un agente que responda preguntas generales. Un criterio sin evidencia se reporta como PENDIENTE, no como aprobado.";

// ---------------------------------------------------------------------------
// REGLAS DE EJECUCIÓN PARA EL CONSTRUCTOR (Prompt Maestro §13)
// ---------------------------------------------------------------------------
export const reglasEjecucion = [
  "No borrar ni sobrescribir trabajo preexistente sin justificación y autorización.",
  "No hacer cambios destructivos en AGENTE-GENERAL ni cambiar contratos externos sin revisar consumidores.",
  "No instalar dependencias innecesarias ni exponer credenciales.",
  "No usar datos reales sensibles en pruebas sin autorización y protección adecuadas.",
  "No realizar presentaciones tributarias reales ni enviar información financiera a terceros sin autorización.",
  "No crear commits, publicar versiones, hacer push, desplegar o ejecutar acciones irreversibles como consecuencia automática del trabajo.",
  "No confundir pruebas simuladas con integraciones reales.",
  "No añadir agentes independientes si sus responsabilidades se resuelven de forma más simple dentro del arnés.",
  "Ante bloqueo de seguridad, licencia incompatible, conflicto destructivo o divergencia importante: detenerse en ese punto y documentar la decisión. En los demás casos, continuar con el mejor criterio técnico.",
];

// ---------------------------------------------------------------------------
// SEGURIDAD Y RESPONSABILIDAD PROFESIONAL (Prompt Maestro §9)
// ---------------------------------------------------------------------------
export const controlesSeguridad = [
  "Permisos mínimos necesarios y separación entre datos de usuarios.",
  "Protección de documentos y credenciales; gestión segura de sesiones.",
  "Redacción de secretos en registros y validación de archivos y entradas.",
  "Restricciones sobre acciones externas y trazabilidad de operaciones sensibles.",
  "Aprobación humana antes de acciones con consecuencias legales o fiscales.",
  "Mecanismos de interrupción y recuperación segura.",
];

export const prohibicionesProfesionales = [
  "No asumir automáticamente respuestas tributarias desconocidas.",
  "No rellenar campos críticos con valores predeterminados que alteren la declaración.",
  "No presentar una estimación como resultado oficial.",
  "No afirmar que el agente es contador público humano titulado, con matrícula o que hizo revisión humana si no es cierto.",
  "Las decisiones que legalmente requieran firma de profesional habilitado se tratan conforme a la normativa aplicable.",
];

// ---------------------------------------------------------------------------
// LICENCIAS — PROCESO OBLIGATORIO (Prompt Maestro §10)
// ---------------------------------------------------------------------------
export const procesoLicencias = [
  "Identificar el repositorio de origen.",
  "Comprobar la licencia del proyecto y de los componentes relevantes.",
  "Revisar las licencias de dependencias y activos.",
  "Verificar obligaciones de atribución, distribución y publicación de modificaciones.",
  "Distinguir código, documentación, datos, modelos y contenido.",
  "Documentar el origen de cada componente reutilizado.",
  "Descartar cualquier incorporación cuya licencia no permita el uso previsto, hasta obtener autorización suficiente.",
];

export const reglasLicencias =
  "La disponibilidad pública de un repositorio NO es autorización automática para uso comercial. MIT permite uso comercial bajo sus condiciones; AGPL puede imponer obligaciones al ofrecerlo como servicio de red; cuando convenga, reproducir la idea con implementación original sin copiar código protegido.";

// ---------------------------------------------------------------------------
// INFORME FINAL OBLIGATORIO (Prompt Maestro §14 — 14 secciones)
// ---------------------------------------------------------------------------
export const informeFinal = [
  "Resumen ejecutivo: qué se construyó y cuál es su utilidad.",
  "Arquitectura final: cómo funciona el chaleco y cómo se conecta con AGENTE-GENERAL.",
  "Mapa de archivos: nuevos, modificados y su responsabilidad.",
  "Resultados de CloneaKit: referentes examinados y patrones aprovechados.",
  "Matriz de licencias: origen y condiciones de los componentes reutilizados.",
  "Capacidades implementadas, separadas de las planificadas.",
  "Pruebas ejecutadas: comandos, resultados y evidencia verificable.",
  "Validación tributaria: casos de referencia, diferencias y limitaciones.",
  "Seguridad: controles incorporados y riesgos pendientes.",
  "Integración: qué funciona realmente con AGENTE-GENERAL y qué sigue aislado.",
  "Limitaciones: funciones no implementadas, bloqueos y supuestos.",
  "Instrucciones de uso: cómo activar y probar el arnés.",
  "Próximos pasos: prioridades ordenadas por impacto y riesgo.",
  "Estado final: IMPLEMENTADO / PROBADO / VALIDADO / PENDIENTE / NO VERIFICADO.",
];

// ---------------------------------------------------------------------------
// FUENTES OFICIALES DIAN (Informe Maestro §9)
// ---------------------------------------------------------------------------
export const fuentesDian = [
  { name: "Micrositio renta PN AG 2025", url: "https://micrositios.dian.gov.co/renta-personas-naturales-ag-2025/" },
  { name: "Cómo hacer la declaración", url: "https://micrositios.dian.gov.co/renta-personas-naturales-ag-2025/como-hacer-su-declaracion/" },
  { name: "Preparación de la declaración", url: "https://micrositios.dian.gov.co/renta-personas-naturales-ag-2025/preparese-para-la-declaracion/" },
  { name: "Formulario 210 (MUISCA)", url: "https://muisca.dian.gov.co/WebDilIngresoFormRenta210/" },
  { name: "Formulario 210 v16", url: "https://muisca.dian.gov.co/WebFormRenta210v16/" },
  { name: "Trámites tributarios DIAN", url: "https://www.dian.gov.co/tramitesservicios/tramites-y-servicios/tributarios/Paginas/tramites-tributarios.aspx" },
  { name: "Normograma — Resolución 227 de 2025", url: "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0227_2025.htm" },
];

export const principiosDian = [
  "Los datos precargados por la DIAN deben verificarse.",
  "La responsabilidad de la declaración recae en el contribuyente.",
  "Un borrador no equivale a una declaración presentada.",
  "La firma y la presentación se tratan como acciones separadas.",
  "El comprobante de presentación es la evidencia de que el proceso terminó.",
];

export const alertaApiDian =
  "No se encontró evidencia de una API pública oficial de terceros para presentar automáticamente declaraciones F210. ALBRA no debe diseñarse suponiendo que existe esa API hasta confirmarlo directamente con la DIAN.";

// ---------------------------------------------------------------------------
// RIESGOS (Informe Maestro §13 + Prompt Maestro §9)
// ---------------------------------------------------------------------------
export const riesgosBloques = [
  {
    titulo: "Datos personales y financieros",
    items: [
      "Los documentos tributarios revelan ingresos, patrimonio, cuentas y dependientes.",
      "Definir: cifrado, control de acceso, retención y borrado, gestión de incidentes.",
      "Tratamiento de datos personales, protección de credenciales, aislamiento de sesiones autenticadas y auditoría de accesos.",
    ],
  },
  {
    titulo: "Licencias",
    items: [
      "MIT: uso comercial generalmente permitido bajo sus condiciones.",
      "AGPL: obligaciones relevantes al distribuir u ofrecer como servicio de red (OpenTax, OpenAccountants).",
      "Sin licencia explícita (renta-facil) o pendiente (renta-declaracion): no reutilizar comercialmente.",
      "La licencia del código puede diferir de la de documentos, corpus y guías incluidos.",
    ],
  },
  {
    titulo: "Exactitud tributaria",
    items: [
      "Requisito antes de declaraciones reales: casos sintéticos, casos revisados por contadores, pruebas de paridad, casos límite.",
      "Validación de cada año gravable y revisión de normas oficiales.",
      "Auditoría de parámetros y dependencias; pruebas de recuperación ante fallos.",
      "Una licencia abierta no certifica exactitud ni preparación para producción.",
    ],
  },
];

// ---------------------------------------------------------------------------
// COMPARACIÓN ARQUITECTÓNICA (Informe Maestro §10)
// ---------------------------------------------------------------------------
export const comparacionArquitectonica = [
  { componente: "Motor determinista F210", referencia: "open-renta", decision: "Auditar y evaluar reutilización" },
  { componente: "Contabilidad personal longitudinal", referencia: "Finance Substrate", decision: "Estudiar modelo de datos y fuentes" },
  { componente: "Entrevista conversacional", referencia: "Tributi/Clara y Justi", decision: "Diseñar preguntas adaptativas" },
  { componente: "Gestión de clientes", referencia: "Contadia y renta-declaracion", decision: "Estudiar flujos y expedientes" },
  { componente: "Automatización de navegador", referencia: "Taxon y Finance Substrate", decision: "Adoptar patrones seguros" },
  { componente: "Consulta normativa", referencia: "Counti y OpenAccountants", decision: "Construir conocimiento con fuentes oficiales y licencias claras" },
  { componente: "Aprobación de presentación", referencia: "Terminal Tax y Taxfill", decision: "Separar preparación y autorización" },
  { componente: "Seguridad y trazabilidad", referencia: "Patrones de contabilidad auditable", decision: "Aplicar controles de ALBRA y Hands" },
];

// ---------------------------------------------------------------------------
// PILARES Y PRÓXIMO PASO (Informe Maestro §15)
// ---------------------------------------------------------------------------
export const pilares = [
  {
    n: 1,
    titulo: "Contabilidad personal permanente",
    detalle: "Expediente financiero longitudinal con ingresos, patrimonio, deudas, movimientos y fuentes — todo el año, no solo temporada.",
  },
  {
    n: 2,
    titulo: "Motor tributario determinista y auditable",
    detalle: "Reglas fiscales colombianas versionadas por año, fórmulas por casilla, memoria de cálculo y referencias normativas.",
  },
  {
    n: 3,
    titulo: "Agente de IA para entrevista y coordinación",
    detalle: "Extrae, explica, pregunta solo lo faltante, nunca asume valores desconocidos y coordina herramientas especializadas.",
  },
  {
    n: 4,
    titulo: "Hands para navegador y MUISCA",
    detalle: "Asistencia controlada: observar, escribir valores autorizados, verificar, guardar evidencia y pedir autorización para lo sensible.",
  },
];

export const decisionFinal = {
  veredicto:
    "Desarrollar el Agente Contador Digital ALBRA con 4 pilares: un agente central que coordina herramientas especializadas, una única fuente de verdad financiera, reglas fiscales verificables y controles explícitos para cada operación sensible. No una multitud de agentes que calculen por separado.",
  proximoPaso:
    "Auditoría técnica reproducible de open-renta (commit fijado, dependencias, pruebas, fórmulas, parámetros oficiales, paridad con casos de contador). Solo después de validar el motor comienza la integración con el expediente financiero y las manos de navegador.",
};


