export interface CreateLeadInput {
  /**
   * Customer information.
   */
  name: string;

  email: string;

  phone?: string;

  /**
   * Landing context.
   */
  landingPage?: string;

  referrer?: string;

  /**
   * Google attribution.
   */
  gclid?: string;

  utmSource?: string;

  utmMedium?: string;

  utmCampaign?: string;

  utmTerm?: string;

  utmContent?: string;

  /**
   * Device information.
   */
  device?: string;

  /**
   * Conversion identity.
   *
   * Connects the lead record
   * with the frontend conversion journey.
   */
  conversionEventId?: string;

  /**
   * Development/testing fields.
   *
   * Useful when validating GTM,
   * GA4, and Google Ads flows.
   */
  debugSource?: string;

  debugCampaign?: string;

  debugClickId?: string;
}

export interface Lead extends CreateLeadInput {
  /**
   * Database primary key.
   */
  id: number;

  /**
   * Lead lifecycle state.
   *
   * Example:
   * new
   * contacted
   * converted
   */
  status: string;

  /**
   * Database timestamps.
   */
  createdAt: Date;

  updatedAt: Date;
}
