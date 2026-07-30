import { AnalyticsEvents } from "@/constants/analytics";
import { pushToDataLayer } from "./dataLayer";
import { GenerateLeadParams, HeroCTAParams } from "@/types/analytics";

export function trackGenerateLead(params?: GenerateLeadParams) {
  pushToDataLayer(AnalyticsEvents.GENERATE_LEAD, params);
}

export function trackHeroCTAClick(params: HeroCTAParams) {
  pushToDataLayer(AnalyticsEvents.HERO_CTA_CLICK, params);
}
