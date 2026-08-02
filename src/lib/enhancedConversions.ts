import type {
  EnhancedConversionInput,
  EnhancedConversionPayload,
} from "@/types/enhancedConversion";

import {
  normalizeCountry,
  normalizeEmail,
  normalizePersonName,
  normalizePhone,
  normalizePostalCode,
} from "@/lib/normalization";

import { hashSHA256 } from "@/lib/hashing";

/**
 * Build an Enhanced Conversion payload.
 *
 * Flow:
 *
 * Raw customer data
 *
 * ↓
 *
 * Normalize
 *
 * ↓
 *
 * SHA-256 hash identity fields
 *
 * ↓
 *
 * Return GTM user_data payload
 */
export async function buildEnhancedConversionData(
  input: EnhancedConversionInput,
): Promise<EnhancedConversionPayload> {
  const normalizedEmail = normalizeEmail(input.email);

  const normalizedPhone = normalizePhone(input.phone);

  const normalizedFirstName = normalizePersonName(input.firstName);

  const normalizedLastName = normalizePersonName(input.lastName);

  const normalizedCountry = normalizeCountry(input.country);

  const normalizedPostalCode = normalizePostalCode(input.postalCode);

  const payload: EnhancedConversionPayload = {
    sha256_email_address: await hashSHA256(normalizedEmail),

    sha256_phone_number: await hashSHA256(normalizedPhone),

    address: {
      sha256_first_name: await hashSHA256(normalizedFirstName),

      sha256_last_name: await hashSHA256(normalizedLastName),

      country: normalizedCountry,

      postal_code: normalizedPostalCode,
    },
  };

  return payload;
}
