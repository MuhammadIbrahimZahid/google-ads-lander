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
 * Ensure a conversion journey exists.
 *
 * Called when user clicks the CTA.
 *
 * This only starts the journey.
 * It does not mean a lead was created.
 */
export function ensureConversion() {
  if (typeof window === "undefined") return;

  const existing = readConversion();

  if (existing && !isExpired(existing)) {
    return;
  }

  const conversion: Conversion = {
    eventId: crypto.randomUUID(),
    started: true,
    completed: false,
    fired: false,
    createdAt: Date.now(),
  };

  saveConversion(conversion);
}

/**
 * Mark conversion as completed after
 * successful lead database creation.
 */
export function completeConversion() {
  if (typeof window === "undefined") return;

  const conversion = readConversion();

  if (!conversion) {
    return;
  }

  conversion.completed = true;

  saveConversion(conversion);
}

/**
 * Determine whether generate_lead
 * is allowed to fire.
 *
 * A conversion can only complete when:
 *
 * CTA started journey
 * +
 * Lead was successfully created
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
 * Mark the current conversion as completed
 * after generate_lead has been sent.
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
