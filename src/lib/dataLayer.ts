import type { DataLayerEvent } from "@/types/dataLayer";

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/**
 * Push an application event to Google Tag Manager's Data Layer.
 *
 * The application is intentionally unaware of:
 * - GA4 measurement IDs
 * - Google Ads conversion IDs
 * - GTM tags and triggers
 *
 * GTM decides how each business event is processed.
 */
export function pushToDataLayer<T extends object>(
  eventName: string,
  params?: T,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer || [];

  const event: DataLayerEvent = {
    event: eventName,
    ...params,
  };

  window.dataLayer.push(event);
}
