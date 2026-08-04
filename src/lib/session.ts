import type { Attribution } from "@/types/attribution";
import type { Conversion } from "@/types/session";
import { getAttribution } from "@/lib/attribution";

const CONVERSION_KEY = "conversion";

const CONVERSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Save conversion journey.
 */
function saveConversion(conversion: Conversion) {
  sessionStorage.setItem(CONVERSION_KEY, JSON.stringify(conversion));
}

/**
 * Remove conversion journey.
 */
function clearConversion() {
  sessionStorage.removeItem(CONVERSION_KEY);
}

/**
 * Read conversion safely.
 */
function readConversion(): Conversion | null {
  const value = sessionStorage.getItem(CONVERSION_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Conversion;
  } catch {
    clearConversion();
    return null;
  }
}

/**
 * Check expiry.
 */
function isExpired(conversion: Conversion) {
  return Date.now() - conversion.createdAt > CONVERSION_EXPIRY_MS;
}

/**
 * Get current conversion.
 */
export function getConversion(): Conversion | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readConversion();
}

/**
 * Create a new conversion journey.
 *
 * Called when user clicks CTA.
 */
export function ensureConversion() {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readConversion();

  /**
   * Keep active incomplete journeys.
   */
  if (
    existing &&
    !isExpired(existing) &&
    existing.started &&
    !existing.completed
  ) {
    return;
  }

  const attribution: Attribution = getAttribution() ?? {};

  const conversion: Conversion = {
    eventId: crypto.randomUUID(),

    started: true,

    completed: false,

    fired: false,

    createdAt: Date.now(),

    attribution,
  };

  saveConversion(conversion);
}

/**
 * Mark lead submission complete.
 */
export function completeConversion() {
  if (typeof window === "undefined") {
    return;
  }

  const conversion = readConversion();

  if (!conversion) {
    return;
  }

  conversion.completed = true;

  saveConversion(conversion);
}

/**
 * Check whether GA4 conversion
 * can be sent.
 */
export function canConvert() {
  if (typeof window === "undefined") {
    return false;
  }

  const conversion = readConversion();

  if (!conversion) {
    return false;
  }

  if (isExpired(conversion)) {
    clearConversion();

    return false;
  }

  return conversion.started && conversion.completed && !conversion.fired;
}

/**
 * Mark GA4 conversion dispatched.
 */
export function consumeConversion() {
  if (typeof window === "undefined") {
    return;
  }

  const conversion = readConversion();

  if (!conversion) {
    return;
  }

  if (conversion.fired) {
    return;
  }

  conversion.fired = true;

  saveConversion(conversion);
}
