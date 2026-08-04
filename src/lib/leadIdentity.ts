import type { EnhancedConversionInput } from "@/types/enhancedConversion";

const LEAD_IDENTITY_KEY = "lead_identity";

/**
 * Save lead identity temporarily.
 *
 * Used only during the conversion journey
 * before building Enhanced Conversion data.
 */
export function saveLeadIdentity(identity: EnhancedConversionInput) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(LEAD_IDENTITY_KEY, JSON.stringify(identity));
}

/**
 * Read stored lead identity.
 */
export function getLeadIdentity(): EnhancedConversionInput | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = sessionStorage.getItem(LEAD_IDENTITY_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as EnhancedConversionInput;
  } catch {
    sessionStorage.removeItem(LEAD_IDENTITY_KEY);

    return null;
  }
}

/**
 * Remove stored identity.
 *
 * Cleanup after conversion tracking.
 */
export function clearLeadIdentity() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(LEAD_IDENTITY_KEY);
}
