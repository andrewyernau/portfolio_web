import { describe, expect, test } from "bun:test";
import {
  ContactRequestSchema,
  PageViewRequestSchema,
  SiteContentSchema,
} from "./index";

describe("public contracts", () => {
  test("rejects contact payloads that are too small", () => {
    expect(
      ContactRequestSchema.safeParse({
        name: "A",
        email: "not-an-email",
        message: "short",
        locale: "es",
      }).success,
    ).toBe(false);
  });

  test("rejects analytics paths with tracking data", () => {
    expect(PageViewRequestSchema.safeParse({ path: "/work?utm=x", locale: "en" }).success).toBe(false);
    expect(PageViewRequestSchema.safeParse({ path: "/work#project", locale: "en" }).success).toBe(false);
    expect(PageViewRequestSchema.safeParse({ path: "/work/project-1", locale: "en" }).success).toBe(true);
  });

  test("requires bilingual content to use the shared shape", () => {
    expect(
      SiteContentSchema.safeParse({
        language: "es",
        navigation: { home: "Inicio", publications: "Publicaciones", contact: "Contacto" },
        home: { eyebrow: "Portfolio", title: "En construcción", introduction: "Texto" },
        publications: { title: "Publicaciones", introduction: "Texto", items: [] },
        contact: {
          title: "Contacto",
          introduction: "Texto",
          nameLabel: "Nombre",
          emailLabel: "Email",
          messageLabel: "Mensaje",
          submitLabel: "Enviar",
          successMessage: "Enviado",
        },
        footer: { note: "Nota" },
      }).success,
    ).toBe(true);
  });
});
