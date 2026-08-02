import type { EnhancedConversionPayload } from "./enhancedConversion";

export interface GenerateLeadParams {
  /**
   * Source of the conversion event.
   *
   * Example:
   * landing_page
   */
  lead_source: string;

  /**
   * Stable conversion identifier.
   *
   * Used to connect:
   *
   * CTA click
   * ↓
   * Lead submission
   * ↓
   * generate_lead event
   */
  event_id: string;

  /**
   * Enhanced Conversion user data.
   *
   * Contains SHA-256 hashed
   * first-party customer information.
   *
   * Passed through GTM for
   * Google Ads enhanced conversions.
   */
  user_data?: EnhancedConversionPayload;

  /**
   * Optional conversion value.
   */
  value?: number;

  /**
   * Optional currency code.
   *
   * Example:
   * USD
   */
  currency?: string;
}

export interface HeroCTAParams {
  /**
   * CTA label.
   *
   * Example:
   * Get Started
   */
  button_name: string;
}
