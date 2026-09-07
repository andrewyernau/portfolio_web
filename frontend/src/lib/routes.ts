import type { Locale } from "../content";

export type PageKey = "home" | "projects" | "contact";

const slugs: Record<Locale, Record<PageKey, string>> = {
  es: { home: "", projects: "proyectos", contact: "contacto" },
  en: { home: "", projects: "projects", contact: "contact" },
};

export const pagePath = (locale: Locale, page: PageKey) =>
  `/${locale}${slugs[locale][page] ? `/${slugs[locale][page]}` : ""}`;

export function pageFromPath(pathname: string): PageKey {
  const segment = pathname.split("/").filter(Boolean)[1];
  if (segment === "proyectos" || segment === "projects" || segment === "publicaciones" || segment === "publications") return "projects";
  if (segment === "contacto" || segment === "contact") return "contact";
  return "home";
}
