import type { Attribution } from "./attribution";

export interface Conversion {
  /**
   * Unique identifier for this conversion journey.
   *
   * Used in:
   * - dataLayer events
   * - GA4 debugging
   * - future offline conversion matching
   */
  eventId: string;

  /**
   * User started the conversion journey.
   *
   * Set when CTA is clicked.
   */
  started: boolean;

  /**
   * Lead form was successfully submitted.
   *
   * Set after backend confirms lead creation.
   */
  completed: boolean;

  /**
   * Analytics event was dispatched.
   *
   * Prevents duplicate generate_lead events.
   */
  fired: boolean;

  /**
   * Creation timestamp.
   *
   * Used for conversion expiration.
   */
  createdAt: number;

  /**
   * Marketing attribution captured
   * when conversion started.
   */
  attribution: Attribution;
}
