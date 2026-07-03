import { AnalyticsEvents } from "@/constants/analytics";
import { sendEvent } from "./gtag";
import { GenerateLeadParams, HeroCTAParams } from "@/types/analytics";

export function trackGenerateLead(params?: GenerateLeadParams) {
  sendEvent(AnalyticsEvents.GENERATE_LEAD, params);
}

export function trackHeroCTAClick(params: HeroCTAParams) {
  sendEvent(AnalyticsEvents.HERO_CTA_CLICK, params);
}
