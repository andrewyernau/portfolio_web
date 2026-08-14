import { useOutletContext } from "react-router-dom";
import { PageIntro } from "../components/PageIntro";
import type { SiteOutletContext } from "../components/SiteLayout";

export function PublicationsPage() {
  const { content } = useOutletContext<SiteOutletContext>();
  const { publications } = content;

  return (
    <section className="section-wrap page-section">
      <PageIntro eyebrow={publications.eyebrow} title={publications.title} introduction={publications.introduction} />
      <div className="publication-list">
        {publications.items.map((item, index) => (
          <article className="publication-card" key={item.id}>
            <span className="publication-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="publication-meta">{item.meta}</p>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
