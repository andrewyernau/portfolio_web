import { Link, useOutletContext } from "react-router-dom";
import type { SiteOutletContext } from "../components/SiteLayout";
import { pagePath } from "../lib/routes";

export function HomePage() {
  const { content } = useOutletContext<SiteOutletContext>();
  const { home, locale } = content;

  return (
    <>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <h1>{home.title}</h1>
          <p className="lede">{home.introduction}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to={pagePath(locale, "projects")}>{home.primaryAction}</Link>
            <Link className="text-link" to={pagePath(locale, "contact")}>{home.secondaryAction}<span aria-hidden="true"> →</span></Link>
          </div>
          <p className="availability">{home.availability}</p>
        </div>
        <dl className="profile-facts">
          {home.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="home-section section-wrap">
        <div className="section-heading">
          <h2>{home.experienceTitle}</h2>
        </div>
        <p className="experience-copy">{home.experience}</p>
      </section>
      <section className="home-section section-wrap featured-work">
        <div className="section-heading">
          <h2>{home.selectedTitle}</h2>
          <Link className="text-link" to={pagePath(locale, "projects")}>{locale === "es" ? "Todos los proyectos" : "All projects"}<span aria-hidden="true"> →</span></Link>
        </div>
        <div className="project-preview-list">
          {content.projects.items.slice(0, 3).map((project) => (
            <article className="project-preview" key={project.id}>
              <p>{project.category}</p>
              <h3>{project.title}</h3>
              <span>{project.summary}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
