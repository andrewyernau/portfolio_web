import { useOutletContext } from "react-router-dom";
import { PageIntro } from "../components/PageIntro";
import type { SiteOutletContext } from "../components/SiteLayout";

export function PublicationsPage() {
  const { content } = useOutletContext<SiteOutletContext>();
  const { projects } = content;

  return (
    <section className="section-wrap page-section">
      <PageIntro title={projects.title} introduction={projects.introduction} />
      <div className="project-list">
        {projects.items.map((item) => (
          <article className="project-entry" key={item.id}>
            <div>
              <p className="project-category">{item.category}</p>
              <h2>{item.title}</h2>
              <p className="project-summary">{item.summary}</p>
              <p className="project-contribution"><strong>{localeLabel(content.locale, "Aportación", "Contribution")}:</strong> {item.contribution}</p>
              <ul className="project-details">
                {item.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              <div className="project-footer">
                <ul className="tag-list" aria-label={localeLabel(content.locale, "Tecnologías", "Technologies")}>
                  {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
                {item.links?.map((link) => (
                  <a className="text-link project-link" href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                    {link.label}<span aria-hidden="true"> ↗</span>
                  </a>
                ))}
              </div>
              {item.note && <p className="project-note">{item.note}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function localeLabel(locale: "es" | "en", es: string, en: string) {
  return locale === "es" ? es : en;
}
