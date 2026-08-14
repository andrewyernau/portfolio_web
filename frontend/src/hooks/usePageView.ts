import { useEffect } from "react";
import type { PageViewRequest } from "@portfolio/contracts";
import { useLocation } from "react-router-dom";
import type { Locale } from "../content";
import { sendPageView } from "../lib/api";

interface PrivacyNavigator extends Navigator {
  globalPrivacyControl?: boolean;
}

export function usePageView(locale: Locale) {
  const { pathname } = useLocation();

  useEffect(() => {
    const privacyNavigator = navigator as PrivacyNavigator;
    if (navigator.doNotTrack === "1" || privacyNavigator.globalPrivacyControl === true) return;

    const payload = { path: pathname, locale } satisfies PageViewRequest;
    sendPageView(payload);
  }, [locale, pathname]);
}
