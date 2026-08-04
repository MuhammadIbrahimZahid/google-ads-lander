export interface Attribution {
  /**
   * Google Ads click identifier.
   *
   * Example:
   * gclid=xxxxx
   */
  gclid?: string;

  /**
   * Campaign attribution parameters.
   */
  utmSource?: string;

  utmMedium?: string;

  utmCampaign?: string;

  utmTerm?: string;

  utmContent?: string;

  /**
   * Previous page source.
   */
  referrer?: string;

  /**
   * First page where user landed.
   */
  landingPage?: string;

  /**
   * Browser/device information.
   */
  device?: string;
}

/**
 * First-touch attribution record.
 *
 * Stored permanently until cleared.
 *
 * Used to understand original acquisition source.
 */
export interface FirstTouchAttribution extends Attribution {
  /**
   * Timestamp when first attribution
   * was captured.
   */
  capturedAt: number;
}
