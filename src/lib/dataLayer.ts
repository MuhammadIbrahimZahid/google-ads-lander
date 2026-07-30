import type { DataLayerEvent } from "@/types/dataLayer";

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/**
 * Ensure GTM dataLayer exists.
 */
function getDataLayer() {
  if (typeof window === "undefined") {
    return null;
  }

  window.dataLayer = window.dataLayer || [];

  return window.dataLayer;
}

/**
 * Push application events
 * into Google Tag Manager dataLayer.
 *
 * The application does not know:
 *
 * - GA4 Measurement ID
 * - Google Ads conversion ID
 * - GTM tags
 *
 * GTM controls processing.
 */
export function pushToDataLayer<T extends object>(
  eventName: string,
  params?: T,
) {
  const dataLayer = getDataLayer();

  if (!dataLayer) {
    return;
  }

  const event: DataLayerEvent = {
    event: eventName,

    ...(params ?? {}),
  };

  if (process.env.NODE_ENV === "development") {
    console.log("[dataLayer event]", event);
  }

  dataLayer.push(event);
}
