import { fallbackContent, type Locale, type PortfolioContent } from "../content";

/** Profile copy is versioned with the site to avoid stale database content overriding it at render time. */
export function usePortfolioContent(locale: Locale): PortfolioContent {
  return fallbackContent[locale];
}
