/**
 * A customer's hashed identity.
 *
 * Values are normalized first,
 * then SHA-256 hashed.
 */
export interface HashedIdentity {
  /**
   * SHA-256 hashed email.
   */
  sha256_email_address?: string;

  /**
   * SHA-256 hashed phone number.
   */
  sha256_phone_number?: string;

  /**
   * Hashed address identity fields.
   */
  address?: {
    /**
     * SHA-256 hashed first name.
     */
    sha256_first_name?: string;

    /**
     * SHA-256 hashed last name.
     */
    sha256_last_name?: string;

    /**
     * ISO 3166-1 alpha-2 country code.
     *
     * Example:
     * PK
     */
    country?: string;

    /**
     * Postal code.
     */
    postal_code?: string;
  };
}

/**
 * Raw customer data collected
 * from the lead form.
 */
export interface EnhancedConversionInput {
  firstName?: string;

  lastName?: string;

  email?: string;

  phone?: string;

  country?: string;

  postalCode?: string;
}

/**
 * Final payload sent through GTM.
 */
export type EnhancedConversionPayload = HashedIdentity;
