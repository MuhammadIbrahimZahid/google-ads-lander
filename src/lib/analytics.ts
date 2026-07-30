import { AnalyticsEvents } from "@/constants/analytics";
import { pushToDataLayer } from "./dataLayer";

import type { GenerateLeadParams, HeroCTAParams } from "@/types/analytics";

/**
 * Track successful lead generation.
 *
 * This event should only fire
 * after the lead is successfully saved.
 */
export function trackGenerateLead(params: GenerateLeadParams) {
  pushToDataLayer(AnalyticsEvents.GENERATE_LEAD, {
    ...params,
  });
}

/**
 * Track hero CTA interaction.
 *
 * Used for measuring user intent.
 */
export function trackHeroCTAClick(params: HeroCTAParams) {
  pushToDataLayer(AnalyticsEvents.HERO_CTA_CLICK, {
    ...params,
  });
}
