import type { ContactRequest, PageViewRequest } from "@portfolio/contracts";

const API_ROOT = "/api/v1";

export async function sendContact(payload: ContactRequest) {
  const response = await fetch(API_ROOT + "/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (response.status !== 202) throw new Error("Contact request failed: " + response.status);
}

export function sendPageView(payload: PageViewRequest) {
  const body = JSON.stringify(payload);
  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(API_ROOT + "/analytics/pageviews", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch(API_ROOT + "/analytics/pageviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
