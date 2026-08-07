import { GoogleAdsApi, services } from "google-ads-api";

import pool from "@/lib/db";

const isTest = process.env.GOOGLE_ADS_MODE === "test";

const googleAdsClient = new GoogleAdsApi({
  client_id: isTest
    ? process.env.TEST_OAUTH_CLIENT_ID!
    : process.env.OAUTH_CLIENT_ID!,

  client_secret: isTest
    ? process.env.TEST_OAUTH_CLIENT_SECRET!
    : process.env.OAUTH_CLIENT_SECRET!,

  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

function getCustomer() {
  const isTest = process.env.GOOGLE_ADS_MODE === "test";

  return googleAdsClient.Customer({
    customer_id: isTest
      ? process.env.TEST_GOOGLE_ADS_CUSTOMER_ID!
      : process.env.GOOGLE_ADS_CUSTOMER_ID!,

    refresh_token: isTest
      ? process.env.TEST_GOOGLE_ADS_API_REFRESH_TOKEN!
      : process.env.GOOGLE_ADS_API_REFRESH_TOKEN!,

    login_customer_id: isTest
      ? process.env.TEST_GOOGLE_ADS_LOGIN_CUSTOMER_ID
      : process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  });
}

export async function uploadOfflineConversion(uploadId: number) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT *
      FROM public.offline_conversion_uploads
      WHERE id = $1
      AND upload_status != 'uploaded';
      `,
      [uploadId],
    );

    if (result.rows.length === 0) {
      throw new Error("Pending conversion upload not found.");
    }

    const upload = result.rows[0];

    if (!upload.gclid) {
      throw new Error("Missing GCLID.");
    }

    const customer = getCustomer();

    const conversionCustomerId =
      process.env.GOOGLE_ADS_MODE === "test"
        ? process.env.TEST_GOOGLE_ADS_CUSTOMER_ID
        : process.env.GOOGLE_ADS_CUSTOMER_ID;

    const conversionActionId =
      process.env.GOOGLE_ADS_MODE === "test"
        ? process.env.TEST_GOOGLE_ADS_QUALIFIED_LEAD_CONVERSION_ACTION_ID
        : process.env.GOOGLE_ADS_QUALIFIED_LEAD_CONVERSION_ACTION_ID;

    const conversionRequest = new services.UploadClickConversionsRequest({
      customer_id: conversionCustomerId!,

      conversions: [
        {
          gclid: upload.gclid,

          conversion_action: `customers/${conversionCustomerId}/conversionActions/${conversionActionId}`,

          conversion_date_time: new Date(upload.conversion_time)
            .toISOString()
            .replace("T", " ")
            .replace("Z", "+00:00"),

          conversion_value: Number(upload.conversion_value),

          currency_code: upload.currency_code,
        },
      ],

      partial_failure: true,

      validate_only: false,
    });

    const response =
      await customer.conversionUploads.uploadClickConversions(
        conversionRequest,
      );

    const googleErrorMessage = response.partial_failure_error?.message ?? null;

    const uploadStatus = googleErrorMessage ? "failed" : "uploaded";

    const googleDiagnostics = {
      job_id: response.job_id?.toString() ?? null,

      uploaded_results:
        response.results?.map((item) => ({
          gclid: item.gclid ?? null,
          conversion_action: item.conversion_action ?? null,
          conversion_date_time: item.conversion_date_time ?? null,
        })) ?? [],

      partial_failure_error: response.partial_failure_error
        ? {
            message: response.partial_failure_error.message ?? null,

            details: response.partial_failure_error.details ?? [],
          }
        : null,

      uploaded_at: new Date().toISOString(),
    };

    await client.query(
      `
      UPDATE public.offline_conversion_uploads

      SET
        upload_status = $1,
        google_job_id = $2,
        google_error_message = $3,
        google_response = $4,
        uploaded_at = NOW()

      WHERE id = $5;
      `,
      [
        uploadStatus,
        response.job_id?.toString() ?? null,
        googleErrorMessage,
        JSON.stringify(googleDiagnostics),
        uploadId,
      ],
    );

    return googleDiagnostics;
  } catch (error: unknown) {
    const googleErrorObject = error as {
      message?: string;
      request_id?: string;
      errors?: Array<{
        message?: string;
        error_code?: unknown;
      }>;
    };

    const googleError = {
      message:
        googleErrorObject.message ??
        googleErrorObject.errors?.[0]?.message ??
        JSON.stringify(error),

      request_id: googleErrorObject.request_id ?? null,

      errors:
        googleErrorObject.errors?.map((item) => ({
          message: item.message ?? null,
          error_code: item.error_code ?? null,
        })) ?? null,

      timestamp: new Date().toISOString(),
    };

    await client.query(
      `
      UPDATE public.offline_conversion_uploads

      SET
        upload_status = 'failed',
        upload_attempts = upload_attempts + 1,
        last_attempt_at = NOW(),

        next_retry_at =
          CASE
            WHEN upload_attempts + 1 < 5
            THEN NOW() + INTERVAL '15 minutes'
            ELSE NULL
          END,

        google_error_message = $1,
        google_response = $2

      WHERE id = $3;
      `,
      [googleError.message, JSON.stringify(googleError), uploadId],
    );

    throw error;
  } finally {
    client.release();
  }
}
