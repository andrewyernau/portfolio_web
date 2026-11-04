export type Locale = "es" | "en";
export type Section = "home" | "cv" | "projects" | "articles" | "contact";

export const sections: Section[] = ["home", "cv", "projects", "articles", "contact"];

export const slugs: Record<Locale, Record<Section, string>> = {
  es: { home: "", cv: "cv", projects: "proyectos", articles: "articulos", contact: "contacto" },
  en: { home: "", cv: "cv", projects: "projects", articles: "articles", contact: "contact" },
};

export const EMAIL = "contact@yernau.com";
export const GITHUB = "https://github.com/andrewyernau";
export const LINKEDIN = "https://www.linkedin.com/in/andr%C3%A9-yermak-naumenko-b8489a21a";
export const NAME = "André Yermak Naumenko";

export type Link = { label: string; href: string };
export type Row = { label: string; value: string };
export type Entry = { when: string; title: string; where?: string; points?: string[]; text?: string };

export type Project = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  tags: string[];
  links?: Link[];
};
export type ProjectGroup = { title: string; projects: Project[] };

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "table"; head: string[]; rows: string[][]; numeric: number[] };

export type Article = { id: string; title: string; date: string; summary: string; body: Block[]; links?: Link[] };
export type Report = { title: string; summary: string; authors: string; href: string };

export type Content = {
  ui: {
    nav: Record<Section, string>;
    navLabel: string;
    otherLocale: string;
    otherLocaleLabel: string;
    skip: string;
    previous: string;
    next: string;
    footer: string;
    backToProjects: string;
    backToArticles: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundLink: string;
    errorTitle: string;
    errorText: string;
  };
  home: { description: string; lede: string; paragraphs: string[]; areasTitle: string; areas: Row[] };
  cv: {
    title: string;
    description: string;
    pdf: string;
    experienceTitle: string;
    experience: Entry[];
    infrastructureTitle: string;
    infrastructure: Entry[];
    educationTitle: string;
    education: Entry[];
    eventsTitle: string;
    events: Entry[];
    skillsTitle: string;
    skills: Row[];
    languagesTitle: string;
    languages: Row[];
    otherTitle: string;
    other: Entry[];
  };
  projects: { title: string; description: string; intro: string; groups: ProjectGroup[] };
  articles: {
    title: string;
    description: string;
    intro: string;
    articlesTitle: string;
    items: Article[];
    reportsTitle: string;
    reportsIntro: string;
    reportLink: string;
    reports: Report[];
  };
  contact: {
    title: string;
    description: string;
    intro: string;
    channels: { email: string; github: string; linkedin: string; location: string; locationValue: string };
    formTitle: string;
    name: string;
    email: string;
    message: string;
    messageHint: string;
    submit: string;
    sending: string;
    sentTitle: string;
    sentText: string;
    sendAnother: string;
    errors: { name: string; email: string; message: string };
    limited: string;
    failure: string;
  };
};

const REPORTS = "https://github.com/andrewyernau/tex-projects/tree/main";

export const content: Record<Locale, Content> = {
  es: {
    ui: {
      nav: { home: "Inicio", cv: "Currículum", projects: "Proyectos", articles: "Artículos", contact: "Contacto" },
      navLabel: "Secciones",
      otherLocale: "English",
      otherLocaleLabel: "Read in English",
      skip: "Saltar al contenido",
      previous: "Anterior",
      next: "Siguiente",
      footer: "Sin rastreadores de terceros.",
      backToProjects: "Todos los proyectos",
      backToArticles: "Todos los artículos",
      notFoundTitle: "Página no encontrada",
      notFoundText: "Esa dirección no existe en este sitio.",
      notFoundLink: "Volver al inicio",
      errorTitle: "Algo ha fallado",
      errorText: "El error es mío. Inténtalo de nuevo en unos minutos.",
    },
    home: {
      description: "Ingeniero telemático e ingeniero de datos en Murcia. Datos en tiempo real, infraestructura propia, telecomunicaciones y hardware.",
      lede: "Ingeniero telemático. Trabajo como ingeniero de datos en Setenova y mantengo mi propia infraestructura desde 2020.",
      paragraphs: [
        "Estudié en la Universidad Politécnica de Cartagena, con intercambios en Dublín y Malta. Hoy trabajo con datos en tiempo real: una plataforma de visión por computador con más de 20 cámaras simultáneas y entre 100 y 200 fotogramas por segundo de metadatos, desplegada tanto on-premise como en la nube.",
        "Fuera del trabajo opero mis propios servicios en Linux, entre ellos dos productos SaaS. Ahí he aprendido casi todo lo que sé sobre mantener un sistema en pie, también porque se me ha roto más de una vez.",
        "Me gusta automatizar lo que se repite y aprender rápido lo que todavía no sé.",
      ],
      areasTitle: "En qué trabajo",
      areas: [
        { label: "Datos", value: "Flujos en tiempo real con Kafka, PostgreSQL y S3 detrás de FastAPI. Pipelines con Airflow, arquitectura medallion y técnicas de series temporales para envejecer el dato." },
        { label: "Infraestructura", value: "Linux, Docker, HAProxy, OpenTofu y Prometheus. Despliegues on-premise y en la nube, validados con SLA y objetivos medibles." },
        { label: "Telecomunicaciones", value: "La parte de teleco de la carrera: señales, radioenlaces y propagación, técnicas de acceso múltiple y redes con TCP/IP, MPLS y OSPF." },
        { label: "Hardware", value: "Diseño digital en VHDL sobre ZedBoard, ensamblador para el PIC16F876A y sistemas embebidos en el eCTF de MITRE." },
        { label: "Software", value: "Python, Rust, TypeScript, Java, C y SQL. Herramientas de desarrollo, backend y experimentos de aprendizaje automático." },
      ],
    },
    cv: {
      title: "Currículum",
      description: "Experiencia, formación y habilidades de André Yermak Naumenko.",
      pdf: "Descargar en PDF (en inglés)",
      experienceTitle: "Experiencia",
      experience: [
        {
          when: "may. 2026 a hoy",
          title: "Ingeniero de datos",
          where: "Setenova",
          points: [
            "Plataforma de visión por computador con más de 20 cámaras simultáneas y entre 100 y 200 fotogramas por segundo de metadatos en tiempo real, que pasan por Kafka hasta PostgreSQL y S3 detrás de un servicio FastAPI.",
            "Definí el SLA del sistema, lo convertí en objetivos medibles y los uso para validar cada despliegue.",
            "Ciclo de vida del dato sobre una arquitectura medallion, con técnicas de series temporales para envejecer el dato en crudo.",
            "Despliegue de la misma plataforma on-premise y en la nube, en entornos muy distintos entre sí.",
            "Pipelines de Airflow para APIs públicas de ciudad inteligente. Versionado, releases e integración continua con GitHub Actions.",
          ],
        },
        {
          when: "oct. 2025 a may. 2026",
          title: "Prácticas de ingeniería de datos",
          where: "Setenova",
          points: [
            "Integración y procesamiento de fuentes heterogéneas, análisis de datos de protocolos en tiempo real y visualización de datos de tráfico.",
            "Streaming de vídeo por RTSP con MediaMTX, detección con YOLO, mensajería con Valkey y paneles en React.",
          ],
        },
      ],
      infrastructureTitle: "Infraestructura propia",
      infrastructure: [
        {
          when: "2020 a hoy",
          title: "Servicios autoalojados en Linux",
          where: "Dominios, productos SaaS y webs que opero yo mismo",
          points: [
            "Varios dominios y dos productos propios: Kubo, alojamiento de servidores de juegos, y Nutria, nutrición y entrenamiento.",
            "Docker, HAProxy, Prometheus, OpenTofu, DNS, correo y certificados de Let's Encrypt.",
            "Dos caídas reales, ambas recuperadas: una dependencia de Node rota y un panel de juegos completo restaurado desde copias. Encontré la causa y cambié el proceso en los dos casos.",
          ],
        },
      ],
      educationTitle: "Formación",
      education: [
        { when: "2021 a 2026", title: "Grado en Ingeniería Telemática", where: "Universidad Politécnica de Cartagena. Intercambios en Dublín y Malta.", text: "Trabajo de Fin de Grado sobre estilometría en ajedrez: 10/10 y propuesto a matrícula de honor." },
        { when: "2018 a 2024", title: "Conservatorio Profesional de Música" },
      ],
      eventsTitle: "Eventos y reconocimientos",
      events: [
        { when: "2026", title: "Segundo puesto en Retos UPCT", text: "Categoría SmartEcoRutas, con un algoritmo heurístico de optimización de rutas." },
        { when: "abr. 2025", title: "eCTF de MITRE", text: "Embedded Capture the Flag, participante." },
        { when: "oct. 2024", title: "Talent4Cyber", text: "Evento de ciberseguridad, participante." },
      ],
      skillsTitle: "Habilidades",
      skills: [
        { label: "Lenguajes", value: "Python, Rust, Java, TypeScript, SQL, C, C#" },
        { label: "Datos", value: "Kafka, PostgreSQL, S3, Airflow, FastAPI, Pandas, NumPy" },
        { label: "Infraestructura", value: "Linux, Docker, HAProxy, OpenTofu, Ansible, GitHub Actions" },
        { label: "Observabilidad", value: "Prometheus, definición de SLA y SLO" },
        { label: "Redes", value: "TCP/IP, DNS, balanceo de carga, TLS y SSH, SMTP, SNMP, MPLS, OSPF, VLAN, RTSP" },
        { label: "Señales y radio", value: "Radioenlaces, modelos de propagación, balance de potencia, acceso múltiple" },
        { label: "Hardware", value: "VHDL, simulación con testbench, ZedBoard, ensamblador PIC" },
        { label: "Herramientas de IA", value: "Claude Code, GitHub Copilot" },
      ],
      languagesTitle: "Idiomas",
      languages: [
        { label: "Español", value: "Nativo" },
        { label: "Ruso", value: "Nativo" },
        { label: "Inglés", value: "C1 (Cambridge)" },
        { label: "Ucraniano", value: "Básico" },
      ],
      otherTitle: "Otras actividades",
      other: [
        { when: "sept. 2025 a hoy", title: "Cofundador de la Asociación Juvenil Gambito de Puente Tocinos", text: "Organización de actividades y eventos, y clases grupales de ajedrez." },
        { when: "jun. 2024 a ene. 2026", title: "Clases extracurriculares de ajedrez y música", text: "Planificación, comunicación y enseñanza personalizada." },
      ],
    },
    projects: {
      title: "Proyectos",
      description: "Productos propios, herramientas, investigación y trabajo de telecomunicaciones y hardware.",
      intro: "Trabajo personal, académico y compartido. Cada proyecto tiene su propia página, con lo que hace y con qué está hecho.",
      groups: [
        {
          title: "Productos propios",
          projects: [
            {
              id: "kubo",
              title: "Kubo",
              summary: "Alojamiento de servidores de juegos: Minecraft Java y Bedrock, juego cruzado entre ambos, y bases de datos PostgreSQL, Redis y MongoDB.",
              details: [
                "Tienda y puente de aprovisionamiento entre Stripe y el panel de juegos: el cliente ve recursos exactos y fijos, y el servidor se crea tras confirmarse el pago.",
                "Backend con Bun, Hono y Drizzle, y frontend en React, en inglés y español.",
                "Lo opero sobre mi propia infraestructura, con monitorización privada y copias con simulacro de restauración.",
              ],
              tags: ["Bun", "Hono", "PostgreSQL", "React", "Stripe"],
              links: [{ label: "kubo.csmak.com", href: "https://kubo.csmak.com" }],
            },
            {
              id: "nutria",
              title: "Nutria",
              summary: "Planificación semanal de alimentación y ejercicio basada en evidencia, que aprende de datos reales de reloj, báscula y registro.",
              details: [
                "Cada semana genera cinco documentos: plan de comidas con lista de la compra, desglose nutricional, plan de ejercicio, informe de progreso y hoja de registro para rellenar.",
                "Parte de datos de composición de USDA FoodData Central, del catálogo de Mercadona y de más de 45 artículos y guías con DOI verificado.",
              ],
              tags: ["Python", "Docker", "PDF"],
              links: [{ label: "nutria.csmak.com", href: "https://nutria.csmak.com" }],
            },
          ],
        },
        {
          title: "Herramientas",
          projects: [
            {
              id: "tmuxxer",
              title: "tmuxxer",
              summary: "Utilidad de terminal en Rust que reúne directorios de proyectos, sesiones de tmux y contenedores Docker en un único selector con fzf.",
              details: [
                "Proyecto compartido, nacido con un amigo para reducir la fricción al cambiar de contexto.",
                "Crea, conecta y cambia sesiones, y adapta su comportamiento según se ejecute dentro o fuera de tmux.",
                "Abre una shell en un contenedor en ejecución y permite configurar atajos y directorios.",
                "Se instala con Cargo y tiene binarios para Linux.",
              ],
              tags: ["Rust", "Linux", "tmux", "fzf", "Docker"],
              links: [{ label: "Repositorio", href: "https://github.com/ptylabs/tmuxxer" }],
            },
            {
              id: "rookt",
              title: "rookt",
              summary: "Extractor en Rust de la base de datos abierta de Lichess, que organiza millones de partidas en archivos por jugador.",
              details: [
                "Descarga, filtra y agrupa las partidas en archivos .pgn.zst individuales, con una interfaz de terminal en vivo.",
                "Nació para preparar los datos del Trabajo de Fin de Grado.",
              ],
              tags: ["Rust", "Datos", "Ajedrez"],
              links: [{ label: "Repositorio", href: "https://github.com/andrewyernau/Rookt" }],
            },
            {
              id: "otracker",
              title: "OTracker",
              summary: "Editor de imagen y vídeo de ptylabs que selecciona y sigue hasta seis objetos con SAM 2.1, enteramente en el navegador.",
              details: [
                "El backend solo sirve el frontend, los modelos y WASM: sin subidas, sin base de datos y sin inferencia en el servidor.",
                "Exporta PNG y WebP con alfa, WebM VP8 con alfa y MP4 H.264 con fondo de color.",
              ],
              tags: ["TypeScript", "WASM", "SAM 2.1"],
              links: [{ label: "tracker.yernau.com", href: "https://tracker.yernau.com" }],
            },
          ],
        },
        {
          title: "Investigación y retos",
          projects: [
            {
              id: "chess-stylometry",
              title: "Estilometría en ajedrez",
              summary: "Trabajo de Fin de Grado: comprobar si una persona deja una huella reconocible al jugar, sin usar evaluaciones de motor.",
              details: [
                "Pipeline completo: extracción de partidas, imágenes del tablero y mapas de tiempo de decisión, red siamesa con pérdida triplete e inferencia con banco de memoria.",
                "Nota de 10/10 y propuesto a matrícula de honor. Los resultados son modestos y muestran señal: el artículo los detalla.",
              ],
              tags: ["Python", "Aprendizaje métrico", "Redes siamesas"],
              links: [
                { label: "Artículo", href: "/es/articulos/estilometria-ajedrez" },
                { label: "Repositorio", href: "https://github.com/andrewyernau/tfe_chess_stylometry" },
              ],
            },
            {
              id: "smartecorutas",
              title: "SmartEcoRutas",
              summary: "Segundo puesto en Retos UPCT 2026 con un algoritmo heurístico para optimizar las rutas de recogida de residuos urbanos en Cartagena.",
              details: [
                "El reto parte de datos realistas sobre contenedores y operativa, con el patrocinio de Lhicarsa, la concesionaria del servicio.",
                "El enfoque es heurístico: aproximar buenas rutas en un problema demasiado grande para resolverlo de forma exacta.",
              ],
              tags: ["Python", "Optimización", "Heurísticas"],
              links: [{ label: "Repositorio del reto", href: "https://github.com/ptylabs/PR-SmartEcoRutas-Solver" }],
            },
          ],
        },
        {
          title: "Telecomunicaciones y hardware",
          projects: [
            {
              id: "digital-hardware",
              title: "Diseño digital y microcontroladores",
              summary: "Prácticas de la carrera en VHDL sobre ZedBoard y en ensamblador para el PIC16F876A.",
              details: [
                "Multiplicador secuencial en VHDL: buses de 18 y 24 bits, control mediante una máquina de estados y salida retenida hasta tener el resultado final, comprobado con testbench.",
                "Divisores de reloj, contadores, decodificadores y temporizadores sobre ZedBoard.",
                "En el PIC: entrada y salida, tablas de consulta, USART y conversión analógica-digital.",
              ],
              tags: ["VHDL", "ZedBoard", "PIC16F876A", "Ensamblador"],
              links: [
                { label: "Repositorio ZedBoard", href: "https://github.com/andrewyernau/zedboard" },
                { label: "Repositorio PIC y VHDL", href: "https://github.com/andrewyernau/assembly_exercises" },
              ],
            },
            {
              id: "wireless-network",
              title: "Red inalámbrica en La Costera",
              summary: "Diseño, junto a Álvaro Hernández, de una red de acceso a internet para una pedanía murciana de unos 400 habitantes.",
              details: [
                "Radioenlaces en las bandas de 2,4 y 5 GHz, adaptando cada zona a su necesidad y reduciendo el coste de instalación.",
                "Incluye la elección de materiales, el presupuesto y la comprobación de la normativa de PIRE.",
              ],
              tags: ["Radioenlaces", "2,4 GHz", "5 GHz", "PIRE"],
              links: [{ label: "Informe", href: `${REPORTS}/network%20area%20project` }],
            },
            {
              id: "ectf",
              title: "eCTF de MITRE",
              summary: "Participación en la edición de 2025 del Embedded Capture the Flag, una competición de seguridad en sistemas embebidos.",
              details: ["El repositorio público guarda las primeras pruebas del codificador, el decodificador y un simulador en Python."],
              tags: ["Embebidos", "Seguridad", "Python"],
              links: [{ label: "Repositorio", href: "https://github.com/andrewyernau/testeCTF" }],
            },
          ],
        },
        {
          title: "Otros",
          projects: [
            {
              id: "selfhosting",
              title: "Autoalojamiento y Linux",
              summary: "El entorno donde vive este sitio: servicios en Docker detrás de un proxy inverso, sobre Linux, gestionados por mí.",
              details: [
                "Práctica continua de despliegue, administración de servidores y redes aplicada a servicios reales.",
                "Incluye webs para terceros, como Kebab Oriental y la Asociación Juvenil Gambito.",
              ],
              tags: ["Linux", "Docker", "Caddy", "HAProxy", "Redes"],
              links: [
                { label: "kebab-oriental.com", href: "https://kebab-oriental.com" },
                { label: "ajgambitopt.com", href: "https://ajgambitopt.com" },
              ],
            },
            {
              id: "rust-api",
              title: "API backend en Rust",
              summary: "API con Axum que conectaba un frontend con una base de datos, integraba servicios externos y validaba usuarios registrados.",
              details: ["Pieza de integración entre la interfaz, la persistencia y las APIs de terceros."],
              tags: ["Rust", "Axum", "APIs"],
            },
            {
              id: "minecraft-plugins",
              title: "Plugins de Minecraft",
              summary: "Plugins en Java de temáticas distintas, construidos con las APIs y el ecosistema de extensiones de Minecraft.",
              details: ["LibreBuild integra WorldEdit para esquemas, comprueba zonas protegidas con WorldGuard y diferencia permisos de jugadores y administradores."],
              tags: ["Java", "WorldEdit", "WorldGuard"],
              links: [{ label: "LibreBuild", href: "https://github.com/andrewyernau/LibreBuild" }],
            },
          ],
        },
      ],
    },
    articles: {
      title: "Artículos",
      description: "Artículos y documentación técnica de André Yermak Naumenko.",
      intro: "Lo que he escrito con calma, y los informes técnicos de la carrera que son públicos.",
      articlesTitle: "Artículos",
      items: [
        {
          id: "estilometria-ajedrez",
          title: "¿Deja huella una persona cuando juega al ajedrez?",
          date: "2026",
          summary: "Resumen de mi Trabajo de Fin de Grado: estilometría a partir de imágenes del tablero y tiempos de decisión, sin motor de ajedrez.",
          body: [
            { kind: "p", text: "Mi Trabajo de Fin de Grado, «Sistema de caracterización de estilometría en ajedrez basado en aprendizaje automático e imágenes compuestas», no plantea otro motor ni busca la mejor jugada. Parte de una pregunta más concreta: si una persona deja una huella reconocible cuando juega." },
            { kind: "h2", text: "Planteamiento" },
            { kind: "p", text: "El trabajo usa partidas de Lichess y tiene una restricción principal: nada de Stockfish ni de evaluaciones de motor como señal de entrada. El sistema solo ve lo que se observa directamente en la partida, en forma de imágenes del tablero y mapas de tiempo de decisión." },
            { kind: "p", text: "Con eso se entrena una red siamesa con aprendizaje métrico y pérdida triplete, que produce embeddings de partidas para comparar la similitud entre jugadores." },
            { kind: "h2", text: "Sistema" },
            { kind: "p", text: "El pipeline cubre la extracción y el filtrado de partidas, la generación de imágenes, la normalización de la perspectiva del tablero, el entrenamiento y una inferencia basada en banco de memoria. Ese banco conserva varias partidas por jugador en vez de reducirlo todo a un promedio, lo que permite recuperar ejemplos cercanos y estudiar las confusiones del modelo." },
            { kind: "h2", text: "Resultados" },
            { kind: "p", text: "Los resultados son modestos, pero muestran señal." },
            {
              kind: "table",
              head: ["Evaluación", "Resultado", "Referencia"],
              numeric: [1],
              rows: [
                ["Identificación con 10 jugadores", "Top-5 de 79,75 % a 82,25 %", "Top-5 al azar: 50 %"],
                ["Identificación con 200 jugadores", "Top-1 de 2,05 %", "Top-1 al azar: 0,5 %"],
                ["Elo en crudo", "MAE de 329,0", "Predicciones comprimidas al centro"],
                ["Elo calibrado", "MAE de 260,6", "Calibración lineal out-of-fold"],
                ["Elo con 20 partidas", "MAE de unos 224", "Mejor método calibrado"],
              ],
            },
            { kind: "p", text: "Al ampliar a 200 jugadores la identificación exacta cae mucho, como era de esperar, aunque se queda unas cuatro veces por encima del azar. El modelo no se entrenó para estimar el Elo, pero el embedding contiene información sobre el nivel." },
            { kind: "h2", text: "Conclusión" },
            { kind: "p", text: "El sistema no es un identificador robusto de autoría ni pretende competir con métodos basados en motores. Sí es una primera implementación completa de un enfoque visual y temporal para comparar el comportamiento de los jugadores." },
            { kind: "p", text: "Lo más valioso ha sido comprobar que hay señal aprovechable y entender mejor la dificultad del problema: estilo, nivel, color, fase de la partida, reloj y repertorio aparecen mezclados. Separar esos factores queda como trabajo futuro." },
          ],
          links: [{ label: "Código en GitHub", href: "https://github.com/andrewyernau/tfe_chess_stylometry" }],
        },
      ],
      reportsTitle: "Informes técnicos",
      reportsIntro: "Entregas de la carrera, con su código fuente en LaTeX.",
      reportLink: "Ver fuente",
      reports: [
        { title: "Diseño de redes inalámbricas en La Costera", summary: "Radioenlaces, materiales, presupuesto y normativa de PIRE para dar acceso a internet a una pedanía.", authors: "André Yermak y Álvaro Hernández", href: `${REPORTS}/network%20area%20project` },
        { title: "Fundamentos de la radiocomunicación", summary: "Número máximo de paredes frente a distancia para mantener 54 Mbps en 802.11g, con el modelo path-loss y el balance de potencia.", authors: "André Yermak y Álvaro Hernández", href: `${REPORTS}/radiocom%20ej1` },
        { title: "Técnicas de acceso múltiple", summary: "Caudal medio en ALOHA ranurado con M estaciones y su límite cuando las estaciones tienden a infinito.", authors: "André Yermak y Álvaro Hernández", href: `${REPORTS}/aloha%20ej2` },
        { title: "Optimizar un FSA", summary: "Efecto de la longitud de trama en el rendimiento de Frame Slotted ALOHA, modelado como cadena de Markov.", authors: "Álvaro Hernández y André Yermak", href: `${REPORTS}/ModSim%20FSA` },
      ],
    },
    contact: {
      title: "Contacto",
      description: "Correo, GitHub y formulario de contacto de André Yermak Naumenko.",
      intro: "Para oportunidades, colaboraciones o una conversación técnica, escríbeme directamente o usa el formulario.",
      channels: { email: "Correo", github: "GitHub", linkedin: "LinkedIn", location: "Ubicación", locationValue: "Murcia, España" },
      formTitle: "Formulario",
      name: "Nombre",
      email: "Correo",
      message: "Mensaje",
      messageHint: "Entre 10 y 5000 caracteres.",
      submit: "Enviar mensaje",
      sending: "Enviando…",
      sentTitle: "Mensaje recibido",
      sentText: "Gracias. Te responderé tan pronto como pueda.",
      sendAnother: "Escribir otro mensaje",
      errors: {
        name: "Escribe tu nombre, entre 2 y 100 caracteres.",
        email: "Escribe un correo válido para poder responderte.",
        message: "El mensaje debe tener entre 10 y 5000 caracteres.",
      },
      limited: "Se han enviado demasiados mensajes desde tu conexión. Inténtalo dentro de una hora o escríbeme al correo de arriba.",
      failure: "No se pudo enviar el mensaje. Tu texto sigue aquí: inténtalo de nuevo en unos minutos o escríbeme al correo de arriba.",
    },
  },
  en: {
    ui: {
      nav: { home: "Home", cv: "Résumé", projects: "Projects", articles: "Articles", contact: "Contact" },
      navLabel: "Sections",
      otherLocale: "Español",
      otherLocaleLabel: "Leer en español",
      skip: "Skip to content",
      previous: "Previous",
      next: "Next",
      footer: "No third-party trackers.",
      backToProjects: "All projects",
      backToArticles: "All articles",
      notFoundTitle: "Page not found",
      notFoundText: "That address does not exist on this site.",
      notFoundLink: "Back to home",
      errorTitle: "Something went wrong",
      errorText: "The fault is mine. Please try again in a few minutes.",
    },
    home: {
      description: "Telematics engineer and data engineer in Murcia, Spain. Real-time data, self-run infrastructure, telecommunications and hardware.",
      lede: "Telematics engineer. I work as a data engineer at Setenova and have run my own infrastructure since 2020.",
      paragraphs: [
        "I studied at the Polytechnic University of Cartagena, with exchanges in Dublin and Malta. Today I work with real-time data: a computer-vision platform with more than 20 simultaneous cameras and 100 to 200 frames per second of metadata, deployed both on-premise and in the cloud.",
        "Outside work I run my own services on Linux, including two SaaS products. That is where I have learned most of what I know about keeping a system up, partly because it has broken on me more than once.",
        "I like automating what repeats and learning quickly what I don't know yet.",
      ],
      areasTitle: "What I work on",
      areas: [
        { label: "Data", value: "Real-time flows with Kafka, PostgreSQL and S3 behind FastAPI. Airflow pipelines, medallion architecture and time-series techniques to age data." },
        { label: "Infrastructure", value: "Linux, Docker, HAProxy, OpenTofu and Prometheus. On-premise and cloud deployments, validated against an SLA and measurable objectives." },
        { label: "Telecommunications", value: "The telecoms side of my degree: signals, radio links and propagation, multiple-access techniques, and networking with TCP/IP, MPLS and OSPF." },
        { label: "Hardware", value: "Digital design in VHDL on ZedBoard, assembly for the PIC16F876A, and embedded systems in MITRE's eCTF." },
        { label: "Software", value: "Python, Rust, TypeScript, Java, C and SQL. Developer tools, backend work and machine-learning experiments." },
      ],
    },
    cv: {
      title: "Résumé",
      description: "Experience, education and skills of André Yermak Naumenko.",
      pdf: "Download as PDF",
      experienceTitle: "Experience",
      experience: [
        {
          when: "May 2026 to now",
          title: "Data Engineer",
          where: "Setenova",
          points: [
            "Computer-vision platform with more than 20 simultaneous cameras and 100 to 200 frames per second of real-time metadata, moved through Kafka into PostgreSQL and S3 behind a FastAPI service.",
            "Defined the system SLA, turned it into measurable objectives and use them to validate each deployment.",
            "Data lifecycle on a medallion architecture, using time-series techniques to age raw data.",
            "Deployed the same platform on-premise and in the cloud, in very different environments.",
            "Airflow pipelines for public smart-city APIs. Versioning, releases and CI with GitHub Actions.",
          ],
        },
        {
          when: "Oct. 2025 to May 2026",
          title: "Data Engineering Intern",
          where: "Setenova",
          points: [
            "Integrated and processed heterogeneous sources, analysed real-time protocol data and visualised traffic data.",
            "Video streaming over RTSP with MediaMTX, detection with YOLO, messaging with Valkey and dashboards in React.",
          ],
        },
      ],
      infrastructureTitle: "Own infrastructure",
      infrastructure: [
        {
          when: "2020 to now",
          title: "Self-hosted services on Linux",
          where: "Domains, SaaS products and sites I run myself",
          points: [
            "Several domains and two products of my own: Kubo, game-server hosting, and Nutria, nutrition and training.",
            "Docker, HAProxy, Prometheus, OpenTofu, DNS, mail and Let's Encrypt certificates.",
            "Two real outages, both recovered: a broken Node dependency, and a full game-hosting panel restored from backups. I found the cause and changed the process each time.",
          ],
        },
      ],
      educationTitle: "Education",
      education: [
        { when: "2021 to 2026", title: "BSc in Telematics Engineering", where: "Polytechnic University of Cartagena. Exchanges in Dublin and Malta.", text: "Bachelor's thesis on chess stylometry: 10/10 and proposed for honours." },
        { when: "2018 to 2024", title: "Professional Music Conservatory" },
      ],
      eventsTitle: "Events and recognition",
      events: [
        { when: "2026", title: "Second place, Retos UPCT", text: "SmartEcoRutas category, with a heuristic route-optimisation algorithm." },
        { when: "Apr. 2025", title: "MITRE eCTF", text: "Embedded Capture the Flag, participant." },
        { when: "Oct. 2024", title: "Talent4Cyber", text: "Cybersecurity event, participant." },
      ],
      skillsTitle: "Skills",
      skills: [
        { label: "Languages", value: "Python, Rust, Java, TypeScript, SQL, C, C#" },
        { label: "Data", value: "Kafka, PostgreSQL, S3, Airflow, FastAPI, Pandas, NumPy" },
        { label: "Infrastructure", value: "Linux, Docker, HAProxy, OpenTofu, Ansible, GitHub Actions" },
        { label: "Observability", value: "Prometheus, SLA and SLO definition" },
        { label: "Networking", value: "TCP/IP, DNS, load balancing, TLS and SSH, SMTP, SNMP, MPLS, OSPF, VLAN, RTSP" },
        { label: "Signals and radio", value: "Radio links, propagation models, link budgets, multiple access" },
        { label: "Hardware", value: "VHDL, testbench simulation, ZedBoard, PIC assembly" },
        { label: "AI tools", value: "Claude Code, GitHub Copilot" },
      ],
      languagesTitle: "Languages",
      languages: [
        { label: "Spanish", value: "Native" },
        { label: "Russian", value: "Native" },
        { label: "English", value: "C1 (Cambridge)" },
        { label: "Ukrainian", value: "Basic" },
      ],
      otherTitle: "Other activities",
      other: [
        { when: "Sept. 2025 to now", title: "Co-founder of the Gambito de Puente Tocinos youth association", text: "Organising activities and events, and group chess classes." },
        { when: "June 2024 to Jan. 2026", title: "Extracurricular chess and music classes", text: "Planning, communication and personalised teaching." },
      ],
    },
    projects: {
      title: "Projects",
      description: "Own products, tools, research, and telecommunications and hardware work.",
      intro: "Personal, academic and shared work. Each project has its own page, with what it does and what it is made of.",
      groups: [
        {
          title: "Own products",
          projects: [
            {
              id: "kubo",
              title: "Kubo",
              summary: "Game-server hosting: Minecraft Java and Bedrock, cross-play between them, and PostgreSQL, Redis and MongoDB databases.",
              details: [
                "A storefront and provisioning bridge between Stripe and the game panel: customers see exact, fixed resources, and the server is created once payment is confirmed.",
                "Backend with Bun, Hono and Drizzle, and a React frontend in English and Spanish.",
                "I run it on my own infrastructure, with private monitoring and backups with a restore drill.",
              ],
              tags: ["Bun", "Hono", "PostgreSQL", "React", "Stripe"],
              links: [{ label: "kubo.csmak.com", href: "https://kubo.csmak.com" }],
            },
            {
              id: "nutria",
              title: "Nutria",
              summary: "Evidence-based weekly nutrition and training planning that learns from real data from a watch, a scale and a log.",
              details: [
                "Every week it produces five documents: a meal plan with a shopping list, a nutrition breakdown, a training plan, a progress report and a log sheet to fill in.",
                "It draws on USDA FoodData Central composition data, the Mercadona catalogue and more than 45 papers and guidelines with verified DOIs.",
              ],
              tags: ["Python", "Docker", "PDF"],
              links: [{ label: "nutria.csmak.com", href: "https://nutria.csmak.com" }],
            },
          ],
        },
        {
          title: "Tools",
          projects: [
            {
              id: "tmuxxer",
              title: "tmuxxer",
              summary: "A Rust terminal utility that brings project directories, tmux sessions and Docker containers into a single fzf picker.",
              details: [
                "A shared project, started with a friend to reduce the friction of changing context.",
                "Creates, attaches to and switches sessions, and adapts to whether it runs inside or outside tmux.",
                "Opens a shell in a running container and supports configurable shortcuts and directories.",
                "Installed through Cargo, with Linux binaries available.",
              ],
              tags: ["Rust", "Linux", "tmux", "fzf", "Docker"],
              links: [{ label: "Repository", href: "https://github.com/ptylabs/tmuxxer" }],
            },
            {
              id: "rookt",
              title: "rookt",
              summary: "A Rust extractor for the Lichess open database that organises millions of games into per-player archives.",
              details: [
                "Downloads, filters and groups games into individual .pgn.zst files, with a live terminal UI.",
                "It began as the data preparation for my bachelor's thesis.",
              ],
              tags: ["Rust", "Data", "Chess"],
              links: [{ label: "Repository", href: "https://github.com/andrewyernau/Rookt" }],
            },
            {
              id: "otracker",
              title: "OTracker",
              summary: "An image and video editor from ptylabs that selects and tracks up to six objects with SAM 2.1, entirely in the browser.",
              details: [
                "The backend only serves the frontend, the models and WASM: no uploads, no database and no server-side inference.",
                "Exports PNG and WebP with alpha, WebM VP8 with alpha, and MP4 H.264 with a coloured background.",
              ],
              tags: ["TypeScript", "WASM", "SAM 2.1"],
              links: [{ label: "tracker.yernau.com", href: "https://tracker.yernau.com" }],
            },
          ],
        },
        {
          title: "Research and challenges",
          projects: [
            {
              id: "chess-stylometry",
              title: "Chess stylometry",
              summary: "Bachelor's thesis: testing whether a person leaves a recognisable trace when playing, without engine evaluations.",
              details: [
                "A complete pipeline: game extraction, board images and decision-time maps, a Siamese network with triplet loss, and memory-bank inference.",
                "Graded 10/10 and proposed for honours. The results are modest and show signal: the article has the details.",
              ],
              tags: ["Python", "Metric learning", "Siamese networks"],
              links: [
                { label: "Article", href: "/en/articles/estilometria-ajedrez" },
                { label: "Repository", href: "https://github.com/andrewyernau/tfe_chess_stylometry" },
              ],
            },
            {
              id: "smartecorutas",
              title: "SmartEcoRutas",
              summary: "Second place in Retos UPCT 2026 with a heuristic algorithm to optimise urban waste-collection routes in Cartagena.",
              details: [
                "The challenge uses realistic data on containers and operations, sponsored by Lhicarsa, the company that runs the service.",
                "The approach is heuristic: approximating good routes in a problem too large to solve exactly.",
              ],
              tags: ["Python", "Optimisation", "Heuristics"],
              links: [{ label: "Challenge repository", href: "https://github.com/ptylabs/PR-SmartEcoRutas-Solver" }],
            },
          ],
        },
        {
          title: "Telecommunications and hardware",
          projects: [
            {
              id: "digital-hardware",
              title: "Digital design and microcontrollers",
              summary: "Degree labs in VHDL on ZedBoard and in assembly for the PIC16F876A.",
              details: [
                "A sequential multiplier in VHDL: 18 and 24-bit buses, control through a state machine and output held until the final result, verified with a testbench.",
                "Clock dividers, counters, decoders and timers on ZedBoard.",
                "On the PIC: input and output, lookup tables, USART and analog-to-digital conversion.",
              ],
              tags: ["VHDL", "ZedBoard", "PIC16F876A", "Assembly"],
              links: [
                { label: "ZedBoard repository", href: "https://github.com/andrewyernau/zedboard" },
                { label: "PIC and VHDL repository", href: "https://github.com/andrewyernau/assembly_exercises" },
              ],
            },
            {
              id: "wireless-network",
              title: "Wireless network in La Costera",
              summary: "Design, with Álvaro Hernández, of an internet access network for a village of about 400 people in Murcia.",
              details: [
                "Radio links in the 2.4 and 5 GHz bands, fitting each area to its need and keeping installation cost down.",
                "Covers the choice of materials, the budget and compliance with EIRP regulations.",
              ],
              tags: ["Radio links", "2.4 GHz", "5 GHz", "EIRP"],
              links: [{ label: "Report", href: `${REPORTS}/network%20area%20project` }],
            },
            {
              id: "ectf",
              title: "MITRE eCTF",
              summary: "Took part in the 2025 Embedded Capture the Flag, a competition on the security of embedded systems.",
              details: ["The public repository holds early tests of the encoder, the decoder and a Python simulator."],
              tags: ["Embedded", "Security", "Python"],
              links: [{ label: "Repository", href: "https://github.com/andrewyernau/testeCTF" }],
            },
          ],
        },
        {
          title: "Other",
          projects: [
            {
              id: "selfhosting",
              title: "Self-hosting and Linux",
              summary: "The environment this site lives in: Docker services behind a reverse proxy, on Linux, run by me.",
              details: [
                "An ongoing practice of deployment, server administration and networking on real services.",
                "Includes sites for others, such as Kebab Oriental and the Gambito youth association.",
              ],
              tags: ["Linux", "Docker", "Caddy", "HAProxy", "Networking"],
              links: [
                { label: "kebab-oriental.com", href: "https://kebab-oriental.com" },
                { label: "ajgambitopt.com", href: "https://ajgambitopt.com" },
              ],
            },
            {
              id: "rust-api",
              title: "Rust backend API",
              summary: "An Axum API that connected a frontend to a database, integrated external services and validated registered users.",
              details: ["The integration point between the interface, persistence and third-party APIs."],
              tags: ["Rust", "Axum", "APIs"],
            },
            {
              id: "minecraft-plugins",
              title: "Minecraft plugins",
              summary: "Java plugins across different themes, built with Minecraft's plugin APIs and ecosystem.",
              details: ["LibreBuild integrates WorldEdit for schematics, checks protected areas with WorldGuard and differentiates player and administrator permissions."],
              tags: ["Java", "WorldEdit", "WorldGuard"],
              links: [{ label: "LibreBuild", href: "https://github.com/andrewyernau/LibreBuild" }],
            },
          ],
        },
      ],
    },
    articles: {
      title: "Articles",
      description: "Articles and technical documentation by André Yermak Naumenko.",
      intro: "What I have written with some care, and the technical reports from my degree that are public.",
      articlesTitle: "Articles",
      items: [
        {
          id: "estilometria-ajedrez",
          title: "Do people leave a trace when they play chess?",
          date: "2026",
          summary: "A summary of my bachelor's thesis: stylometry from board images and decision times, without a chess engine.",
          body: [
            { kind: "p", text: "My bachelor's thesis, on characterising chess stylometry with machine learning and composite images, does not propose another engine or look for the best move. It starts from a narrower question: whether a person leaves a recognisable trace when playing." },
            { kind: "h2", text: "Approach" },
            { kind: "p", text: "The work uses Lichess games and has one main restriction: no Stockfish and no engine evaluations as an input signal. The system only sees what can be observed directly in the game, as board images and decision-time maps." },
            { kind: "p", text: "These train a Siamese network with metric learning and triplet loss, which produces game embeddings to compare similarity between players." },
            { kind: "h2", text: "System" },
            { kind: "p", text: "The pipeline covers game extraction and filtering, image generation, board-perspective normalisation, training, and inference based on a memory bank. The bank keeps several games per player instead of reducing everything to an average, which makes it possible to retrieve close examples and study the model's confusions." },
            { kind: "h2", text: "Results" },
            { kind: "p", text: "The results are modest, but they show signal." },
            {
              kind: "table",
              head: ["Evaluation", "Result", "Reference"],
              numeric: [1],
              rows: [
                ["Identification, 10 players", "Top-5 of 79.75% to 82.25%", "Random Top-5: 50%"],
                ["Identification, 200 players", "Top-1 of 2.05%", "Random Top-1: 0.5%"],
                ["Raw Elo", "MAE of 329.0", "Predictions compressed to the centre"],
                ["Calibrated Elo", "MAE of 260.6", "Out-of-fold linear calibration"],
                ["Elo over 20 games", "MAE of about 224", "Best calibrated method"],
              ],
            },
            { kind: "p", text: "With 200 players exact identification drops sharply, as expected, though it stays about four times above chance. The model was not trained to estimate Elo, but the embedding does carry information about playing level." },
            { kind: "h2", text: "Conclusion" },
            { kind: "p", text: "The system is not a robust authorship identifier and does not try to compete with engine-based methods. It is a complete first implementation of a visual and temporal approach to comparing how people play." },
            { kind: "p", text: "The most valuable outcome is confirming that there is usable signal and understanding the problem better: style, level, colour, game phase, clock and repertoire are all mixed together. Separating those factors remains future work." },
          ],
          links: [{ label: "Code on GitHub", href: "https://github.com/andrewyernau/tfe_chess_stylometry" }],
        },
      ],
      reportsTitle: "Technical reports",
      reportsIntro: "Coursework from my degree, in Spanish, with its LaTeX source.",
      reportLink: "View source",
      reports: [
        { title: "Wireless network design in La Costera", summary: "Radio links, materials, budget and EIRP regulations to bring internet access to a village.", authors: "André Yermak and Álvaro Hernández", href: `${REPORTS}/network%20area%20project` },
        { title: "Radio communication fundamentals", summary: "Maximum number of walls against distance to keep 54 Mbps on 802.11g, using the path-loss model and a link budget.", authors: "André Yermak and Álvaro Hernández", href: `${REPORTS}/radiocom%20ej1` },
        { title: "Multiple-access techniques", summary: "Mean throughput of slotted ALOHA with M stations and its limit as the number of stations tends to infinity.", authors: "André Yermak and Álvaro Hernández", href: `${REPORTS}/aloha%20ej2` },
        { title: "Optimising an FSA", summary: "The effect of frame length on Frame Slotted ALOHA performance, modelled as a Markov chain.", authors: "Álvaro Hernández and André Yermak", href: `${REPORTS}/ModSim%20FSA` },
      ],
    },
    contact: {
      title: "Contact",
      description: "Email, GitHub and contact form for André Yermak Naumenko.",
      intro: "For opportunities, collaborations or a technical conversation, write to me directly or use the form.",
      channels: { email: "Email", github: "GitHub", linkedin: "LinkedIn", location: "Location", locationValue: "Murcia, Spain" },
      formTitle: "Form",
      name: "Name",
      email: "Email",
      message: "Message",
      messageHint: "Between 10 and 5000 characters.",
      submit: "Send message",
      sending: "Sending…",
      sentTitle: "Message received",
      sentText: "Thank you. I'll get back to you as soon as I can.",
      sendAnother: "Write another message",
      errors: {
        name: "Enter your name, between 2 and 100 characters.",
        email: "Enter a valid email so I can reply.",
        message: "The message must be between 10 and 5000 characters.",
      },
      limited: "Too many messages have been sent from your connection. Try again in an hour or write to the address above.",
      failure: "The message could not be sent. Your text is still here: try again in a few minutes or write to the address above.",
    },
  },
};
