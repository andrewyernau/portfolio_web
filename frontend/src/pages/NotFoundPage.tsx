import { Link, useOutletContext } from "react-router-dom";
import type { SiteOutletContext } from "../components/SiteLayout";
import { pagePath } from "../lib/routes";

export function NotFoundPage() {
  const { content } = useOutletContext<SiteOutletContext>();
  return (
    <section className="section-wrap not-found">
      <p className="eyebrow">404</p>
      <h1>{content.locale === "es" ? "Esta página no existe." : "This page does not exist."}</h1>
      <Link className="text-link" to={pagePath(content.locale, "home")}>
        {content.locale === "es" ? "Volver al inicio" : "Back home"}<span aria-hidden="true"> →</span>
      </Link>
    </section>
  );
}
