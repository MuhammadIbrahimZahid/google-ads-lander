import pool from "@/lib/db";

export interface ChangeLeadStatusInput {
  leadId: number;

  newStatus: string;

  changedBy?: string;

  reason?: string;

  metadata?: Record<string, unknown>;
}

export async function changeLeadStatus(input: ChangeLeadStatusInput) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /**
     * Lock lead row.
     */
    const leadResult = await client.query(
      `
      SELECT *
      FROM public.leads
      WHERE id = $1
      FOR UPDATE;
      `,
      [input.leadId],
    );

    if (leadResult.rows.length === 0) {
      throw new Error("Lead not found.");
    }

    const lead = leadResult.rows[0];

    /**
     * Prevent duplicate status changes.
     */
    if (lead.status === input.newStatus) {
      await client.query("COMMIT");

      return lead;
    }

    /**
     * Update lead status.
     */
    const updatedLeadResult = await client.query(
      `
      UPDATE public.leads
      SET
        status = $1,
        updated_at = NOW()

      WHERE id = $2

      RETURNING *;
      `,
      [input.newStatus, input.leadId],
    );

    const updatedLead = updatedLeadResult.rows[0];

    /**
     * Create immutable status history.
     */
    await client.query(
      `
      INSERT INTO public.lead_status_history
      (
        lead_id,
        previous_status,
        new_status,
        changed_by
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4
      );
      `,
      [input.leadId, lead.status, input.newStatus, input.changedBy ?? null],
    );

    /**
     * Create CRM lifecycle event.
     */
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
        gen_random_uuid(),
        $1,
        $2,
        $3
      );
      `,
      [
        input.leadId,

        "lead_status_changed",

        {
          previous_status: lead.status,

          new_status: input.newStatus,

          changed_by: input.changedBy ?? null,

          reason: input.reason ?? null,

          ...(input.metadata ?? {}),
        },
      ],
    );

    /**
     * Create Google Ads offline conversion upload job
     * only when lead first becomes qualified.
     */
    if (input.newStatus === "qualified" && lead.status !== "qualified") {
      if (!lead.gclid) {
        console.warn(
          `Lead ${lead.id} qualified but has no GCLID. Offline upload skipped.`,
        );
      } else {
        await client.query(
          `
      INSERT INTO public.offline_conversion_uploads
      (
        lead_id,
        conversion_name,
        gclid,
        conversion_time,
        conversion_value,
        currency_code
      )

      VALUES
      (
        $1,
        'Lead Qualified - Offline',
        $2,
        NOW(),
        1,
        'PKR'
      )

      ON CONFLICT
      (
        lead_id,
        conversion_name
      )

      DO NOTHING;
      `,
          [lead.id, lead.gclid],
        );
      }
    }

    await client.query("COMMIT");

    return updatedLead;
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Failed to change lead status:", error);

    throw error;
  } finally {
    client.release();
  }
}
