import { AnalyticsEvents } from "@/constants/analytics";
import { pushToDataLayer } from "./dataLayer";

import type { GenerateLeadParams, HeroCTAParams } from "@/types/analytics";

/**
 * Track successful lead generation.
 *
 * Fires only after:
 *
 * 1. Lead is saved successfully.
 * 2. Enhanced conversion data is prepared.
 *
 * Sends:
 *
 * - GA4 generate_lead event data
 * - Google Ads enhanced conversion user data
 */
export function trackGenerateLead(params: GenerateLeadParams) {
  pushToDataLayer(AnalyticsEvents.GENERATE_LEAD, {
    ...params,
  });
}

/**
 * Track hero CTA interaction.
 *
 * Used for measuring user intent
 * before lead completion.
 */
export function trackHeroCTAClick(params: HeroCTAParams) {
  pushToDataLayer(AnalyticsEvents.HERO_CTA_CLICK, {
    ...params,
  });
}
