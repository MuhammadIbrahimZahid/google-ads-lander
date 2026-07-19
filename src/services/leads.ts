import pool from "@/lib/db";

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string | null;

  landingPage?: string | null;
  referrer?: string | null;

  gclid?: string | null;

  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;

  debugSource?: string | null;
  debugCampaign?: string | null;
  debugClickId?: string | null;
}

export async function createLead(data: CreateLeadInput) {
  const result = await pool.query(
    `
    INSERT INTO public.leads (
      name,
      email,
      phone,
      landing_page,
      referrer,
      gclid,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      debug_source,
      debug_campaign,
      debug_click_id
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
    )
    RETURNING *;
    `,
    [
      data.name,
      data.email,
      data.phone ?? null,

      data.landingPage ?? null,
      data.referrer ?? null,

      data.gclid ?? null,

      data.utmSource ?? null,
      data.utmMedium ?? null,
      data.utmCampaign ?? null,
      data.utmTerm ?? null,
      data.utmContent ?? null,

      data.debugSource ?? null,
      data.debugCampaign ?? null,
      data.debugClickId ?? null,
    ],
  );

  return result.rows[0];
}
