export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;

  landingPage?: string;
  referrer?: string;

  gclid?: string;

  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  debugSource?: string;
  debugCampaign?: string;
  debugClickId?: string;
}

export interface Lead extends CreateLeadInput {
  id: number;

  status: string;

  createdAt: Date;
  updatedAt: Date;
}
