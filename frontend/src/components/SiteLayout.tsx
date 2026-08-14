import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { isLocale } from "../content";
import { usePageView } from "../hooks/usePageView";
import { usePortfolioContent } from "../hooks/usePortfolioContent";
import { Footer } from "./Footer";
import { Header } from "./Header";

export interface SiteOutletContext {
  content: ReturnType<typeof usePortfolioContent>;
}

function LocalizedLayout({ locale }: { locale: "es" | "en" }) {
  const content = usePortfolioContent(locale);
  usePageView(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `${content.brand} — ${content.role}`;
  }, [content.brand, content.role, locale]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        {locale === "es" ? "Saltar al contenido" : "Skip to content"}
      </a>
      <Header locale={locale} content={content} />
      <main id="main-content">
        <Outlet context={{ content } satisfies SiteOutletContext} />
      </main>
      <Footer content={content} />
    </div>
  );
}

export function SiteLayout() {
  const { locale } = useParams();
  if (!isLocale(locale)) return <Navigate to="/es" replace />;
  return <LocalizedLayout locale={locale} />;
}
