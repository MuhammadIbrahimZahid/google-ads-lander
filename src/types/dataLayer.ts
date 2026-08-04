import type { EnhancedConversionPayload } from "./enhancedConversion";

/**
 * Generic GTM dataLayer event.
 *
 * Application pushes business events here.
 *
 * GTM decides how these events are
 * processed into GA4 / Google Ads tags.
 */
export interface DataLayerEvent {
  /**
   * GTM event name.
   */
  event: string;

  /**
   * Enhanced Conversion user data.
   *
   * Contains normalized and SHA-256
   * hashed customer identifiers.
   *
   * Consumed by GTM User-Provided Data
   * configuration.
   */
  user_data?: EnhancedConversionPayload;

  /**
   * Additional event payload.
   *
   * Examples:
   *
   * - event_id
   * - lead_source
   * - value
   * - currency
   */
  [key: string]: unknown;
}
