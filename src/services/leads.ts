import pool from "@/lib/db";

import type { CreateLeadInput } from "@/types/lead";

export async function createLead(data: CreateLeadInput) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const leadResult = await client.query(
      `
      INSERT INTO public.leads (
        first_name,
        last_name,
        email,
        phone,

        country,
        postal_code,

        landing_page,
        referrer,

        gclid,

        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,

        device,
        event_id,

        debug_source,
        debug_campaign,
        debug_click_id
      )

      VALUES (
        $1,$2,$3,$4,
        $5,$6,
        $7,$8,
        $9,
        $10,$11,$12,$13,$14,
        $15,$16,
        $17,$18,$19
      )

      RETURNING *;
      `,
      [
        data.firstName,

        data.lastName,

        data.email,

        data.phone ?? null,

        data.country ?? null,

        data.postalCode ?? null,

        data.landingPage ?? null,

        data.referrer ?? null,

        data.gclid ?? null,

        data.utmSource ?? null,

        data.utmMedium ?? null,

        data.utmCampaign ?? null,

        data.utmTerm ?? null,

        data.utmContent ?? null,

        data.device ?? null,

        data.conversionEventId ?? null,

        data.debugSource ?? null,

        data.debugCampaign ?? null,

        data.debugClickId ?? null,
      ],
    );

    const lead = leadResult.rows[0];

    await client.query(
      `
      INSERT INTO public.lifecycle_events
      (
        event_id,
        lead_id,
        event_name,
        metadata
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4
      );
      `,
      [
        data.conversionEventId,

        lead.id,

        "lead_created",

        {
          source: "website",
        },
      ],
    );

    await client.query("COMMIT");

    return lead;
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Failed to create lead transaction:", error);

    throw error;
  } finally {
    client.release();
  }
}
