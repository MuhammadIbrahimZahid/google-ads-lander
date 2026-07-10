import { Conversion } from "@/types/session";

const CONVERSION_KEY = "conversion";

/**
 * Save full conversion object into sessionStorage
 */
function saveConversion(conversion: Conversion) {
  sessionStorage.setItem(CONVERSION_KEY, JSON.stringify(conversion));
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

export function getConversion(): Conversion | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readConversion();
}

/**
 * Step 1: Called when CTA is clicked
 */
export function issueConversion() {
  if (typeof window === "undefined") return;

  const existing = readConversion();

  const conversion: Conversion = {
    eventId: existing?.eventId ?? crypto.randomUUID(),
    allowed: true,
    fired: existing?.fired ?? false,
    createdAt: existing?.createdAt ?? Date.now(),
  };

  saveConversion(conversion);
}

/**
 * Step 2: Check if conversion is allowed
 */
export function canConvert() {
  if (typeof window === "undefined") return false;

  const conversion = readConversion();
  return conversion?.allowed === true;
}

export function consumeConversion() {
  if (typeof window === "undefined") return;

  const conversion = readConversion();

  if (!conversion) {
    return;
  }

  conversion.fired = true;

  saveConversion(conversion);
}
