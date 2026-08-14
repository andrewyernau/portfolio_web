import type { Locale } from "../content";

export type PageKey = "home" | "publications" | "contact";

const slugs: Record<Locale, Record<PageKey, string>> = {
  es: { home: "", publications: "publicaciones", contact: "contacto" },
  en: { home: "", publications: "publications", contact: "contact" },
};

export const pagePath = (locale: Locale, page: PageKey) =>
  `/${locale}${slugs[locale][page] ? `/${slugs[locale][page]}` : ""}`;

export function pageFromPath(pathname: string): PageKey {
  const segment = pathname.split("/").filter(Boolean)[1];
  if (segment === "publicaciones" || segment === "publications") return "publications";
  if (segment === "contacto" || segment === "contact") return "contact";
  return "home";
}
