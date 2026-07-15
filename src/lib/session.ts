import { Conversion } from "@/types/session";

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
 * Check whether a conversion has expired.
 */
function isExpired(conversion: Conversion) {
  return Date.now() - conversion.createdAt > CONVERSION_EXPIRY_MS;
}

export function getConversion(): Conversion | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readConversion();
}

/**
 * Ensure a conversion exists.
 * Reuses the current conversion if still valid,
 * otherwise creates a fresh one.
 */
export function ensureConversion() {
  if (typeof window === "undefined") return;

  const existing = readConversion();

  if (existing && !isExpired(existing)) {
    return;
  }

  const conversion: Conversion = {
    eventId: crypto.randomUUID(),
    allowed: true,
    fired: false,
    createdAt: Date.now(),
  };

  saveConversion(conversion);
}

/**
 * Determine whether the current conversion
 * is eligible to be completed.
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

  return conversion.allowed;
}

/**
 * Mark the current conversion as completed.
 */
export function consumeConversion() {
  if (typeof window === "undefined") return;

  const conversion = readConversion();

  if (!conversion) {
    return;
  }

  conversion.fired = true;

  saveConversion(conversion);
}
