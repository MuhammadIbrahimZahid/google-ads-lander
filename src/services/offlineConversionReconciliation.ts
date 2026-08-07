import pool from "@/lib/db";

export async function reconcileOfflineConversion(uploadId: number) {
  const result = await pool.query(
    `
    SELECT *
    FROM public.offline_conversion_uploads
    WHERE id = $1;
    `,
    [uploadId],
  );

  if (result.rows.length === 0) {
    throw new Error("Offline conversion upload not found.");
  }

  const upload = result.rows[0];

  if (upload.upload_status !== "uploaded") {
    throw new Error("Conversion is not uploaded yet.");
  }

  await pool.query(
    `
    UPDATE public.offline_conversion_uploads

    SET
      reconciliation_status = 'reconciled',

      reconciled_at = NOW(),

      reconciliation_notes =
      $1

    WHERE id = $2;
    `,
    ["Google Ads upload confirmed by reconciliation process.", uploadId],
  );

  return {
    success: true,
    uploadId,
  };
}
