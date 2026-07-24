import type { Attribution, FirstTouchAttribution } from "@/types/attribution";

const FIRST_TOUCH_KEY = "first_touch_attribution";

/**
 * Save first-touch attribution.
 *
 * This should only happen once.
 * Existing attribution is never overwritten.
 */
function saveFirstTouch(attribution: FirstTouchAttribution) {
  localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(attribution));
}

/**
 * Read first-touch attribution safely.
 */
function readFirstTouch(): FirstTouchAttribution | null {
  const value = localStorage.getItem(FIRST_TOUCH_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as FirstTouchAttribution;
  } catch {
    return null;
  }
}

/**
 * Capture first marketing source.
 *
 * Runs when user first arrives.
 *
 * Existing value is preserved.
 */
export function captureFirstTouchAttribution(attribution: Attribution) {
  if (typeof window === "undefined") {
    return;
  }

  const existing = readFirstTouch();

  /**
   * First touch already exists.
   *
   * Do not overwrite.
   */
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
 * Remove first-touch data.
 */
export function clearFirstTouchAttribution() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(FIRST_TOUCH_KEY);
}
