import { useEffect, useState } from "react";
import { fallbackContent, type Locale, type PortfolioContent } from "../content";
import { getContent } from "../lib/api";

export function usePortfolioContent(locale: Locale) {
  const fallback = fallbackContent[locale];
  const [remote, setRemote] = useState<{ locale: Locale; content: PortfolioContent } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void getContent(locale, fallback, controller.signal)
      .then((content) => setRemote({ locale, content }))
      .catch(() => undefined);
    return () => controller.abort();
  }, [fallback, locale]);

  return remote?.locale === locale ? remote.content : fallback;
}
