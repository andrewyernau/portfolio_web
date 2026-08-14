import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { usePageView } from "../hooks/usePageView";

function Probe() {
  usePageView("es");
  return null;
}

describe("privacy-aware page views", () => {
  it("sends only path and locale", () => {
    const sendBeacon = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, sendBeacon, doNotTrack: "0", globalPrivacyControl: false });
    render(<MemoryRouter initialEntries={["/es/publicaciones?utm_source=nope"]}><Probe /></MemoryRouter>);

    expect(sendBeacon).toHaveBeenCalledOnce();
    expect(sendBeacon.mock.calls[0]?.[0]).toBe("/api/v1/analytics/pageviews");
  });

  it("honours Do Not Track", () => {
    const sendBeacon = vi.fn();
    vi.stubGlobal("navigator", { ...navigator, sendBeacon, doNotTrack: "1" });
    render(<MemoryRouter initialEntries={["/es"]}><Probe /></MemoryRouter>);
    expect(sendBeacon).not.toHaveBeenCalled();
  });
});
