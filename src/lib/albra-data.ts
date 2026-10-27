// ============================================================================
// DATOS ESTRUCTURADOS — INFORME MAESTRO DE INVESTIGACIÓN
// AGENTE CONTADOR DIGITAL CON IA — ECOSISTEMA ALBRA
// Mercado: Colombia · F210 · DIAN/MUISCA · Fecha del informe: 26-oct-2026
// ============================================================================

// ---------------------------------------------------------------------------
// KPIs GLOBALES
// ---------------------------------------------------------------------------
export const kpis = [
  { label: "Competidores COL", value: "6", hint: "Justi, Tributi, Taxon, Contadia, Counti, TribAI", icon: "building" },
  { label: "Repos GitHub COL", value: "8", hint: "Auditados en la matriz de decisión", icon: "github" },
  { label: "Rango precios F210", value: "$79.9K–$550K", hint: "COP por declaración / temporada", icon: "coins" },
  { label: "Referentes intl.", value: "30+", hint: "Repos MCP, motores y productos comerciales", icon: "globe" },
  { label: "Módulos del chaleco", value: "11", hint: "De orquestación a evidencias", icon: "layers" },
  { label: "Estados declaración", value: "7", hint: "INCOMPLETO → SOPORTADO", icon: "branch" },
  { label: "Fases del plan", value: "7", hint: "Del alcance al piloto controlado", icon: "list" },
  { label: "Candidatos prioritarios", value: "6", hint: "open-renta y Finance Substrate al frente", icon: "target" },
] as const;

// ---------------------------------------------------------------------------
// CATEGORÍAS DE SOLUCIONES IDENTIFICADAS (Resumen ejecutivo)
// ---------------------------------------------------------------------------
export const solutionCategories = [
  { n: 1, title: "Preparadoras de renta PN", desc: "Plataformas que preparan declaraciones de renta para personas naturales." },
  { n: 2, title: "Copilotos IA contables", desc: "Asistentes de inteligencia artificial para contadores profesionales." },
  { n: 3, title: "Motores deterministas F210", desc: "Cálculo reproducible del Formulario 210 sin depender del LLM." },
  { n: 4, title: "Agentes documentales", desc: "Procesan documentos, exógena y certificados tributarios." },
  { n: 5, title: "Automatización de formulario", desc: "Diligenciamiento asistido de formularios mediante navegador." },
] as const;

// ---------------------------------------------------------------------------
// COMPETENCIA COMERCIAL COLOMBIANA
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
    muiscaNote: "Presentación anunciada con discrepancia contractual previa (borrador + presentación por el usuario). Requiere confirmación escrita.",
    priceRange: "$120K – $220K",
    plans: [
      { plan: "Estándar", price: "$120.000" },
      { plan: "Exprés", price: "$200.000" },
      { plan: "Con experto", price: "$220.000" },
    ],
    highlights: [
      "Lectura IA de certificados 220, exógena y facturación electrónica",
      "Preparación F210 + optimización de deducciones",
      "Explicación de casillas y auditoría de riesgos",
      "Borrador de declaración + agente conversacional",
      "Modalidad con experto tributario",
    ],
    observation: "La página anuncia presentación ante la DIAN, pero los términos previos asignaban la presentación al usuario. Confirmar condiciones vigentes antes de comparar.",
    valueForAlbra: "Referencia para UX, lectura de documentos, entrevista conversacional, explicación tributaria y optimización de deducciones.",
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
    priceRange: "$170K – $550K",
    plans: [
      { plan: "Clara (impuesto a pagar)", price: "Gratis", note: "Si queda en cero o saldo a favor: $170.000" },
      { plan: "App sin afán", price: "$170.000" },
      { plan: "App exprés", price: "$470.000" },
      { plan: "Experto sin afán", price: "$250.000" },
      { plan: "Experto exprés", price: "$550.000" },
    ],
    highlights: [
      "Agente conversacional Clara integrable con ChatGPT/Claude",
      "Preguntas adaptativas y solicitud de documentos",
      "Motor de tecnología tributaria propio",
      "Integración MCP publicada: mcp.tributi.com/mcp",
    ],
    observation: "Disponibilidad, permisos y condiciones de la integración MCP deben verificarse directamente con el proveedor.",
    valueForAlbra: "Referente clave para separar el agente conversacional del motor tributario: el agente entrevista y recopila; la tecnología fiscal calcula.",
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
    muiscaNote: "Extensión Chrome que escribe y verifica campos, pero no firma, no presenta ni paga: el usuario revisa y presenta.",
    priceRange: "$90K – $160K",
    plans: [
      { plan: "Gratuito limitado", price: "$0" },
      { plan: "Estándar", price: "~$90.000", note: "Por temporada" },
      { plan: "Completo", price: "~$160.000", note: "Por temporada" },
    ],
    highlights: [
      "Importación de información exógena",
      "Cálculos por casilla con explicación de fórmulas y normas",
      "Optimización tributaria y gestión de clientes",
      "Extensión Chrome para escribir valores en MUISCA con verificación",
    ],
    observation: "La documentación indica que la extensión no automatiza la presentación completa: revisión y presentación quedan en el usuario.",
    valueForAlbra: "Referencia especialmente útil para la integración entre el motor tributario y las manos de navegador (Hands) de ALBRA.",
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
    muisca: "si",
    muiscaNote: "Anuncia presentación directa en MUISCA; mecanismo técnico, autorizaciones y recuperación ante fallos no verificados de forma independiente.",
    priceRange: "$270K",
    plans: [
      { plan: "Ilimitado AG 2025", price: "$270.000", note: "Por año gravable" },
    ],
    highlights: [
      "Gestión de declarantes y expedientes fiscales",
      "Procesamiento de exógena y lectura de certificados",
      "Conexión automatizada con MUISCA",
      "Soporte de expertos y múltiples declaraciones",
    ],
    observation: "La presentación directa es capacidad anunciada por el proveedor; no se realizó presentación de prueba ni verificación independiente.",
    valueForAlbra: "Referencia para gestión de carteras de clientes, expedientes fiscales y automatización operativa para contadores.",
    color: "#F43F5E",
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
    muiscaNote: "No debe suponerse presentación automática; el informe no la documenta.",
    priceRange: "Desde $5K",
    plans: [
      { plan: "Entrada", price: "Desde $5.000", note: "Qué incluye no está claro" },
      { plan: "Prueba gratuita", price: "7 días" },
    ],
    highlights: [
      "Copiloto de IA para contadores colombianos",
      "Lectura de certificados 220, exógena y facturación electrónica",
      "Motor tributario F210 + auditoría de riesgos",
      "Calendario tributario y calculadoras de IVA y retención",
    ],
    observation: "Cifras de usuarios, precisión y seguridad publicadas no han sido auditadas de forma independiente.",
    valueForAlbra: "Referencia para integrar gestión de clientes, consultas tributarias, preparación y herramientas auxiliares en una estación de trabajo.",
    color: "#38BDF8",
  },
  {
    id: "tribai",
    name: "TribAI",
    site: "https://tribai.co/declaracion",
    market: "PN y profesionales",
    f210: "si",
    docs: "si",
    aiChat: "si",
    muisca: "parcial",
    muiscaNote: "Genera XML para DIAN; la presentación automática en MUISCA no está demostrada.",
    priceRange: "$79.9K – $149.9K",
    plans: [
      { plan: "Gratuito", price: "$0", note: "Análisis limitado y vista parcial del F210" },
      { plan: "Declaración PN", price: "$79.900" },
      { plan: "Declaración Pro", price: "$149.900" },
    ],
    highlights: [
      "OCR y extracción documental mediante IA",
      "Preparación F210 con exportación PDF/Excel/CSV y XML DIAN",
      "Optimización y comparación de escenarios",
      "Consulta tributaria con RAG y referencias normativas",
      "Análisis de riesgos de fiscalización",
    ],
    observation: "La generación de XML no demuestra por sí sola la capacidad de presentación automática en MUISCA.",
    valueForAlbra: "Competidor que combina preparación F210, extracción documental, optimización y consultas de normativa.",
    color: "#FB923C",
  },
];

// ---------------------------------------------------------------------------
// COMPARADOR DE PRECIOS (COP) — valores publicados 2025/2026
// ---------------------------------------------------------------------------
export interface PricePoint {
  plan: string;
  competitor: string;
  price: number;
}

export const pricePoints: PricePoint[] = [
  { plan: "Counti · entrada", competitor: "Counti", price: 5000 },
  { plan: "TribAI · PN", competitor: "TribAI", price: 79900 },
  { plan: "Taxon · estándar", competitor: "Taxon", price: 90000 },
  { plan: "Justi · estándar", competitor: "Justi", price: 120000 },
  { plan: "TribAI · Pro", competitor: "TribAI", price: 149900 },
  { plan: "Taxon · completo", competitor: "Taxon", price: 160000 },
  { plan: "Clara · cero/saldo a favor", competitor: "Tributi", price: 170000 },
  { plan: "Tributi · sin afán", competitor: "Tributi", price: 170000 },
  { plan: "Justi · exprés", competitor: "Justi", price: 200000 },
  { plan: "Justi · experto", competitor: "Justi", price: 220000 },
  { plan: "Tributi · experto sin afán", competitor: "Tributi", price: 250000 },
  { plan: "Contadia · ilimitado", competitor: "Contadia", price: 270000 },
  { plan: "Tributi · exprés", competitor: "Tributi", price: 470000 },
  { plan: "Tributi · experto exprés", competitor: "Tributi", price: 550000 },
];

export const competitorColorMap: Record<string, string> = {
  Justi: "#00E676",
  Tributi: "#22D3EE",
  Taxon: "#F59E0B",
  Contadia: "#F43F5E",
  Counti: "#38BDF8",
  TribAI: "#FB923C",
};

export const otherProviders = [
  { name: "Tributa Bien", url: "https://www.tributa.com.co/", note: "Servicios tributarios con IA + asistencia humana. Sin precio público comparable." },
  { name: "Finantic", url: "https://finantic.com.co/", note: "Soluciones financieras y contables." },
  { name: "Finark", url: "https://www.finark.net/", note: "Herramientas financieras y contables." },
  { name: "Siigo", url: "https://www.siigo.com/", note: "Software contable y de gestión empresarial." },
  { name: "NETSOLIN", url: "https://www.netsolin.com/", note: "Soluciones contables y tecnológicas." },
];

// ---------------------------------------------------------------------------
// REPOS GITHUB — COLOMBIA (matriz de decisión)
// ---------------------------------------------------------------------------
export type LicenseStatus = "mit-verificada" | "mit-reportada" | "sin-licencia" | "pendiente" | "agpl";
export type Recommendation = "auditar-primero" | "estudiar-corregir" | "referencia-secundaria" | "auditar-antes" | "no-copiar";

export interface Repo {
  name: string;
  url: string;
  contribution: string;
  license: LicenseStatus;
  licenseLabel: string;
  recommendation: Recommendation;
  recommendationLabel: string;
  detail: string;
}

export const colombianRepos: Repo[] = [
  {
    name: "open-renta",
    url: "https://github.com/Riskbreaker2077/open-renta",
    contribution: "Motor F210 determinista en Python con memoria de cálculo trazable, réplica visual del formulario, hoja de digitación, parámetros por año y 56 pruebas sobre 5 casos de referencia.",
    license: "mit-verificada",
    licenseLabel: "MIT verificada",
    recommendation: "auditar-primero",
    recommendationLabel: "Auditar primero",
    detail: "Candidato #1 para el motor F210 de ALBRA. El LLM no hace aritmética fiscal: el código determinista calcula y la IA asiste. No solicita credenciales DIAN ni automatiza MUISCA. Riesgos: cobertura fiscal incompleta posible, parámetros por contrastar, dependencias por auditar y falta de pruebas de paridad con contador.",
  },
  {
    name: "Finance Substrate (broomva/skills)",
    url: "https://github.com/broomva/skills/tree/main/skills/finance/finance-substrate",
    contribution: "Finanzas personales longitudinales + proyección tributaria + automatización MUISCA (asistente de 15 pasos, scripts fill_form210.py y tax_projection.py).",
    license: "mit-reportada",
    licenseLabel: "MIT (repo padre)",
    recommendation: "estudiar-corregir",
    recommendationLabel: "Estudiar y corregir",
    detail: "Candidato #2 como inspiración del expediente financiero permanente. Riesgos críticos: asume respuestas «No» (residencia fiscal, contabilidad, convenios), casilla de deudas con valor predeterminado cero, mapeo incompleto del formulario y manejo de sesiones sensibles de navegador.",
  },
  {
    name: "renta-facil",
    url: "https://github.com/emunozd/renta-facil",
    contribution: "Bot de Telegram para guiar el F210: análisis de exógena, extracción con IA visual, cálculos en Python y borrador en Excel.",
    license: "sin-licencia",
    licenseLabel: "Sin licencia raíz",
    recommendation: "no-copiar",
    recommendationLabel: "No copiar sin permiso",
    detail: "Referencia útil para entrevista conversacional y procesamiento documental. Sin archivo LICENSE en la raíz: no reutilizar comercialmente sin aclarar con el titular. Permisos amplios en instrucciones de instalación requieren revisión.",
  },
  {
    name: "renta-declaracion",
    url: "https://github.com/estebanduse-ai-data/renta-declaracion",
    contribution: "Aplicación FastAPI + React + PostgreSQL para gestionar declarantes, captura tipo wizard, liquidación y persistencia.",
    license: "pendiente",
    licenseLabel: "Licencia pendiente",
    recommendation: "no-copiar",
    recommendationLabel: "No reutilizar sin permiso",
    detail: "Referencia de arquitectura de gestión tributaria completa. La documentación reconoce riesgos: diferencias con Excel contable, actualización normativa, protección de NIT y datos patrimoniales, y el riesgo de presentar antes de demostrar paridad.",
  },
  {
    name: "asesor-dian-claude",
    url: "https://github.com/juandiegoandres/asesor-dian-claude",
    contribution: "Ayudante tributario para Claude Code: instrucciones de agente, organización de herramientas y consultas de renta.",
    license: "mit-reportada",
    licenseLabel: "MIT reportada",
    recommendation: "referencia-secundaria",
    recommendationLabel: "Referencia secundaria",
    detail: "Candidato secundario: revisar código, pruebas, actividad y cobertura fiscal antes de integrar componentes.",
  },
  {
    name: "Declaracion-Renta-Automated",
    url: "https://github.com/nicolasdcubillos/Declaracion-Renta-Automated",
    contribution: "Automatización de formularios tributarios colombianos: F210, F160 y F490.",
    license: "mit-reportada",
    licenseLabel: "MIT reportada",
    recommendation: "auditar-antes",
    recommendationLabel: "Auditar antes de adoptar",
    detail: "Verificar estado actual del repositorio, cobertura de pruebas y licencia en la versión exacta que se pretenda utilizar.",
  },
  {
    name: "calculadora-declaracion-renta",
    url: "https://github.com/jsowl044/calculadora-declaracion-renta",
    contribution: "Cálculo del F210 fuera de línea con importación de exógena y hojas de cálculo.",
    license: "mit-reportada",
    licenseLabel: "MIT reportada",
    recommendation: "auditar-antes",
    recommendationLabel: "Auditar antes de adoptar",
    detail: "Actividad reciente (oct-2026), pero sin madurez productiva ni paridad fiscal independiente demostrada.",
  },
  {
    name: "contaia-colombia",
    url: "https://github.com/Jhonnymgx115/contaia-colombia",
    contribution: "Asistente contable colombiano con funciones tributarias, exógena y calendario DIAN.",
    license: "mit-reportada",
    licenseLabel: "MIT reportada",
    recommendation: "auditar-antes",
    recommendationLabel: "Auditar antes de adoptar",
    detail: "Revisar el archivo LICENSE vigente, las dependencias y la cobertura del motor antes de utilizar código.",
  },
];

export const licenseStyle: Record<LicenseStatus, { className: string }> = {
  "mit-verificada": { className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  "mit-reportada": { className: "bg-teal-500/10 text-teal-300 border-teal-500/25" },
  "sin-licencia": { className: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  pendiente: { className: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  agpl: { className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

export const recommendationStyle: Record<Recommendation, { className: string }> = {
  "auditar-primero": { className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  "estudiar-corregir": { className: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40" },
  "referencia-secundaria": { className: "bg-slate-500/15 text-slate-300 border-slate-500/40" },
  "auditar-antes": { className: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  "no-copiar": { className: "bg-rose-500/15 text-rose-300 border-rose-500/40" },
};

// ---------------------------------------------------------------------------
// REFERENTES INTERNACIONALES
// ---------------------------------------------------------------------------
export const internationalRepos = [
  { name: "Terminal Tax MCP Server", url: "https://github.com/terminaltax/terminal-tax-mcp-server", license: "MIT (servidor público)", lesson: "Interfaz MCP, separación agente/servicio tributario, flujo de revisión y aprobación, presentación controlada.", use: "Estudiar el patrón de integración y aprobación, no su lógica tributaria." },
  { name: "Taxfill MCP", url: "https://github.com/Ryanczj0306/taxfill-mcp", license: "Por verificar", lesson: "Entrevista, cálculos deterministas y generación de documentos (mercado EE. UU.).", use: "Estudiar el flujo de recolección, cálculo y generación. No reutilizar reglas fiscales." },
  { name: "FreeTaxUSA MCP", url: "https://github.com/schwarztim/freetaxusa-mcp", license: "Por verificar", lesson: "Automatización de navegador sobre sesión autenticada con dependencia de la UI web.", use: "Referencia de automatización de navegador; revisar código antes de adoptar patrones." },
  { name: "OpenTax", url: "https://opentax.filed.com/", license: "AGPL-3.0", lesson: "Separación de reglas fiscales y datos; cálculo determinista estructurado (EE. UU.).", use: "Revisar impacto AGPL antes de integrar código en un servicio comercial." },
  { name: "OpenAccountants", url: "https://github.com/openaccountants/openaccountants", license: "AGPL-3.0 (código)", lesson: "Base de conocimiento tributario estructurado con recuperación y fuentes.", use: "No copiar su corpus a un RAG comercial sin resolver la licencia del contenido." },
  { name: "OpenAccountant Skills", url: "https://github.com/openaccountant/skills", license: "Por verificar", lesson: "Biblioteca de habilidades financieras y contables para agentes.", use: "Referencia para organizar herramientas; revisar licencia por versión." },
  { name: "India ITR Prep Skill", url: "https://github.com/NidheeshJain/itr-prep-skill", license: "Por verificar", lesson: "Preparación tributaria mediante agente (India).", use: "Referencia de flujo, sin trasladar reglas fiscales." },
  { name: "AU Tax Return", url: "https://github.com/kiwizznz/au-tax-return", license: "Por verificar", lesson: "Flujo de preparación de declaraciones (Australia).", use: "Referencia de flujo, sin trasladar reglas fiscales." },
  { name: "Spain IRPF Helper", url: "https://github.com/antonioibars/irpf-declaration-helper", license: "Por verificar", lesson: "Ayudante del IRPF español.", use: "Referencia de flujo, sin trasladar reglas fiscales." },
  { name: "Brazil MCP Fiscal", url: "https://github.com/DeHor-Labs/mcp-fiscal-brasil", license: "Por verificar", lesson: "Herramientas fiscales de Brasil mediante MCP.", use: "Referencia de integración MCP, sin trasladar reglas fiscales." },
];

export const internationalProducts = [
  { name: "Instead", url: "https://www.instead.com/", note: "Plataforma de agentes tributarios (EE. UU.). Desde US$30 por crédito." },
  { name: "Filed", url: "https://www.filed.com/", note: "Automatización para profesionales: trazabilidad de datos y revisión." },
  { name: "Black Ore", url: "https://blackore.ai/", note: "Automatización de procesos tributarios de alto volumen con supervisión profesional." },
  { name: "TaxGPT", url: "https://www.taxgpt.com/", note: "Consulta normativa y flujos de preparación para profesionales." },
  { name: "TaxGo", url: "https://taxgo.uk/pricing", note: "Preparación tributaria británica: £79 / £149 con revisión." },
  { name: "Avalara", url: "https://www.avalara.com/", note: "Automatización internacional de impuestos, relevante para empresas." },
  { name: "Fonoa", url: "https://www.fonoa.com/", note: "Automatización fiscal internacional e impuestos indirectos." },
  { name: "JVZoo", url: "https://www.jvzoo.com/", note: "Sin competidor directo verificable para un agente contador PN colombiano / F210." },
];

export const technicalPatterns = [
  "No delegar aritmética fiscal al modelo de lenguaje.",
  "Representar dinero con tipos y reglas de redondeo controlados.",
  "Mantener libros y registros auditables.",
  "Usar herramientas específicas para operaciones contables.",
  "Exigir aprobación para operaciones sensibles.",
  "Separar consulta normativa, cálculo y ejecución.",
  "Mantener evidencia de cada modificación.",
];

// ---------------------------------------------------------------------------
// ARQUITECTURA — PRINCIPIO RECTOR
// ---------------------------------------------------------------------------
export const corePrinciple = {
  agent: {
    title: "AGENTE (interpreta y coordina)",
    color: "#22D3EE",
    points: [
      "Conversa con el contribuyente e identifica información faltante",
      "Solicita documentos y delega a herramientas especializadas",
      "Explica resultados y pide confirmaciones",
      "Mantiene el estado del expediente",
      "NUNCA realiza cálculos tributarios complejos ni decide valores desconocidos",
    ],
  },
  engine: {
    title: "MOTOR DETERMINISTA (calcula y valida)",
    color: "#00E676",
    points: [
      "Reglas fiscales versionadas por año gravable",
      "Fórmulas por casilla con límites, topes y redondeo controlado",
      "Manejo explícito de valores desconocidos",
      "Memoria de cálculo y referencias normativas",
      "Misma entrada + misma versión de reglas = mismo resultado",
    ],
  },
  rationale: "El agente y el motor son piezas diferentes: el agente interpreta y coordina; el motor calcula con reglas verificables. Así se reduce el riesgo de que un modelo invente cifras o aplique reglas incorrectas.",
};

// ---------------------------------------------------------------------------
// ARQUITECTURA — 11 MÓDULOS DEL CHALECO
// ---------------------------------------------------------------------------
export interface Module {
  n: number;
  name: string;
  icon: string;
  desc: string;
  key: string[];
}

export const albraModules: Module[] = [
  { n: 1, name: "Identidad y orquestación contable", icon: "brain", desc: "AGENTE-GENERAL activa el modo especialista conservando su identidad, guardrails y orquestación.", key: ["Activación por modo", "Selección de procedimientos", "Escalamiento a humano"] },
  { n: 2, name: "Perfil económico y tributario", icon: "user", desc: "Distingue información confirmada, extraída, importada, calculada, inferida, desconocida y contradictoria, con procedencia y período fiscal.", key: ["Procedencia por dato", "Datos desconocidos explícitos"] },
  { n: 3, name: "Ingestión documental", icon: "file", desc: "Procesa certificados, exógena, facturas y extractos con trazabilidad al documento y fragmento de origen.", key: ["Detección de duplicados", "La extracción IA no es dato definitivo"] },
  { n: 4, name: "Expediente financiero longitudinal", icon: "folder", desc: "Ingresos, gastos, activos, pasivos, retenciones, patrimonio, historial y fuentes: la única fuente de verdad financiera.", key: ["Estructura ampliable", "Historial de cambios del usuario"] },
  { n: 5, name: "Motor de reglas y cálculos deterministas", icon: "cpu", desc: "Reglas versionadas por período, fórmulas reproducibles, validaciones, topes, redondeo y memoria de cálculo.", key: ["Reconstruible por casilla", "Casos no soportados explícitos"] },
  { n: 6, name: "Investigación normativa", icon: "book", desc: "Recupera normativa y doctrina oficial distinguiendo fuentes vinculantes, orientaciones y conceptos interpretativos.", key: ["Fuentes por conclusión", "Comprobación de vigencia"] },
  { n: 7, name: "Optimizador tributario legal", icon: "sparkles", desc: "Evalúa beneficios legales (dependientes, AFC, pensiones voluntarias, intereses de vivienda) distinguiendo posible de elegible.", key: ["No inventa gastos ni dependientes", "Explica requisitos y riesgos"] },
  { n: 8, name: "Auditor de riesgos e inconsistencias", icon: "shield-alert", desc: "Detecta diferencias certificado/exógena, inconsistencias patrimoniales, duplicados y datos faltantes por severidad.", key: ["Anomalía ≠ infracción", "Hallazgos clasificados"] },
  { n: 9, name: "Preparación de declaraciones y reportes", icon: "clipboard", desc: "Borradores, cálculos y estructuras para el formulario, con información usada, faltante, reglas aplicadas y validaciones.", key: ["Soportes trazables", "Riesgos abiertos visibles"] },
  { n: 10, name: "Operador de herramientas y navegador", icon: "hand", desc: "Hands ejecuta con permisos explícitos el ciclo observar → identificar → actuar → verificar, guardando evidencia.", key: ["No calcula impuestos", "Se detiene ante cambios inesperados"] },
  { n: 11, name: "Evidencias y auditoría", icon: "fingerprint", desc: "Registra datos, reglas, cálculos, decisiones y aprobaciones para reconstruir el procedimiento completo.", key: ["Secretos redactados", "Calculado ≠ verificado ≠ aprobado ≠ ejecutado"] },
];

// ---------------------------------------------------------------------------
// ARQUITECTURA — 7 ESTADOS DE LA DECLARACIÓN
// ---------------------------------------------------------------------------
export interface State {
  n: number;
  name: string;
  desc: string;
  color: string;
}

export const declarationStates: State[] = [
  { n: 1, name: "INCOMPLETO", desc: "Faltan datos o documentos necesarios.", color: "#F43F5E" },
  { n: 2, name: "PREPARADO", desc: "Existe un borrador generado.", color: "#FB923C" },
  { n: 3, name: "VALIDADO", desc: "Cálculos y comprobaciones pasaron y quedaron documentados.", color: "#F59E0B" },
  { n: 4, name: "APROBADO", desc: "El contribuyente revisó y autorizó la siguiente etapa.", color: "#EAB308" },
  { n: 5, name: "DILIGENCIADO", desc: "Los valores se incorporaron al sistema oficial (MUISCA), verificado.", color: "#22D3EE" },
  { n: 6, name: "PRESENTADO", desc: "Existe evidencia verificable de la presentación oficial.", color: "#34D399" },
  { n: 7, name: "SOPORTADO", desc: "Comprobantes y evidencias archivados en el expediente.", color: "#00E676" },
];

export const ironRule = "Diligenciar no significa presentar. Guardar no significa firmar. Una respuesta del agente no sustituye el comprobante oficial.";

// ---------------------------------------------------------------------------
// ARQUITECTURA — COMPARACIÓN POR COMPONENTE
// ---------------------------------------------------------------------------
export const architectureComparison = [
  { component: "Motor determinista F210", reference: "open-renta", decision: "Auditar y evaluar reutilización", tone: "green" },
  { component: "Contabilidad personal longitudinal", reference: "Finance Substrate", decision: "Estudiar modelo de datos y fuentes", tone: "cyan" },
  { component: "Entrevista conversacional", reference: "Tributi/Clara y Justi", decision: "Diseñar preguntas adaptativas", tone: "cyan" },
  { component: "Gestión de clientes", reference: "Contadia y renta-declaracion", decision: "Estudiar flujos y expedientes", tone: "amber" },
  { component: "Automatización de navegador", reference: "Taxon y Finance Substrate", decision: "Adoptar patrones seguros", tone: "amber" },
  { component: "Consulta normativa", reference: "Counti y OpenAccountants", decision: "Construir con fuentes oficiales y licencias claras", tone: "amber" },
  { component: "Aprobación de presentación", reference: "Terminal Tax y Taxfill", decision: "Separar preparación y autorización", tone: "green" },
  { component: "Seguridad y trazabilidad", reference: "Patrones de contabilidad auditable", decision: "Aplicar controles de ALBRA y Hands", tone: "cyan" },
] as const;

// ---------------------------------------------------------------------------
// ALCANCE DEL FLUJO PRIORITARIO
// ---------------------------------------------------------------------------
export const scopeFlow = [
  { step: "1", title: "Personas naturales residentes", desc: "Casos del F210 que se puedan soportar y probar adecuadamente; exclusiones documentadas expresamente." },
  { step: "2", title: "Flujo tributario realista", desc: "Recopilación → ingestión → cálculo determinista → validaciones → borrador → evidencias, con datos de prueba." },
  { step: "3", title: "Evolución posterior", desc: "El chaleco crece hacia otras especialidades contables sin reconstruir desde cero (empresas, otros formularios)." },
];

// ---------------------------------------------------------------------------
// RIESGOS
// ---------------------------------------------------------------------------
export const riskBlocks = [
  {
    title: "Datos personales",
    icon: "lock",
    color: "#F43F5E",
    items: [
      "Cifrado y control de acceso por usuario",
      "Retención y borrado definidos",
      "Gestión de incidentes y tratamiento de datos personales",
      "Protección de credenciales y aislamiento de sesiones autenticadas",
      "Auditoría de accesos",
    ],
  },
  {
    title: "Licencias",
    icon: "scale",
    color: "#F59E0B",
    items: [
      "MIT: uso comercial posible bajo sus condiciones (avisos conservados)",
      "AGPL: obligaciones relevantes si se ofrece como servicio de red",
      "Sin licencia explícita: NO reutilizar comercialmente",
      "La licencia del código puede diferir de la de documentos y corpus",
    ],
  },
  {
    title: "Exactitud tributaria",
    icon: "target",
    color: "#22D3EE",
    items: [
      "Pruebas con casos sintéticos y casos límite",
      "Casos revisados por contadores competentes",
      "Pruebas de paridad contra declaraciones reales revisadas",
      "Validación de cada año gravable contra normas oficiales",
      "Auditoría de parámetros y dependencias",
      "Pruebas de recuperación ante fallos",
    ],
  },
];

export const dianPrinciples = [
  "Los datos precargados por la DIAN deben verificarse.",
  "La responsabilidad de la declaración recae en el contribuyente.",
  "Un borrador no equivale a una declaración presentada.",
  "La firma y la presentación deben tratarse como acciones separadas.",
  "El comprobante de presentación es la evidencia que permite verificar que el proceso terminó.",
];

export const dianAlert = "No se encontró evidencia de una API pública oficial de terceros que permita presentar automáticamente declaraciones F210. ALBRA no debe diseñarse suponiendo que existe esa API hasta confirmarlo directamente con la DIAN.";

export const officialSources = [
  { name: "DIAN — Renta personas naturales AG 2025", url: "https://micrositios.dian.gov.co/renta-personas-naturales-ag-2025/" },
  { name: "DIAN — Cómo hacer la declaración", url: "https://micrositios.dian.gov.co/renta-personas-naturales-ag-2025/como-hacer-su-declaracion/" },
  { name: "Formulario 210 (MUISCA)", url: "https://muisca.dian.gov.co/WebDilIngresoFormRenta210/" },
  { name: "Normograma — Resolución 227 de 2025", url: "https://normograma.dian.gov.co/dian/compilacion/docs/resolucion_dian_0227_2025.htm" },
  { name: "Trámites tributarios DIAN", url: "https://www.dian.gov.co/tramitesservicios/tramites-y-servicios/tributarios/Paginas/tramites-tributarios.aspx" },
];

// ---------------------------------------------------------------------------
// PLAN DE EJECUCIÓN — 7 FASES
// ---------------------------------------------------------------------------
export const phases = [
  { n: 1, title: "Definir alcance", desc: "Personas naturales residentes y casos F210 soportables y probables. Documentar exclusiones y casos que requieren profesional.", output: "Alcance y exclusiones documentadas" },
  { n: 2, title: "Auditar open-renta", desc: "Descargar versión concreta, ejecutar las 56 pruebas, auditar fórmulas, contrastar parámetros oficiales, revisar licencias y comparar contra casos de contador.", output: "Dictamen técnico-fiscal del motor" },
  { n: 3, title: "Diseñar el expediente financiero", desc: "Modelo de datos de documentos, movimientos, ingresos, activos, pasivos, retenciones y fuentes.", output: "Modelo de datos con procedencia" },
  { n: 4, title: "Construir el motor fiscal", desc: "Reglas separadas del LLM, normativa versionada y trazabilidad por casilla.", output: "Motor determinista verificable" },
  { n: 5, title: "Construir el agente conversacional", desc: "Solicita únicamente información faltante; nunca asume valores desconocidos.", output: "Agente coordinador sin supuestos" },
  { n: 6, title: "Integrar Hands", desc: "Navegación controlada, verificación de valores, permisos mínimos, evidencia y autorización para acciones sensibles.", output: "Ejecutor con ciclo observar-actuar-verificar" },
  { n: 7, title: "Piloto controlado", desc: "Datos sintéticos o anonimizados, casos límite y medición de exactitud antes de habilitar declaraciones reales.", output: "Exactitud medida y aprobada" },
];

// ---------------------------------------------------------------------------
// CRITERIOS DE ACEPTACIÓN
// ---------------------------------------------------------------------------
export const acceptanceCriteria = [
  {
    group: "Arquitectura",
    items: [
      "AGENTE-GENERAL conserva su identidad y funcionamiento central",
      "CONTADOR PÚBLICO ALBRA existe como especialización modular",
      "Integración con contratos e interfaces verificables",
      "Dependencias justificadas y documentadas",
    ],
  },
  {
    group: "Inteligencia especializada",
    items: [
      "Distingue datos confirmados, desconocidos, extraídos y calculados",
      "Solicita la información faltante",
      "Explica los resultados con fuentes normativas verificables",
      "No inventa requisitos, cifras ni beneficios tributarios",
    ],
  },
  {
    group: "Cálculo y validación",
    items: [
      "Cálculos críticos con reglas deterministas versionadas por período",
      "Resultados reconstruibles a partir de entradas y operaciones",
      "Pruebas reproducibles ejecutadas",
      "Comparación contra casos de referencia apropiados",
    ],
  },
  {
    group: "Operación",
    items: [
      "Estados explícitos del procedimiento tributario",
      "Borrador ≠ declaración presentada",
      "Acciones sensibles con autorización correspondiente",
      "Errores sin afirmaciones falsas de éxito; evidencias conservadas",
    ],
  },
  {
    group: "Seguridad y mantenimiento",
    items: [
      "Licencias y dependencias revisadas",
      "Documentos, credenciales y sesiones protegidos",
      "Instrucciones de configuración y uso",
      "Limitaciones documentadas; criterio sin evidencia = pendiente",
    ],
  },
];

// ---------------------------------------------------------------------------
// DECISIÓN FINAL — CANDIDATOS PRIORITARIOS Y PILARES
// ---------------------------------------------------------------------------
export const priorityCandidates = [
  { rank: 1, name: "open-renta", tag: "Motor tributario", desc: "Primera opción para auditoría del motor: MIT verificada, cálculo determinista y trazable.", tone: "green" },
  { rank: 2, name: "Finance Substrate", tag: "Finanzas permanentes", desc: "Referencia para conectar finanzas longitudinales con la declaración; corregir respuestas asumidas.", tone: "cyan" },
  { rank: 3, name: "Tributi / Clara", tag: "Referencia comercial", desc: "Conversación, recolección de datos y separación agente/tecnología tributaria.", tone: "amber" },
  { rank: 4, name: "Taxon", tag: "Automatización MUISCA", desc: "Automatización de navegador y verificación de campos en el formulario oficial.", tone: "amber" },
  { rank: 5, name: "Contadia", tag: "Expedientes", desc: "Gestión de múltiples declarantes y flujo operativo de contadores.", tone: "slate" },
  { rank: 6, name: "Counti y TribAI", tag: "Herramientas IA", desc: "Extracción documental, consultas tributarias y preparación del F210.", tone: "slate" },
] as const;

export const pillars = [
  { n: 1, title: "Contabilidad personal permanente", desc: "Expediente financiero del contribuyente durante todo el año, no solo en temporada.", icon: "folder" },
  { n: 2, title: "Motor tributario determinista", desc: "Reglas colombianas versionadas, auditable y reproducible.", icon: "cpu" },
  { n: 3, title: "Agente de IA coordinador", desc: "Entrevista, extracción, explicación y coordinación de herramientas.", icon: "brain" },
  { n: 4, title: "Hands controlado", desc: "Asistencia controlada en navegador y flujo de MUISCA con evidencia.", icon: "hand" },
] as const;

export const nextStep = "Realizar una auditoría técnica reproducible de open-renta y compararlo con casos tributarios de referencia. Solo después de validar el motor debe comenzar la integración con el expediente financiero permanente y las manos de navegador de ALBRA.";
