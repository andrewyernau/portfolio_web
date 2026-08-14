import { SiteContentSchema, type ContactRequest, type PageViewRequest, type SiteContent } from "@portfolio/contracts";
import type { Locale, PortfolioContent } from "../content";

const API_ROOT = "/api/v1";

export function adaptContent(payload: SiteContent, fallback: PortfolioContent): PortfolioContent {
  return {
    ...fallback,
    navigation: payload.navigation,
    footer: payload.footer.note,
    home: {
      ...fallback.home,
      eyebrow: payload.home.eyebrow,
      title: payload.home.title,
      introduction: payload.home.introduction,
    },
    publications: {
      ...fallback.publications,
      title: payload.publications.title,
      introduction: payload.publications.introduction,
      items: payload.publications.items.map((item) => ({
        id: item.slug,
        title: item.title,
        summary: item.summary,
        meta: item.status === "published"
          ? (payload.language === "es" ? "Publicado" : "Published")
          : (payload.language === "es" ? "Próximamente" : "Coming soon"),
      })),
    },
    contact: {
      ...fallback.contact,
      title: payload.contact.title,
      introduction: payload.contact.introduction,
      nameLabel: payload.contact.nameLabel,
      emailLabel: payload.contact.emailLabel,
      messageLabel: payload.contact.messageLabel,
      submitLabel: payload.contact.submitLabel,
      successMessage: payload.contact.successMessage,
    },
  };
}

export async function getContent(locale: Locale, fallback: PortfolioContent, signal?: AbortSignal) {
  const response = await fetch(`${API_ROOT}/content/${locale}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
  const parsed = SiteContentSchema.safeParse(await response.json());
  if (!parsed.success) throw new Error("Content response did not match its public contract");
  return adaptContent(parsed.data, fallback);
}

export async function sendContact(payload: ContactRequest) {
  const response = await fetch(`${API_ROOT}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.status !== 202) throw new Error(`Contact request failed: ${response.status}`);
}

export function sendPageView(payload: PageViewRequest) {
  const body = JSON.stringify(payload);
  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(`${API_ROOT}/analytics/pageviews`, new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch(`${API_ROOT}/analytics/pageviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
