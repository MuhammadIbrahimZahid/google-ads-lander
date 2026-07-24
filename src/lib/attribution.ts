import type { Attribution } from "@/types/attribution";

const ATTRIBUTION_KEY = "attribution";

/**
 * Save attribution data.
 */
function saveAttribution(attribution: Attribution) {
  sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
}

/**
 * Read attribution safely.
 */
function readAttribution(): Attribution | null {
  const value = sessionStorage.getItem(ATTRIBUTION_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Attribution;
  } catch {
    return null;
  }
}

/**
 * Capture attribution from current landing page.
 *
 * This runs when the user first lands.
 */
export function captureAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  const attribution: Attribution = {
    gclid: params.get("gclid") ?? undefined,

    utmSource: params.get("utm_source") ?? undefined,

    utmMedium: params.get("utm_medium") ?? undefined,

    utmCampaign: params.get("utm_campaign") ?? undefined,

    utmTerm: params.get("utm_term") ?? undefined,

    utmContent: params.get("utm_content") ?? undefined,

    referrer: document.referrer || undefined,

    landingPage: window.location.pathname,

    device: navigator.userAgent,
  };

  saveAttribution(attribution);
}

/**
 * Get current attribution.
 */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readAttribution();
}

/**
 * Remove attribution.
 */
export function clearAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(ATTRIBUTION_KEY);
}
