export interface CreateLeadInput {
  /**
   * Customer identity.
   */
  firstName: string;

  lastName: string;

  email: string;

  phone?: string;

  country?: string;

  postalCode?: string;

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
   */
  conversionEventId?: string;

  /**
   * Development/testing fields.
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
