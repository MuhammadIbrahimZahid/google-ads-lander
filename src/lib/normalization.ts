/**
 * Normalize an email address.
 *
 * Rules:
 * - Trim whitespace
 * - Convert to lowercase
 * - Remove dots from Gmail local parts
 */
export function normalizeEmail(email?: string): string | undefined {
  if (!email) {
    return undefined;
  }

  const normalized = email.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  const [localPart, domain] = normalized.split("@");

  if (!localPart || !domain) {
    return normalized;
  }

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${localPart.replace(/\./g, "")}@${domain}`;
  }

  return normalized;
}

/**
 * Normalize a phone number.
 *
 * Rules:
 * - Trim whitespace
 * - Remove formatting characters
 * - Preserve leading "+"
 */
export function normalizePhone(phone?: string): string | undefined {
  if (!phone) {
    return undefined;
  }

  const trimmed = phone.trim();

  if (!trimmed) {
    return undefined;
  }

  const hasPlus = trimmed.startsWith("+");

  const digits = trimmed.replace(/\D/g, "");

  if (!digits) {
    return undefined;
  }

  return hasPlus ? `+${digits}` : digits;
}

/**
 * Normalize a first or last name.
 *
 * Rules:
 * - Trim whitespace
 * - Collapse spaces
 * - Lowercase
 */
export function normalizePersonName(name?: string): string | undefined {
  if (!name) {
    return undefined;
  }

  const normalized = name.trim().replace(/\s+/g, " ").toLowerCase();

  return normalized || undefined;
}

/**
 * Normalize an ISO 3166-1 alpha-2 country code.
 *
 * Rules:
 * - Trim whitespace
 * - Convert to uppercase
 *
 * Example:
 * pk -> PK
 */
export function normalizeCountry(country?: string): string | undefined {
  if (!country) {
    return undefined;
  }

  const normalized = country.trim().toUpperCase();

  return normalized || undefined;
}

/**
 * Normalize a postal code.
 *
 * Rules:
 * - Trim whitespace
 * - Collapse multiple spaces
 */
export function normalizePostalCode(postalCode?: string): string | undefined {
  if (!postalCode) {
    return undefined;
  }

  const normalized = postalCode.trim().replace(/\s+/g, " ");

  return normalized || undefined;
}
