const HERO_CLICK_KEY = "hero_click_fired";

/**
 * Check whether hero CTA click
 * has already been tracked
 * in the current session.
 */
export function hasTrackedHeroClick() {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(HERO_CLICK_KEY) !== null;
}

/**
 * Mark hero CTA click as tracked
 * for this browser session.
 */
export function markHeroClickTracked() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(HERO_CLICK_KEY, "1");
}

/**
 * Remove hero click tracking state.
 *
 * Useful during testing/debugging.
 */
export function clearHeroClickTracking() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(HERO_CLICK_KEY);
}
