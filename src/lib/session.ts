const CONVERSION_KEY = "conversion_allowed";

export function allowConversion() {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(CONVERSION_KEY, "true");
}

export function canConvert() {
  if (typeof window === "undefined") return false;

  return sessionStorage.getItem(CONVERSION_KEY) === "true";
}

export function clearConversion() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(CONVERSION_KEY);
}
