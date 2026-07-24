import type { Attribution } from "@/types/attribution";
import type { Conversion } from "@/types/session";
import { getAttribution } from "@/lib/attribution";

const CONVERSION_KEY = "conversion";
const CONVERSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Save full conversion object into sessionStorage
 */
function saveConversion(conversion: Conversion) {
  sessionStorage.setItem(CONVERSION_KEY, JSON.stringify(conversion));
}

/**
 * Remove the active conversion
 */
function clearConversion() {
  sessionStorage.removeItem(CONVERSION_KEY);
}

/**
 * Read conversion object safely
 */
function readConversion(): Conversion | null {
  const value = sessionStorage.getItem(CONVERSION_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Conversion;
  } catch {
    return null;
  }
}

/**
 * Check whether conversion expired.
 */
function isExpired(conversion: Conversion) {
  return Date.now() - conversion.createdAt > CONVERSION_EXPIRY_MS;
}

/**
 * Get current conversion journey.
 */
export function getConversion(): Conversion | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readConversion();
}

/**
 * Ensure a conversion journey exists.
 *
 * Called when user clicks CTA.
 *
 * Attribution is captured once
 * and attached to the journey.
 */
export function ensureConversion() {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readConversion();

  if (existing && !isExpired(existing)) {
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
 * Mark conversion completed
 * after successful lead creation.
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
 * Determine whether generate_lead
 * can fire.
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

  return conversion.started && conversion.completed;
}

/**
 * Mark conversion as fired.
 */
export function consumeConversion() {
  if (typeof window === "undefined") {
    return;
  }

  const conversion = readConversion();

  if (!conversion) {
    return;
  }

  conversion.fired = true;

  saveConversion(conversion);
}
