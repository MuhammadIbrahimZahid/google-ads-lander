const HERO_CLICK_KEY = "hero_click_fired";

export function hasTrackedHeroClick() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(HERO_CLICK_KEY) !== null;
}

export function markHeroClickTracked() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(HERO_CLICK_KEY, "1");
}
