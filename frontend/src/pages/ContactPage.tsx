import { useState, type FormEvent } from "react";
import type { ContactRequest } from "@portfolio/contracts";
import { useOutletContext } from "react-router-dom";
import { PageIntro } from "../components/PageIntro";
import type { SiteOutletContext } from "../components/SiteLayout";
import { sendContact } from "../lib/api";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactPage() {
  const { content } = useOutletContext<SiteOutletContext>();
  const { contact, locale } = content;
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      locale,
      website: String(formData.get("website") ?? ""),
    } satisfies ContactRequest;

    setState("submitting");
    try {
      await sendContact(payload);
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="section-wrap page-section contact-grid">
      <PageIntro eyebrow={contact.eyebrow} title={contact.title} introduction={contact.introduction} />
      <form className="contact-form" onSubmit={handleSubmit} aria-busy={state === "submitting"}>
        <div className="form-field">
          <label htmlFor="name">{contact.nameLabel}</label>
          <input id="name" name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required />
        </div>
        <div className="form-field">
          <label htmlFor="email">{contact.emailLabel}</label>
          <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
        </div>
        <div className="form-field">
          <label htmlFor="message">{contact.messageLabel}</label>
          <textarea id="message" name="message" rows={7} minLength={10} maxLength={4000} required />
          <small>{locale === "es" ? "Entre 10 y 4.000 caracteres." : "Between 10 and 4,000 characters."}</small>
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button className="button button-primary" type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? contact.submittingLabel : contact.submitLabel}
        </button>
        <div className="form-status" aria-live="polite" aria-atomic="true">
          {state === "success" && <p className="status-success"><strong>{contact.successTitle}.</strong> {contact.successMessage}</p>}
          {state === "error" && <p className="status-error">{contact.errorMessage}</p>}
        </div>
      </form>
    </section>
  );
}
