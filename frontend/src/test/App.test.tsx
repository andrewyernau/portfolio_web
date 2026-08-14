import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { App } from "../App";

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

describe("portfolio application", () => {
  it("renders a bilingual, accessible navigation and preserves the current page", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.stubGlobal("navigator", { ...navigator, sendBeacon: vi.fn(), doNotTrack: "1" });
    renderAt("/es/publicaciones");

    expect(screen.getByRole("heading", { name: "Publicaciones" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navegación principal" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("link", { name: "Switch to English" }));
    expect(screen.getByRole("heading", { name: "Publications" })).toBeInTheDocument();
  });

  it("uses coherent fallback content when the API is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    vi.stubGlobal("navigator", { ...navigator, sendBeacon: vi.fn(), doNotTrack: "1" });
    renderAt("/en");

    expect(screen.getByRole("heading", { name: /turn complex problems/i })).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledWith("/api/v1/content/en", expect.any(Object)));
  });

  it("submits contact data including the honeypot and shows success", async () => {
    const fetchMock = vi.fn()
      .mockRejectedValueOnce(new Error("content offline"))
      .mockResolvedValueOnce(new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("navigator", { ...navigator, sendBeacon: vi.fn(), doNotTrack: "1" });
    renderAt("/es/contacto");

    await userEvent.type(screen.getByLabelText("Nombre"), "Ada Lovelace");
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "ada@example.test");
    await userEvent.type(screen.getByLabelText("Mensaje"), "Me gustaría comentar un proyecto.");
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText(/Mensaje recibido/)).toBeInTheDocument();
    const request = fetchMock.mock.calls.find(([url]) => url === "/api/v1/contact");
    expect(JSON.parse(request?.[1]?.body as string)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.test",
      message: "Me gustaría comentar un proyecto.",
      locale: "es",
      website: "",
    });
  });
});
