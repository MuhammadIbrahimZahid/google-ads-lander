import type { Attribution, FirstTouchAttribution } from "@/types/attribution";

const FIRST_TOUCH_KEY = "first_touch_attribution";

/**
 * Save first-touch attribution.
 */
function saveFirstTouch(attribution: FirstTouchAttribution) {
  try {
    localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(attribution));
  } catch {
    // Ignore storage failures.
    // Tracking should never break UX.
  }
}

/**
 * Read first-touch attribution safely.
 */
function readFirstTouch(): FirstTouchAttribution | null {
  try {
    const value = localStorage.getItem(FIRST_TOUCH_KEY);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as FirstTouchAttribution;
  } catch {
    localStorage.removeItem(FIRST_TOUCH_KEY);

    return null;
  }
}

/**
 * Capture original acquisition source.
 *
 * Existing first-touch data
 * is never overwritten.
 */
export function captureFirstTouchAttribution(attribution: Attribution) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readFirstTouch();

  if (existing) {
    return;
  }

  saveFirstTouch({
    ...attribution,

    capturedAt: Date.now(),
  });
}

/**
 * Get original acquisition source.
 */
export function getFirstTouchAttribution(): Attribution | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readFirstTouch();
}

/**
 * Remove first-touch attribution.
 */
export function clearFirstTouchAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(FIRST_TOUCH_KEY);
}
