import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { Child, FC } from "hono/jsx";
import {
  EMAIL,
  GITHUB,
  LINKEDIN,
  NAME,
  content,
  sections,
  slugs,
  type Article,
  type Diagram,
  type DiagramGroup,
  type Entry,
  type Locale,
  type Project,
  type Row,
  type Section,
} from "./content";

const HTMX_CONFIG = JSON.stringify({
  includeIndicatorStyles: false,
  allowEval: false,
  // 422 and 429 come back as the form itself, with its errors and what was typed.
  responseHandling: [
    { code: "[23]..", swap: true },
    { code: "422|429", swap: true },
    { code: "[45]..", swap: false, error: true },
  ],
});

export const sectionPath = (locale: Locale, section: Section) => {
  const slug = slugs[locale][section];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
};

const itemPath = (locale: Locale, section: Section, id: string) => `${sectionPath(locale, section)}/${id}`;
const other = (locale: Locale): Locale => (locale === "es" ? "en" : "es");

type LayoutProps = {
  locale: Locale;
  title?: string;
  description: string;
  section?: Section;
  /** Path of this page without the locale's section, when it has an equivalent in the other language. */
  item?: string;
  pager?: boolean;
  children?: Child;
};

/** The query changes with the file, so Nginx can let browsers keep it for a year. */
function versioned(file: string): string {
  const bytes = readFileSync(new URL(`../../../static/${file}`, import.meta.url));
  return `/static/${file}?v=${createHash("sha256").update(bytes).digest("hex").slice(0, 12)}`;
}

const MISSING_CSS = versioned("missing.trimmed.css");
const SITE_CSS = versioned("site.css");
const SITE_JS = versioned("site.js");

export const Layout: FC<LayoutProps> = ({ locale, title, description, section, item, pager, children }) => {
  const { ui } = content[locale];
  const pathFor = (l: Locale) => {
    if (!section) return `/${l}`;
    return item ? itemPath(l, section, item) : sectionPath(l, section);
  };
  const position = section ? sections.indexOf(section) : -1;
  const previous = pager && position > 0 ? sections[position - 1] : undefined;
  const next = pager && position >= 0 && position < sections.length - 1 ? sections[position + 1] : undefined;

  return (
    <html lang={locale}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title ? `${title}, ${NAME}` : NAME}</title>
        <meta name="description" content={description} />
        <meta name="color-scheme" content="light dark" />
        <meta name="htmx-config" content={HTMX_CONFIG} />
        <link rel="canonical" href={`https://yernau.com${pathFor(locale)}`} />
        <link rel="alternate" hreflang={locale} href={`https://yernau.com${pathFor(locale)}`} />
        <link rel="alternate" hreflang={other(locale)} href={`https://yernau.com${pathFor(other(locale))}`} />
        <link rel="icon" href="/static/favicon.svg" type="image/svg+xml" />
        <link rel="preload" href="/static/vendor/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
        <link rel="preload" href="/static/vendor/fonts/ibm-plex-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
        <link rel="stylesheet" href={MISSING_CSS} />
        <link rel="stylesheet" href={SITE_CSS} />
        <script src="/static/vendor/htmx-2.0.11.min.js" defer></script>
        <script src={SITE_JS} defer></script>
      </head>
      <body hx-boost="true">
        <a class="skip" href="#content">{ui.skip}</a>
        <header class="site-header">
          <div class="wrap">
            <a class="site-name" href={`/${locale}`} aria-current={section === "home" ? "page" : undefined}>{NAME}</a>
            <nav class="site-nav" aria-label={ui.navLabel}>
              {sections.filter((s) => s !== "home").map((s) => (
                <a href={sectionPath(locale, s)} aria-current={s === section ? "page" : undefined}>{ui.nav[s]}</a>
              ))}
              {/* A full load, so the document's lang changes with the text. */}
              <a class="lang" href={pathFor(other(locale))} lang={other(locale)} hreflang={other(locale)} aria-label={ui.otherLocaleLabel} hx-boost="false">
                {ui.otherLocale}
              </a>
            </nav>
          </div>
        </header>
        <main id="content" class="wrap">
          {children}
          {(previous || next) && (
            <nav class="pager" aria-label={`${ui.previous}, ${ui.next}`}>
              {previous && (
                <a href={sectionPath(locale, previous)} rel="prev">
                  <small>{ui.previous}</small>
                  <span>{ui.nav[previous]}</span>
                </a>
              )}
              {next && (
                <a class="next" href={sectionPath(locale, next)} rel="next">
                  <small>{ui.next}</small>
                  <span>{ui.nav[next]}</span>
                </a>
              )}
            </nav>
          )}
        </main>
        <footer class="site-footer">
          <div class="wrap">
            <p>© {new Date().getFullYear()} {NAME}</p>
            <p>{ui.footer}</p>
          </div>
        </footer>
      </body>
    </html>
  );
};

const externalLinks = (project: Project) =>
  (project.links ?? []).map((l) => l.href).filter((href) => href.startsWith("https://"));

// The readable part of an address. A report's folder only adds noise to the list.
const addressOf = (href: string) =>
  decodeURI(href)
    .replace(/^https:\/\//, "")
    .replace(/\/tree\/.*$/, "");

const Rows: FC<{ rows: Row[] }> = ({ rows }) => (
  <dl class="lines">
    {rows.map((r) => (
      <div class="line">
        <dt>{r.label}</dt>
        <dd>{r.value}</dd>
      </div>
    ))}
  </dl>
);

const Entries: FC<{ entries: Entry[] }> = ({ entries }) => (
  <ul class="lines">
    {entries.map((e) => (
      <li class="line">
        <p class="when">{e.when}</p>
        <div>
          <h3>{e.title}</h3>
          {e.where && <p class="entry-sub">{e.where}</p>}
          {e.text && <p>{e.text}</p>}
          {e.points && (
            <ul class="stack">
              {e.points.map((p) => (
                <li>{p}</li>
              ))}
            </ul>
          )}
        </div>
      </li>
    ))}
  </ul>
);

export const HomePage: FC<{ locale: Locale }> = ({ locale }) => {
  const { home } = content[locale];
  return (
    <Layout locale={locale} section="home" description={home.description} pager>
      <h1>{NAME}</h1>
      <p class="lede">{home.lede}</p>
      {home.paragraphs.map((p) => (
        <p>{p}</p>
      ))}
      <h2>{home.areasTitle}</h2>
      <Rows rows={home.areas} />
    </Layout>
  );
};

export const CvPage: FC<{ locale: Locale }> = ({ locale }) => {
  const { cv } = content[locale];
  return (
    <Layout locale={locale} section="cv" title={cv.title} description={cv.description} pager>
      <h1>{cv.title}</h1>
      <p><a href="/main.pdf" download hx-boost="false">{cv.pdf}</a></p>
      <h2>{cv.experienceTitle}</h2>
      <Entries entries={cv.experience} />
      <h2>{cv.infrastructureTitle}</h2>
      <Entries entries={cv.infrastructure} />
      <h2>{cv.educationTitle}</h2>
      <Entries entries={cv.education} />
      <h2>{cv.eventsTitle}</h2>
      <Entries entries={cv.events} />
      <h2>{cv.skillsTitle}</h2>
      <Rows rows={cv.skills} />
      <h2>{cv.languagesTitle}</h2>
      <Rows rows={cv.languages} />
      <h2>{cv.otherTitle}</h2>
      <Entries entries={cv.other} />
    </Layout>
  );
};

export const ProjectsPage: FC<{ locale: Locale }> = ({ locale }) => {
  const { projects } = content[locale];
  return (
    <Layout locale={locale} section="projects" title={projects.title} description={projects.description} pager>
      <h1>{projects.title}</h1>
      {projects.groups.map((group) => (
        <>
          <h2>{group.title}</h2>
          <ul class="lines">
            {group.projects.map((p) => (
              <li class="line">
                <h3><a href={itemPath(locale, "projects", p.id)}>{p.title}</a></h3>
                <div>
                  <p>{p.summary}</p>
                  {externalLinks(p).map((href) => (
                    <p class="address"><a href={href}>{addressOf(href)}</a></p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </>
      ))}
    </Layout>
  );
};

const DiagramNode: FC<{ node: Row }> = ({ node }) => (
  <div class="dg-node">
    <strong>{node.label}</strong>
    <span>{node.value}</span>
  </div>
);

const DiagramGroups: FC<{ groups: DiagramGroup[] }> = ({ groups }) => (
  <>
    {groups.map((group) => (
      <div class="dg-group">
        <h4>{group.title}</h4>
        <ul>
          {group.items.map((item) => (
            <li>
              <span>{item.name}</span>
              {item.address && (
                <span class="dg-address">
                  {group.linked ? <a href={`https://${item.address}`}>{item.address}</a> : item.address}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </>
);

const SystemDiagram: FC<{ diagram: Diagram }> = ({ diagram }) => (
  <figure class="dg" aria-label={diagram.label}>
    <div class="dg-map">
      <div class="dg-public">
        <DiagramNode node={diagram.internet} />
        <p class="dg-link">{diagram.publicLink}</p>
        <DiagramNode node={diagram.edge} />
        <p class="dg-link dg-tunnel">{diagram.tunnelLink}</p>
      </div>
      <div class="dg-private">
        <DiagramNode node={diagram.devices} />
        <p class="dg-link dg-tunnel">{diagram.privateLink}</p>
      </div>
      <div class="dg-server">
        <div class="dg-server-head">
          <strong>{diagram.server.label}</strong>
          <span>{diagram.server.value}</span>
        </div>
        <section class="dg-col dg-col-web">
          <h4 class="dg-col-title">{diagram.throughProxy}</h4>
          <DiagramNode node={diagram.proxy} />
          <DiagramGroups groups={diagram.proxied} />
        </section>
        <section class="dg-col">
          <h4 class="dg-col-title">{diagram.direct}</h4>
          <DiagramGroups groups={diagram.unproxied} />
        </section>
        <section class="dg-col">
          <h4 class="dg-col-title">{diagram.privateOnly}</h4>
          <DiagramGroups groups={diagram.restricted} />
        </section>
        <p class="dg-backup">{diagram.backup}</p>
      </div>
    </div>
    <figcaption>{diagram.caption}</figcaption>
  </figure>
);

export const ProjectPage: FC<{ locale: Locale; project: Project }> = ({ locale, project }) => {
  const { ui } = content[locale];
  return (
    <Layout locale={locale} section="projects" item={project.id} title={project.title} description={project.summary}>
      <p class="back"><a href={sectionPath(locale, "projects")}>{ui.backToProjects}</a></p>
      <h1>{project.title}</h1>
      <p class="lede">{project.summary}</p>
      <ul class="stack">
        {project.details.map((d) => (
          <li>{d}</li>
        ))}
      </ul>
      <p class="tags">{project.tags.join(", ")}</p>
      {project.diagram && <SystemDiagram diagram={project.diagram} />}
      {project.links && !project.diagram && (
        <ul class="stack">
          {project.links.map((l) => (
            <li><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
      )}
    </Layout>
  );
};

export const ArticlesPage: FC<{ locale: Locale }> = ({ locale }) => {
  const { articles } = content[locale];
  return (
    <Layout locale={locale} section="articles" title={articles.title} description={articles.description} pager>
      <h1>{articles.title}</h1>
      <h2>{articles.articlesTitle}</h2>
      <ul class="lines">
        {articles.items.map((a) => (
          <li class="line">
            <p class="when">{a.date}</p>
            <div>
              <h3><a href={itemPath(locale, "articles", a.id)}>{a.title}</a></h3>
              <p>{a.summary}</p>
            </div>
          </li>
        ))}
      </ul>
      <h2>{articles.reportsTitle}</h2>
      <p>{articles.reportsIntro}</p>
      <ul class="lines">
        {articles.reports.map((r) => (
          <li class="line">
            <h3>{r.title}</h3>
            <div>
              <p>{r.summary}</p>
              <p class="entry-sub">{r.authors}</p>
              <a href={r.href}>{articles.reportLink}</a>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const ArticlePage: FC<{ locale: Locale; article: Article }> = ({ locale, article }) => {
  const { ui } = content[locale];
  return (
    <Layout locale={locale} section="articles" item={article.id} title={article.title} description={article.summary}>
      <p class="back"><a href={sectionPath(locale, "articles")}>{ui.backToArticles}</a></p>
      <article>
        <h1>{article.title}</h1>
        <p class="when">{article.date}</p>
        {article.body.map((block) => {
          if (block.kind === "p") return <p>{block.text}</p>;
          if (block.kind === "h2") return <h2>{block.text}</h2>;
          return (
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>{block.head.map((h) => <th scope="col">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr>{row.map((cell, i) => <td class={block.numeric.includes(i) ? "num" : undefined}>{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
        {article.links && (
          <ul class="stack">
            {article.links.map((l) => (
              <li><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        )}
      </article>
    </Layout>
  );
};

export type FormValues = { name: string; email: string; message: string };
export type FormErrors = Partial<Record<keyof FormValues, string>>;
export type FormState =
  | { status: "editing"; values?: FormValues; errors?: FormErrors; notice?: string }
  | { status: "sent" };

const Field: FC<{
  id: keyof FormValues;
  label: string;
  error?: string;
  hint?: string;
  children?: Child;
}> = ({ id, label, error, hint, children }) => (
  <div class="field">
    <label for={id}>{label}</label>
    {children}
    {hint && <p class="field-hint" id={`${id}-hint`}>{hint}</p>}
    {error && <p class="field-error" id={`${id}-error`}>{error}</p>}
  </div>
);

export const ContactForm: FC<{ locale: Locale; state: FormState }> = ({ locale, state }) => {
  const { contact } = content[locale];
  const action = sectionPath(locale, "contact");
  if (state.status === "sent") {
    return (
      <div id="contact-form" role="status">
        <p class="notice"><strong>{contact.sentTitle}</strong> {contact.sentText}</p>
        <p><a href={action}>{contact.sendAnother}</a></p>
      </div>
    );
  }
  const { values, errors = {}, notice } = state;
  const described = (id: keyof FormValues, hint = false) =>
    [hint && `${id}-hint`, errors[id] && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <form
      id="contact-form"
      class="contact-form"
      method="post"
      action={action}
      hx-post={action}
      hx-target="this"
      hx-swap="outerHTML"
      hx-disabled-elt="find button"
      novalidate
    >
      <Field id="name" label={contact.name} error={errors.name}>
        <input id="name" name="name" type="text" autocomplete="name" required maxlength={100} value={values?.name} aria-invalid={errors.name ? "true" : undefined} aria-describedby={described("name")} />
      </Field>
      <Field id="email" label={contact.email} error={errors.email}>
        <input id="email" name="email" type="email" autocomplete="email" required maxlength={254} value={values?.email} aria-invalid={errors.email ? "true" : undefined} aria-describedby={described("email")} />
      </Field>
      <Field id="message" label={contact.message} error={errors.message} hint={contact.messageHint}>
        <textarea id="message" name="message" rows={8} required maxlength={5000} aria-invalid={errors.message ? "true" : undefined} aria-describedby={described("message", true)}>{values?.message}</textarea>
      </Field>
      <div class="trap" aria-hidden="true">
        <label for="website">Website</label>
        <input id="website" name="website" type="text" tabindex={-1} autocomplete="off" />
      </div>
      {notice && <p class="notice" role="alert">{notice}</p>}
      <p class="notice" id="contact-failure" role="alert" hidden>{contact.failure}</p>
      <button class="button" type="submit">{contact.submit}</button>
    </form>
  );
};

export const ContactPage: FC<{ locale: Locale; state: FormState }> = ({ locale, state }) => {
  const { contact } = content[locale];
  return (
    <Layout locale={locale} section="contact" title={contact.title} description={contact.description} pager>
      <h1>{contact.title}</h1>
      <p>{contact.intro}</p>
      <dl class="lines">
        <div class="line">
          <dt>{contact.channels.email}</dt>
          <dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
        </div>
        <div class="line">
          <dt>{contact.channels.github}</dt>
          <dd><a href={GITHUB}>github.com/andrewyernau</a></dd>
        </div>
        <div class="line">
          <dt>{contact.channels.linkedin}</dt>
          <dd><a href={LINKEDIN}>André Yermak Naumenko</a></dd>
        </div>
        <div class="line">
          <dt>{contact.channels.location}</dt>
          <dd>{contact.channels.locationValue}</dd>
        </div>
      </dl>
      <h2>{contact.formTitle}</h2>
      <ContactForm locale={locale} state={state} />
    </Layout>
  );
};

export const MessagePage: FC<{ locale: Locale; title: string; text: string; link?: string }> = ({ locale, title, text, link }) => (
  <Layout locale={locale} title={title} description={text}>
    <h1>{title}</h1>
    <p>{text}</p>
    {link && <p><a href={`/${locale}`}>{link}</a></p>}
  </Layout>
);
