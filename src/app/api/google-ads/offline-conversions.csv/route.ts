import { NextResponse } from "next/server";

import pool from "@/lib/db";

function escapeCSV(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function checkAuth(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return false;
  }

  const base64Credentials = authHeader.replace("Basic ", "");

  const decoded = Buffer.from(base64Credentials, "base64").toString("utf-8");

  const [username, password] = decoded.split(":");

  return (
    username === process.env.GOOGLE_DATA_MANAGER_USER &&
    password === process.env.GOOGLE_DATA_MANAGER_PASSWORD
  );
}

export async function GET(request: Request) {
  try {
    // Google Data Manager authentication
    if (!checkAuth(request)) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic",
        },
      });
    }

    const result = await pool.query(`
      SELECT
        ocu.gclid,
        ocu.conversion_name,
        ocu.conversion_time,
        ocu.conversion_value,
        ocu.currency_code,

        l.email,
        l.phone,
        l.first_name,
        l.last_name,
        l.country,
        l.postal_code

      FROM public.offline_conversion_uploads ocu

      JOIN public.leads l
        ON l.id = ocu.lead_id

      WHERE ocu.upload_status = 'pending'

      ORDER BY ocu.created_at ASC;
    `);

    const headers = [
      "gclid",
      "conversion_name",
      "conversion_time",
      "conversion_value",
      "currency_code",
      "email",
      "phone",
      "first_name",
      "last_name",
      "country",
      "postal_code",
    ];

    const rows = result.rows.map((row) =>
      [
        row.gclid,

        row.conversion_name,

        new Date(row.conversion_time)
          .toISOString()
          .replace("T", " ")
          .replace("Z", "+00:00"),

        row.conversion_value,

        row.currency_code,

        row.email,

        row.phone,

        row.first_name,

        row.last_name,

        row.country,

        row.postal_code,
      ]
        .map(escapeCSV)
        .join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,

      headers: {
        "Content-Type": "text/csv",

        "Content-Disposition": 'attachment; filename="offline-conversions.csv"',
      },
    });
  } catch (error) {
    console.error("Offline conversion CSV export failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate CSV.",
      },
      {
        status: 500,
      },
    );
  }
}
