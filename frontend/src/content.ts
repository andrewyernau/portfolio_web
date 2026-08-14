export type Locale = "es" | "en";

export interface PublicationView {
  id: string;
  title: string;
  summary: string;
  meta: string;
}

export interface PortfolioContent {
  locale: Locale;
  brand: string;
  role: string;
  navigation: {
    home: string;
    publications: string;
    contact: string;
  };
  home: {
    eyebrow: string;
    title: string;
    introduction: string;
    primaryAction: string;
    secondaryAction: string;
  };
  publications: {
    eyebrow: string;
    title: string;
    introduction: string;
    items: PublicationView[];
  };
  contact: {
    eyebrow: string;
    title: string;
    introduction: string;
    nameLabel: string;
    emailLabel: string;
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
    brand: "Nombre Apellido",
    role: "Diseño y desarrollo de productos digitales",
    navigation: { home: "Inicio", publications: "Publicaciones", contact: "Contacto" },
    home: {
      eyebrow: "Portfolio · 2026",
      title: "Convierto problemas complejos en productos claros y útiles.",
      introduction:
        "Trabajo entre estrategia, diseño e ingeniería para construir experiencias digitales cuidadas de principio a fin.",
      primaryAction: "Ver publicaciones",
      secondaryAction: "Hablemos",
    },
    publications: {
      eyebrow: "Notas y trabajo",
      title: "Publicaciones",
      introduction:
        "Una selección provisional de aprendizajes, decisiones de producto y pequeños experimentos.",
      items: [
        { id: "systems", title: "Diseñar sistemas que puedan cambiar", summary: "Notas sobre límites claros, decisiones reversibles y mantenimiento.", meta: "Próximamente · 6 min" },
        { id: "privacy", title: "Analítica con menos datos", summary: "Qué señales conservan valor sin construir un perfil de cada visita.", meta: "Próximamente · 5 min" },
        { id: "delivery", title: "La fiabilidad también es experiencia", summary: "Por qué los estados de error forman parte del diseño del producto.", meta: "Próximamente · 4 min" },
      ],
    },
    contact: {
      eyebrow: "Contacto",
      title: "¿Tienes algo en mente?",
      introduction: "Cuéntame el contexto, incluso si la idea todavía no está del todo definida.",
      nameLabel: "Nombre",
      emailLabel: "Correo electrónico",
      messageLabel: "Mensaje",
      submitLabel: "Enviar mensaje",
      submittingLabel: "Enviando…",
      successTitle: "Mensaje recibido",
      successMessage: "Gracias. Te responderé tan pronto como pueda.",
      errorMessage: "No se pudo enviar. Revisa los datos o inténtalo de nuevo en unos minutos.",
    },
    footer: "Construido con cuidado, sin rastreadores de terceros.",
  },
  en: {
    locale: "en",
    brand: "Name Surname",
    role: "Digital product design and development",
    navigation: { home: "Home", publications: "Publications", contact: "Contact" },
    home: {
      eyebrow: "Portfolio · 2026",
      title: "I turn complex problems into clear, useful products.",
      introduction:
        "I work across strategy, design and engineering to build thoughtful digital experiences from end to end.",
      primaryAction: "View publications",
      secondaryAction: "Let’s talk",
    },
    publications: {
      eyebrow: "Notes and work",
      title: "Publications",
      introduction:
        "A provisional selection of product lessons, design decisions and small experiments.",
      items: [
        { id: "systems", title: "Designing systems that can change", summary: "Notes on clear boundaries, reversible decisions and maintenance.", meta: "Coming soon · 6 min" },
        { id: "privacy", title: "Analytics with less data", summary: "Which signals remain useful without building a profile of every visit.", meta: "Coming soon · 5 min" },
        { id: "delivery", title: "Reliability is part of the experience", summary: "Why error states belong to product design.", meta: "Coming soon · 4 min" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Have something in mind?",
      introduction: "Share the context, even if the idea is not fully formed yet.",
      nameLabel: "Name",
      emailLabel: "Email address",
      messageLabel: "Message",
      submitLabel: "Send message",
      submittingLabel: "Sending…",
      successTitle: "Message received",
      successMessage: "Thank you. I’ll get back to you as soon as I can.",
      errorMessage: "Something went wrong. Check the details or try again in a few minutes.",
    },
    footer: "Built with care, without third-party trackers.",
  },
};

export const isLocale = (value: string | undefined): value is Locale => value === "es" || value === "en";
