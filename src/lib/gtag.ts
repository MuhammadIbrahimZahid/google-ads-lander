declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function sendEvent<T extends object>(eventName: string, params?: T) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", eventName, params);
}
