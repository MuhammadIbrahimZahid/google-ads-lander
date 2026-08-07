import pool from "@/lib/db";
import { uploadOfflineConversion } from "./googleAdsOfflineConversion";

export interface UploadJobResult {
  processed: number;
  uploaded: number;
  failed: number;
}

export async function runOfflineConversionUploadJob(): Promise<UploadJobResult> {
  const result = await pool.query(
    `
    SELECT id
    FROM public.offline_conversion_uploads
    WHERE
(
    upload_status = 'pending'
)
OR
(
    upload_status = 'failed'
    AND upload_attempts < 5
    AND (
        next_retry_at IS NULL
        OR next_retry_at <= NOW()
    )
)

ORDER BY created_at ASC;
    `,
  );

  let uploaded = 0;
  let failed = 0;

  for (const row of result.rows) {
    try {
      await uploadOfflineConversion(row.id);

      uploaded++;
    } catch (error) {
      console.error(`Offline conversion upload ${row.id} failed:`, error);

      failed++;
    }
  }

  return {
    processed: result.rows.length,
    uploaded,
    failed,
  };
}
