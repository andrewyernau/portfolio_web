import { Hono, type Context } from "hono";
import { z } from "zod";
import type { AppConfig } from "../config";
import { acceptContact, consumeContactRateLimit } from "../contact";
import type { Database } from "../db/client";
import { analyticsPageViews } from "../db/schema";
import { contactAccepted, pageViews } from "../metrics";
import { analyticsOptedOut, coarseUserAgent, dailyVisitorHash, resolveClientIp, resolveCountry } from "../privacy";
import { content, type Locale, type Section } from "./content";
import {
  ArticlePage,
  ArticlesPage,
  ContactForm,
  ContactPage,
  CvPage,
  HomePage,
  MessagePage,
  ProjectPage,
  ProjectsPage,
  sectionPath,
  type FormErrors,
  type FormState,
  type FormValues,
} from "./views";

export type SiteEnv = {
  Bindings: { remoteAddress?: string };
  Variables: { requestId: string };
};

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5_000),
});

const LOCALES: Locale[] = ["es", "en"];

function document(c: Context<SiteEnv>, page: unknown, status: 200 | 404 | 422 | 429 | 500 | 503 = 200) {
  return c.html(`<!doctype html>${page}`, status);
}

function field(body: Record<string, unknown>, name: string): string {
  const value = body[name];
  return typeof value === "string" ? value : "";
}

export function notFound(c: Context<SiteEnv>) {
  const locale: Locale = c.req.path.startsWith("/en") ? "en" : "es";
  const { ui } = content[locale];
  return document(c, <MessagePage locale={locale} title={ui.notFoundTitle} text={ui.notFoundText} link={ui.notFoundLink} />, 404);
}

export function serverError(c: Context<SiteEnv>) {
  const locale: Locale = c.req.path.startsWith("/en") ? "en" : "es";
  const { ui } = content[locale];
  return document(c, <MessagePage locale={locale} title={ui.errorTitle} text={ui.errorText} />, 500);
}

export function createSite(config: AppConfig, db: Database) {
  const site = new Hono<SiteEnv>();

  // Recorded on the server now that there is no client application. A failure
  // here must never cost the visitor the page.
  async function recordView(c: Context<SiteEnv>, locale: Locale) {
    if (analyticsOptedOut(c.req.raw.headers)) return;
    const ip = resolveClientIp(c.req.raw.headers, c.env?.remoteAddress, config);
    const userAgent = coarseUserAgent(c.req.header("user-agent"));
    await db.insert(analyticsPageViews).values({
      path: c.req.path,
      locale,
      countryCode: resolveCountry(c.req.raw.headers, c.env?.remoteAddress, config),
      deviceClass: userAgent.deviceClass,
      userAgentFamily: userAgent.family,
      visitorDayHash: dailyVisitorHash(ip, config.ANALYTICS_HMAC_SECRET),
    });
    pageViews.inc({ locale, device: userAgent.deviceClass });
  }

  function page(c: Context<SiteEnv>, locale: Locale, node: unknown) {
    void recordView(c, locale).catch((error: unknown) => {
      console.error(JSON.stringify({ event: "pageview_failed", error: error instanceof Error ? error.name : "unknown" }));
    });
    return document(c, node);
  }

  site.get("/", (c) => c.redirect("/es"));

  for (const locale of LOCALES) {
    const data = content[locale];
    const path = (section: Section) => sectionPath(locale, section);

    site.get(path("home"), (c) => page(c, locale, <HomePage locale={locale} />));
    site.get(path("cv"), (c) => page(c, locale, <CvPage locale={locale} />));
    site.get(path("projects"), (c) => page(c, locale, <ProjectsPage locale={locale} />));
    site.get(path("articles"), (c) => page(c, locale, <ArticlesPage locale={locale} />));
    site.get(path("contact"), (c) => page(c, locale, <ContactPage locale={locale} state={{ status: "editing" }} />));

    for (const group of data.projects.groups) {
      for (const project of group.projects) {
        site.get(`${path("projects")}/${project.id}`, (c) => page(c, locale, <ProjectPage locale={locale} project={project} />));
      }
    }
    for (const article of data.articles.items) {
      site.get(`${path("articles")}/${article.id}`, (c) => page(c, locale, <ArticlePage locale={locale} article={article} />));
    }

    // The previous site's address for the projects page.
    site.get(`/${locale}/${locale === "es" ? "publicaciones" : "publications"}`, (c) => c.redirect(path("projects"), 301));

    site.post(path("contact"), async (c) => {
      const body = (await c.req.parseBody()) as Record<string, unknown>;
      const values: FormValues = { name: field(body, "name"), email: field(body, "email"), message: field(body, "message") };

      const respond = (state: FormState, status: 200 | 422 | 429 | 503 = 200) =>
        c.req.header("hx-request")
          ? c.html(`${<ContactForm locale={locale} state={state} />}`, status)
          : document(c, <ContactPage locale={locale} state={state} />, status);

      const parsed = ContactSchema.safeParse(values);
      if (!parsed.success) {
        const errors: FormErrors = {};
        for (const issue of parsed.error.issues) {
          const name = issue.path[0] as keyof FormValues;
          errors[name] = data.contact.errors[name];
        }
        return respond({ status: "editing", values, errors }, 422);
      }

      // Bots that fill the hidden field are told it worked and nothing is stored.
      if (field(body, "website")) return respond({ status: "sent" });

      try {
        const ip = resolveClientIp(c.req.raw.headers, c.env?.remoteAddress, config);
        const key = dailyVisitorHash(ip, config.ANALYTICS_HMAC_SECRET);
        if (!(await consumeContactRateLimit(db, key, config.CONTACT_RATE_LIMIT_PER_HOUR))) {
          return respond({ status: "editing", values, notice: data.contact.limited }, 429);
        }
        await acceptContact(db, { ...parsed.data, locale });
      } catch (error) {
        console.error(JSON.stringify({ event: "contact_failed", error: error instanceof Error ? error.name : "unknown" }));
        return respond({ status: "editing", values, notice: data.contact.failure }, 503);
      }
      contactAccepted.inc();
      return respond({ status: "sent" });
    });
  }

  return site;
}
