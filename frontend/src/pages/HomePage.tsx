import { Link, useOutletContext } from "react-router-dom";
import type { SiteOutletContext } from "../components/SiteLayout";
import { pagePath } from "../lib/routes";

export function HomePage() {
  const { content } = useOutletContext<SiteOutletContext>();
  const { home, locale } = content;

  return (
    <section className="hero section-wrap">
      <div className="hero-copy">
        <p className="eyebrow">{home.eyebrow}</p>
        <h1>{home.title}</h1>
        <p className="lede">{home.introduction}</p>
        <div className="hero-actions">
          <Link className="button button-primary" to={pagePath(locale, "publications")}>{home.primaryAction}</Link>
          <Link className="text-link" to={pagePath(locale, "contact")}>{home.secondaryAction}<span aria-hidden="true"> →</span></Link>
        </div>
      </div>
      <aside className="hero-note" aria-label={locale === "es" ? "Áreas de trabajo" : "Areas of practice"}>
        <ol>
          <li><span>01</span><p>Product strategy</p></li>
          <li><span>02</span><p>Interface design</p></li>
          <li><span>03</span><p>Frontend systems</p></li>
        </ol>
      </aside>
    </section>
  );
}
