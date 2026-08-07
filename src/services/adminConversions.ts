import pool from "@/lib/db";

export async function getAdminConversions() {
  const result = await pool.query(
    `
    SELECT
      ocu.id,
      ocu.lead_id,
      ocu.upload_status,

      ocu.reconciliation_status,
      ocu.reconciled_at,
      ocu.reconciliation_notes,

      ocu.google_job_id,
      ocu.google_error_code,
      ocu.google_error_message,

      ocu.uploaded_at,
      ocu.created_at,

      l.first_name,
      l.last_name,
      l.email

    FROM public.offline_conversion_uploads ocu

    JOIN public.leads l
      ON l.id = ocu.lead_id

    ORDER BY ocu.created_at DESC;
    `,
  );

  return result.rows;
}
