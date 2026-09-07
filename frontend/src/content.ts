export type Locale = "es" | "en";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectView {
  id: string;
  title: string;
  category: string;
  summary: string;
  contribution: string;
  details: string[];
  tags: string[];
  note?: string;
  links?: ProjectLink[];
}

export interface PortfolioContent {
  locale: Locale;
  brand: string;
  initials: string;
  role: string;
  resumeLabel: string;
  navigation: { home: string; projects: string; contact: string };
  home: {
    title: string;
    introduction: string;
    primaryAction: string;
    secondaryAction: string;
    availability: string;
    facts: { label: string; value: string }[];
    experienceTitle: string;
    experience: string;
    selectedTitle: string;
  };
  projects: { title: string; introduction: string; items: ProjectView[] };
  contact: {
    title: string;
    introduction: string;
    emailLabel: string;
    email: string;
    nameLabel: string;
    messageLabel: string;
    submitLabel: string;
    submittingLabel: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
  };
  footer: string;
}

export const fallbackContent: Record<Locale, PortfolioContent> = {
  es: {
    locale: "es",
    brand: "André Yermak Naumenko",
    initials: "AY",
    role: "Ingeniero telemático · software, datos y sistemas",
    resumeLabel: "Descargar CV",
    navigation: { home: "Inicio", projects: "Proyectos", contact: "Contacto" },
    home: {
      title: "Software, datos y sistemas para problemas que merecen entenderse bien.",
      introduction:
        "Soy ingeniero telemático por la UPCT y trabajo como Data Engineer en Setenova. Mi práctica personal se mueve entre backend, herramientas de desarrollo, Linux, redes, videojuegos y machine learning: distintos contextos para una misma forma de trabajar, construir y aprender desde los fundamentos.",
      primaryAction: "Ver proyectos seleccionados",
      secondaryAction: "Escríbeme",
      availability: "Murcia, España · abierto a conversar sobre oportunidades de ingeniería",
      facts: [
        { label: "Ahora", value: "Data Engineer en Setenova" },
        { label: "Formación", value: "Ingeniería Telemática · UPCT · 2021–2026" },
        { label: "Idiomas", value: "Español y ruso nativos · inglés C1 · ucraniano básico" },
      ],
      experienceTitle: "Experiencia profesional",
      experience:
        "En Setenova empecé como Data Engineering Intern (oct. 2025 – may. 2026), integrando y procesando fuentes heterogéneas, analizando datos de protocolos en tiempo real y visualizando tráfico. Desde mayo de 2026 trabajo como Data Engineer.",
      selectedTitle: "Trabajo seleccionado",
    },
    projects: {
      title: "Proyectos que hacen visible cómo trabajo",
      introduction:
        "Una selección de trabajo personal, académico y colaborativo. Cada ficha separa lo que construí de lo que todavía necesita más contexto, para que la evidencia pese más que la lista de tecnologías.",
      items: [
        {
          id: "tmuxxer",
          title: "tmuxxer",
          category: "Herramienta de desarrollo colaborativa",
          summary:
            "Una utilidad de terminal en Rust para reunir directorios de proyectos, sesiones de tmux y, opcionalmente, contenedores Docker en ejecución en un selector interactivo con fzf.",
          contribution:
            "Proyecto compartido nacido con un amigo para reducir fricción al cambiar de contexto durante el desarrollo.",
          details: [
            "Crea, conecta y cambia sesiones; adapta su comportamiento según se ejecute dentro o fuera de tmux.",
            "Puede abrir una shell en un contenedor Docker en ejecución y permite configurar atajos y directorios.",
            "Se instala con Cargo y dispone de binarios para Linux.",
          ],
          tags: ["Rust", "Linux", "tmux", "fzf", "Docker"],
          note: "La contribución concreta de cada colaborador aún no está desglosada públicamente.",
          links: [{ label: "Ver repositorio", href: "https://github.com/ptylabs/tmuxxer" }],
        },
        {
          id: "chess-stylometry",
          title: "Estilometría de ajedrez",
          category: "Trabajo de Fin de Grado · Python",
          summary:
            "Investigación de clasificación de jugadores a partir de análisis visual de partidas mediante una red siamesa entrenada con muestras ancla, positivas y negativas.",
          contribution:
            "Un trabajo de casi un año que cubrió documentación, aprendizaje guiado, implementación, entrenamiento y evaluación.",
          details: [
            "Exploré un enfoque de aprendizaje métrico para comparar representaciones visuales asociadas a jugadores.",
            "El trabajo obtuvo 10/10 y fue propuesto para matrícula de honor.",
            "Los resultados fueron positivos, aunque no espectaculares; el valor estuvo también en diseñar y evaluar el proceso completo.",
          ],
          tags: ["Python", "Machine learning", "Redes siamesas", "Ajedrez"],
          note: "Quedan por publicar o concretar el dataset, las métricas, la arquitectura final y las limitaciones experimentales.",
        },
        {
          id: "rust-api",
          title: "API backend en Rust",
          category: "Backend personal · Axum",
          summary:
            "Una API de complejidad moderada que conectaba un frontend con una base de datos, integraba servicios externos y validaba usuarios registrados.",
          contribution:
            "Desarrollo del backend como pieza de integración entre la interfaz, la persistencia y APIs de terceros.",
          details: [
            "El alcance incluía comunicación frontend–base de datos e integración de APIs externas.",
            "La validación de usuarios registrados formaba parte del flujo de la aplicación.",
          ],
          tags: ["Rust", "Axum", "APIs"],
          note: "El repositorio, el modelo de autenticación, la base de datos, las pruebas y el despliegue todavía no están documentados públicamente.",
        },
        {
          id: "minecraft-plugins",
          title: "Plugins de Minecraft",
          category: "Desarrollo Java",
          summary:
            "Conjunto de aproximadamente cuatro plugins de temáticas distintas, construidos con las APIs y el ecosistema de extensiones de Minecraft.",
          contribution:
            "Desarrollo de funcionalidades para servidores y aprendizaje práctico dentro de un ecosistema Java orientado a eventos y a APIs de plataforma.",
          details: [
            "LibreBuild es uno de los ejemplos: integra WorldEdit para esquemas, comprueba zonas protegidas con WorldGuard y diferencia permisos de jugadores y administradores.",
            "El conjunto no se limita a LibreBuild: los demás plugins aún requieren una ficha técnica y enlaces propios.",
          ],
          tags: ["Java", "Minecraft APIs", "WorldEdit", "WorldGuard"],
          links: [{ label: "Ver LibreBuild", href: "https://github.com/andrewyernau/LibreBuild" }],
        },
        {
          id: "selfhosting",
          title: "Self-hosting y Linux",
          category: "Sistemas personales",
          summary:
            "Administración de un entorno propio con varios servicios web, servidores Linux, Docker y networking.",
          contribution:
            "Operación directa de la infraestructura donde vive este portfolio: servicios en Docker detrás de un Caddy central como proxy inverso.",
          details: [
            "Es una práctica continua de despliegue, administración de servidores y redes aplicada a servicios propios.",
            "La configuración detallada de servicios, copias, monitorización y decisiones de seguridad se documentará a medida que pueda publicarse.",
          ],
          tags: ["Linux", "Docker", "Caddy", "Networking"],
        },
        {
          id: "smartecorutas",
          title: "SmartEcoRutas",
          category: "Retos UPCT · 2026",
          summary:
            "Segundo puesto en la categoría SmartEcoRutas con un proyecto basado en un algoritmo heurístico de optimización de rutas.",
          contribution:
            "Participación en un reto de ingeniería orientado a formular y aproximar un problema de rutas.",
          details: ["El algoritmo utilizaba un enfoque heurístico para la optimización de rutas."],
          tags: ["Optimización", "Algoritmos heurísticos", "Rutas"],
          note: "La aportación individual, las restricciones y el resultado técnico todavía necesitan documentarse.",
        },
      ],
    },
    contact: {
      title: "Hablemos de ingeniería, datos o sistemas.",
      introduction: "Para oportunidades, colaboraciones o una conversación técnica, puedes escribirme directamente o usar el formulario.",
      emailLabel: "Correo",
      email: "andrewyernau@proton.me",
      nameLabel: "Nombre",
      messageLabel: "Mensaje",
      submitLabel: "Enviar mensaje",
      submittingLabel: "Enviando…",
      successTitle: "Mensaje recibido",
      successMessage: "Gracias. Te responderé tan pronto como pueda.",
      errorMessage: "No se pudo enviar. Revisa los datos o inténtalo de nuevo en unos minutos.",
    },
    footer: "Portfolio personal · sin rastreadores de terceros.",
  },
  en: {
    locale: "en",
    brand: "André Yermak Naumenko",
    initials: "AY",
    role: "Telematics engineer · software, data and systems",
    resumeLabel: "Download résumé",
    navigation: { home: "Home", projects: "Projects", contact: "Contact" },
    home: {
      title: "Software, data and systems for problems worth understanding properly.",
      introduction:
        "I am a UPCT telematics engineer and a Data Engineer at Setenova. My personal practice spans backend development, developer tools, Linux, networking, games and machine learning: different settings for the same way of working—building and learning from first principles.",
      primaryAction: "See selected projects",
      secondaryAction: "Get in touch",
      availability: "Murcia, Spain · open to engineering opportunities and conversations",
      facts: [
        { label: "Now", value: "Data Engineer at Setenova" },
        { label: "Education", value: "Telematics Engineering · UPCT · 2021–2026" },
        { label: "Languages", value: "Native Spanish and Russian · C1 English · basic Ukrainian" },
      ],
      experienceTitle: "Professional experience",
      experience:
        "At Setenova, I started as a Data Engineering Intern (Oct. 2025 – May 2026), integrating and processing heterogeneous sources, analysing real-time protocol data and visualising traffic data. I have worked as a Data Engineer since May 2026.",
      selectedTitle: "Selected work",
    },
    projects: {
      title: "Projects that make my way of working visible",
      introduction:
        "A selection of personal, academic and collaborative work. Each entry distinguishes what was built from what still needs more context, so evidence carries more weight than a technology list.",
      items: [
        {
          id: "tmuxxer",
          title: "tmuxxer",
          category: "Collaborative developer tool",
          summary:
            "A Rust terminal utility that brings project directories, tmux sessions and, optionally, running Docker containers into an interactive fzf selector.",
          contribution:
            "A shared project started with a friend to reduce the friction of changing development contexts.",
          details: [
            "Creates, attaches to and switches sessions; its behaviour adapts to whether it runs inside or outside tmux.",
            "Can open a shell in a running Docker container and supports configurable shortcuts and directories.",
            "Installed through Cargo, with Linux binaries available.",
          ],
          tags: ["Rust", "Linux", "tmux", "fzf", "Docker"],
          note: "The specific contribution of each collaborator is not yet publicly broken down.",
          links: [{ label: "View repository", href: "https://github.com/ptylabs/tmuxxer" }],
        },
        {
          id: "chess-stylometry",
          title: "Chess stylometry",
          category: "Bachelor's thesis · Python",
          summary:
            "Research into classifying players from visual analysis of games using a Siamese network trained with anchor, positive and negative samples.",
          contribution:
            "A nearly year-long project covering documentation, guided study, implementation, training and evaluation.",
          details: [
            "I explored metric learning to compare visual representations associated with players.",
            "The thesis received 10/10 and was proposed for honours distinction.",
            "Results were positive rather than spectacular; the value also lay in designing and evaluating the complete process.",
          ],
          tags: ["Python", "Machine learning", "Siamese networks", "Chess"],
          note: "The dataset, metrics, final architecture and experimental limitations still need to be published or specified.",
        },
        {
          id: "rust-api",
          title: "Rust backend API",
          category: "Personal backend · Axum",
          summary:
            "A moderately complex API connecting a frontend to a database, integrating external services and validating registered users.",
          contribution:
            "Backend development as the integration point among the interface, persistence and third-party APIs.",
          details: [
            "The scope included frontend–database communication and external API integration.",
            "Validating registered users was part of the application's flow.",
          ],
          tags: ["Rust", "Axum", "APIs"],
          note: "The repository, authentication model, database, tests and deployment are not yet publicly documented.",
        },
        {
          id: "minecraft-plugins",
          title: "Minecraft plugins",
          category: "Java development",
          summary:
            "A set of roughly four plugins across different themes, built with Minecraft's plugin APIs and ecosystem.",
          contribution:
            "Feature development for servers and hands-on learning in an event-driven, platform-API-oriented Java ecosystem.",
          details: [
            "LibreBuild is one example: it integrates WorldEdit for schematics, checks protected areas with WorldGuard and differentiates player and administrator permissions.",
            "The set is not limited to LibreBuild: the other plugins still need individual technical entries and links.",
          ],
          tags: ["Java", "Minecraft APIs", "WorldEdit", "WorldGuard"],
          links: [{ label: "View LibreBuild", href: "https://github.com/andrewyernau/LibreBuild" }],
        },
        {
          id: "selfhosting",
          title: "Self-hosting and Linux",
          category: "Personal systems",
          summary:
            "Operating a personal environment with several web services, Linux servers, Docker and networking.",
          contribution:
            "Direct operation of the infrastructure that hosts this portfolio: Docker services behind a central Caddy reverse proxy.",
          details: [
            "An ongoing practice of deployment, server administration and networking through personal services.",
            "Detailed service, backup, monitoring and security decisions will be documented as they can be made public.",
          ],
          tags: ["Linux", "Docker", "Caddy", "Networking"],
        },
        {
          id: "smartecorutas",
          title: "SmartEcoRutas",
          category: "Retos UPCT · 2026",
          summary:
            "Second place in the SmartEcoRutas category with a project based on a heuristic route-optimisation algorithm.",
          contribution:
            "Participation in an engineering challenge focused on formulating and approximating a routing problem.",
          details: ["The algorithm used a heuristic approach to route optimisation."],
          tags: ["Optimisation", "Heuristic algorithms", "Routing"],
          note: "The individual contribution, constraints and technical outcome still need documentation.",
        },
      ],
    },
    contact: {
      title: "Let's talk about engineering, data or systems.",
      introduction: "For opportunities, collaborations or a technical conversation, email me directly or use the form.",
      emailLabel: "Email",
      email: "andrewyernau@proton.me",
      nameLabel: "Name",
      messageLabel: "Message",
      submitLabel: "Send message",
      submittingLabel: "Sending…",
      successTitle: "Message received",
      successMessage: "Thank you. I’ll get back to you as soon as I can.",
      errorMessage: "Something went wrong. Check the details or try again in a few minutes.",
    },
    footer: "Personal portfolio · no third-party trackers.",
  },
};

export const isLocale = (value: string | undefined): value is Locale => value === "es" || value === "en";
