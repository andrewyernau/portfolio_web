import { describe, expect, test } from "bun:test";
import type { Database } from "./db/client";
import { createApp } from "./app";
import { parseConfig } from "./config";
import { content, sections, type Locale } from "./site/content";
import { sectionPath } from "./site/views";

const config = parseConfig({
  APP_ENV: "test",
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  ANALYTICS_HMAC_SECRET: "a".repeat(32),
});

function app(db = {} as Database) {
  return createApp({ config, db, pingDatabase: async () => {} });
}

const get = (path: string, headers: Record<string, string> = {}, db?: Database) =>
  app(db).fetch(new Request(`http://localhost${path}`, { headers }), {});

function submit(path: string, fields: Record<string, string>, headers: Record<string, string> = {}, db?: Database) {
  return app(db).fetch(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", ...headers },
      body: new URLSearchParams(fields),
    }),
    {},
  );
}

function allPages(): string[] {
  const paths: string[] = [];
  for (const locale of ["es", "en"] as Locale[]) {
    for (const section of sections) paths.push(sectionPath(locale, section));
    for (const group of content[locale].projects.groups) {
      for (const project of group.projects) paths.push(`${sectionPath(locale, "projects")}/${project.id}`);
    }
    for (const article of content[locale].articles.items) paths.push(`${sectionPath(locale, "articles")}/${article.id}`);
  }
  return paths;
}

const valid = { name: "Ada", email: "ada@example.com", message: "Un mensaje suficientemente largo." };

describe("pages", () => {
  test("every page renders a complete document with htmx and missing.css", async () => {
    for (const path of allPages()) {
      const response = await get(path);
      expect(response.status).toBe(200);
      const html = await response.text();
      expect(html.startsWith("<!doctype html>")).toBe(true);
      expect(html).toContain("/static/vendor/htmx-2.0.11.min.js");
      expect(html).toContain("/static/vendor/missing-1.3.0.min.css");
      expect(html).toContain('hx-boost="true"');
    }
  });

  test("copy uses no separator or arrow glyphs", async () => {
    for (const path of allPages()) {
      const html = await (await get(path)).text();
      expect(html).not.toMatch(/[·•→←↑↓›‹▸◂↺]/);
    }
  });

  test("links its own assets with a content version and preloads both text weights", async () => {
    const html = await (await get("/es")).text();
    expect(html).toMatch(/href="\/static\/site\.css\?v=[0-9a-f]{12}"/);
    expect(html).toMatch(/src="\/static\/site\.js\?v=[0-9a-f]{12}"/);
    for (const weight of [400, 600]) {
      expect(html).toContain(`<link rel="preload" href="/static/vendor/fonts/ibm-plex-sans-latin-${weight}-normal.woff2"`);
    }
  });

  test("copy does not introduce phrases with a colon", async () => {
    for (const path of allPages()) {
      const html = await (await get(path)).text();
      const text = html.replace(/<head>[\s\S]*?<\/head>/, "").replace(/<[^>]+>/g, " ");
      expect(text).not.toMatch(/[\p{L}\d%]: \S/u);
    }
  });

  test("keeps project and article links inside the locale", async () => {
    for (const locale of ["es", "en"] as Locale[]) {
      const links = content[locale].projects.groups.flatMap((g) => g.projects.flatMap((p) => p.links ?? []));
      for (const link of links.filter((l) => l.href.startsWith("/"))) {
        expect(link.href.startsWith(`/${locale}/`)).toBe(true);
        expect((await get(link.href)).status).toBe(200);
      }
    }
  });

  test("redirects the root and the old publications address", async () => {
    expect((await get("/")).headers.get("location")).toBe("/es");
    const old = await get("/en/publications");
    expect(old.status).toBe(301);
    expect(old.headers.get("location")).toBe("/en/projects");
  });

  test("unknown addresses are real 404 pages in the visitor's language", async () => {
    const response = await get("/en/nothing-here");
    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Page not found");
  });

  test("the language link points at the same page in the other language", async () => {
    const html = await (await get("/es/proyectos/kubo")).text();
    expect(html).toContain('href="/en/projects/kubo"');
  });

  test("the projects page shows addresses and does not explain itself", async () => {
    const html = await (await get("/en/projects")).text();
    expect(html).not.toContain("its own page");
    expect(html).toContain('<a href="https://kubo.csmak.com">kubo.csmak.com</a>');
  });

  test("the self-hosting page has the system diagram, with csmak.com and no addresses of the machines", async () => {
    for (const path of ["/es/proyectos/selfhosting", "/en/projects/selfhosting"]) {
      const html = await (await get(path)).text();
      expect(html).toContain('class="dg"');
      expect(html).toContain("csmak.com");
      expect(html).not.toMatch(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
    }
  });

  test("the name is the only link to home in the header", async () => {
    const html = await (await get("/es/cv")).text();
    const nav = html.slice(html.indexOf('class="site-nav"'), html.indexOf("</nav>"));
    expect(nav).not.toContain('href="/es"');
    expect(html).toContain('class="site-name" href="/es"');
  });

  test("a storage failure on analytics does not affect the page", async () => {
    const failing = { insert: () => { throw new Error("down"); } } as unknown as Database;
    expect((await get("/es", {}, failing)).status).toBe(200);
  });

  test("honors privacy opt-out before touching storage", async () => {
    let touched = false;
    const db = { insert: () => { touched = true; throw new Error("unexpected"); } } as unknown as Database;
    await get("/es", { "sec-gpc": "1" }, db);
    await Bun.sleep(0);
    expect(touched).toBe(false);
  });
});

describe("contact form", () => {
  test("htmx receives only the form, with errors and what was typed", async () => {
    const response = await submit("/es/contacto", { name: "x", email: "no", message: "corto" }, { "hx-request": "true" });
    expect(response.status).toBe(422);
    const html = await response.text();
    expect(html.startsWith('<form id="contact-form"')).toBe(true);
    expect(html).toContain(content.es.contact.errors.email);
    expect(html).toContain('value="no"');
    expect(html).toContain("corto");
  });

  test("without JavaScript the same submit returns the whole page", async () => {
    const response = await submit("/en/contact", { name: "x", email: "no", message: "short" });
    expect(response.status).toBe(422);
    const html = await response.text();
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain(content.en.contact.errors.name);
  });

  test("escapes what the visitor typed", async () => {
    const html = await (await submit("/es/contacto", { name: "<script>x</script>", email: "no", message: "m" }, { "hx-request": "true" })).text();
    expect(html).not.toContain("<script>x");
  });

  test("the hidden field reports success without storing anything", async () => {
    const response = await submit("/es/contacto", { ...valid, website: "spam" }, { "hx-request": "true" });
    expect(response.status).toBe(200);
    expect(await response.text()).toContain(content.es.contact.sentTitle);
  });

  test("a storage failure keeps the message and says so", async () => {
    const response = await submit("/es/contacto", valid, { "hx-request": "true" });
    expect(response.status).toBe(503);
    const html = await response.text();
    expect(html).toContain(content.es.contact.failure);
    expect(html).toContain(valid.message);
  });
});

describe("operations", () => {
  test("serves liveness and readiness", async () => {
    const live = await get("/api/v1/health/live");
    expect(await live.json()).toEqual({ status: "ok" });
    expect((await get("/api/v1/health/ready")).status).toBe(200);
  });
});
