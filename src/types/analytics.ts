export interface GenerateLeadParams {
  /**
   * Source of the conversion.
   *
   * Example:
   * landing_page
   */
  lead_source: string;

  /**
   * Stable conversion identifier.
   *
   * Matches the conversion journey
   * stored in sessionStorage.
   */
  event_id: string;

  /**
   * Optional monetary value.
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
