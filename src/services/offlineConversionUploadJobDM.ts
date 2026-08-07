import pool from "@/lib/db";

import { uploadOfflineConversionDM } from "./googleAdsOfflineConversionDM";

export interface UploadJobDMResult {
  processed: number;

  uploaded: number;

  failed: number;
}

export async function runOfflineConversionUploadJobDM(): Promise<UploadJobDMResult> {
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

        AND
        (
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
      await uploadOfflineConversionDM(row.id);

      uploaded++;
    } catch (error) {
      console.error(`DM upload failed ${row.id}`, error);

      failed++;
    }
  }

  return {
    processed: result.rows.length,

    uploaded,

    failed,
  };
}
