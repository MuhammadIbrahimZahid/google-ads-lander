export interface CreateLeadInput {
  /**
   * Customer information
   */
  name: string;

  email: string;

  phone?: string;

  /**
   * Landing context
   */
  landingPage?: string;

  referrer?: string;

  /**
   * Google attribution
   */
  gclid?: string;

  utmSource?: string;

  utmMedium?: string;

  utmCampaign?: string;

  utmTerm?: string;

  utmContent?: string;

  /**
   * Device information
   */
  device?: string;

  /**
   * Conversion identity
   *
   * Links the lead to the
   * conversion journey.
   */
  conversionEventId?: string;

  /**
   * Development/testing fields
   */
  debugSource?: string;

  debugCampaign?: string;

  debugClickId?: string;
}

export interface Lead extends CreateLeadInput {
  id: number;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}
