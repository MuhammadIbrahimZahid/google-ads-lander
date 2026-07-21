export interface Conversion {
  /**
   * Stable identifier for this conversion journey.
   * Used for GA debugging and future server-side processing.
   */
  eventId: string;

  /**
   * User clicked the CTA and entered the funnel.
   */
  started: boolean;

  /**
   * Lead was successfully created in the database.
   * Only completed conversions can send generate_lead.
   */
  completed: boolean;

  /**
   * generate_lead event has already been sent.
   * Prevents duplicate conversion firing.
   */
  fired: boolean;

  /**
   * Timestamp when the conversion journey started.
   */
  createdAt: number;
}
