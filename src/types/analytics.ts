export interface GenerateLeadParams {
  lead_source?: string;
  value?: number;
  currency?: string;

  /**
   * Stable identifier for this conversion event.
   * Useful for debugging, deduplication,
   * and future server-side/offline processing.
   */
  event_id?: string;
}

export interface HeroCTAParams {
  button_name: string;
}
