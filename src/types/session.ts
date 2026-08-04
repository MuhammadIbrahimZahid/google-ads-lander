import type { Attribution } from "./attribution";
import type { EnhancedConversionPayload } from "./enhancedConversion";

/**
 * Conversion journey stored in sessionStorage.
 *
 * Represents the user's progress from
 * CTA interaction → lead submission → analytics event.
 */
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

  /**
   * Privacy-safe customer identity payload.
   *
   * Created after lead submission.
   *
   * Contains hashed identifiers that can
   * later be consumed by GTM/Google Ads.
   */
  enhancedConversion?: EnhancedConversionPayload;
}
