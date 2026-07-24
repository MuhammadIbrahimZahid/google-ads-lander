export interface Attribution {
  gclid?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  referrer?: string;

  landingPage?: string;

  device?: string;
}

export interface FirstTouchAttribution extends Attribution {
  /**
   * Timestamp when attribution was first captured.
   *
   * Used for first-touch attribution analysis.
   */
  capturedAt: number;
}
