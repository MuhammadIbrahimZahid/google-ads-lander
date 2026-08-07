import pool from "@/lib/db";

interface DataManagerResponse {
  requestId?: string;
  [key: string]: unknown;
}

async function getAccessToken(): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: new URLSearchParams({
      client_id: process.env.WEB_TEST_OAUTH_CLIENT_ID!,
      client_secret: process.env.WEB_TEST_OAUTH_CLIENT_SECRET!,
      refresh_token: process.env.WEB_TEST_OAUTH_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`OAuth token failed: ${await response.text()}`);
  }

  const data = await response.json();

  return data.access_token;
}

export async function uploadOfflineConversionDM(uploadId: number) {
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
      throw new Error("Offline conversion upload not found.");
    }

    const upload = result.rows[0];

    if (!upload.gclid) {
      throw new Error("Missing GCLID.");
    }

    const accessToken = await getAccessToken();

    const eventPayload = {
      destinations: [
        {
          reference: process.env.GOOGLE_DATA_MANAGER_DESTINATION_REFERENCE,

          operatingAccount: {
            accountId: process.env.TEST_GOOGLE_ADS_CUSTOMER_ID,

            accountType: "GOOGLE_ADS",
          },

          loginAccount: {
            accountId: process.env.TEST_GOOGLE_ADS_LOGIN_CUSTOMER_ID,

            accountType: "GOOGLE_ADS",
          },

          productDestinationId:
            process.env.TEST_GOOGLE_ADS_QUALIFIED_LEAD_CONVERSION_ACTION_ID,
        },
      ],

      events: [
        {
          eventName: upload.conversion_name,

          eventTimestamp: new Date(upload.conversion_time).toISOString(),

          transactionId: `offline_${upload.id}`,

          conversionValue: Number(upload.conversion_value),

          currency: upload.currency_code,

          eventSource: "WEB",

          adIdentifiers: {
            gclid: upload.gclid,
          },

          destinationReferences: [
            process.env.GOOGLE_DATA_MANAGER_DESTINATION_REFERENCE,
          ],
        },
      ],
    };

    const response = await fetch(
      "https://datamanager.googleapis.com/v1/events:ingest",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,

          "Content-Type": "application/json",
        },

        body: JSON.stringify(eventPayload),
      },
    );

    const responseBody = (await response.json()) as DataManagerResponse;

    const uploadStatus = response.ok ? "uploaded" : "failed";

    await client.query(
      `
      UPDATE public.offline_conversion_uploads

      SET
        upload_status = $1,
        google_job_id = $2,
        google_response = $3,
        google_error_message = $4,
        uploaded_at = NOW()

      WHERE id = $5;
      `,
      [
        uploadStatus,

        responseBody.requestId ?? null,

        JSON.stringify(responseBody),

        response.ok ? null : JSON.stringify(responseBody),

        uploadId,
      ],
    );

    if (!response.ok) {
      throw new Error(JSON.stringify(responseBody));
    }

    return responseBody;
  } catch (error) {
    await client.query(
      `
      UPDATE public.offline_conversion_uploads

      SET
        upload_status = 'failed',

        upload_attempts =
          upload_attempts + 1,

        last_attempt_at =
          NOW(),

        next_retry_at =
          CASE
            WHEN upload_attempts + 1 < 5
            THEN NOW() + INTERVAL '15 minutes'
            ELSE NULL
          END,

        google_error_message =
          $1

      WHERE id = $2;
      `,
      [error instanceof Error ? error.message : String(error), uploadId],
    );

    throw error;
  } finally {
    client.release();
  }
}
