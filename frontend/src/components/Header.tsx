import { NavLink, useLocation } from "react-router-dom";
import type { Locale, PortfolioContent } from "../content";
import { pageFromPath, pagePath, type PageKey } from "../lib/routes";

export function Header({ locale, content }: { locale: Locale; content: PortfolioContent }) {
  const location = useLocation();
  const otherLocale: Locale = locale === "es" ? "en" : "es";
  const currentPage = pageFromPath(location.pathname);

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to={pagePath(locale, "home")} aria-label={`${content.brand}, ${content.navigation.home}`}>
          <span className="brand-mark" aria-hidden="true">N/A</span>
          <span>
            <strong>{content.brand}</strong>
            <small>{content.role}</small>
          </span>
        </NavLink>

        <nav className="primary-nav" aria-label={locale === "es" ? "Navegación principal" : "Primary navigation"}>
          {(Object.keys(content.navigation) as PageKey[]).map((page) => (
            <NavLink key={page} to={pagePath(locale, page)} end={page === "home"}>
              {content.navigation[page]}
            </NavLink>
          ))}
        </nav>

        <NavLink
          className="language-switch"
          to={pagePath(otherLocale, currentPage)}
          lang={otherLocale}
          aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}
        >
          {otherLocale.toUpperCase()}
        </NavLink>
      </div>
    </header>
  );
}
