import { NextResponse } from "next/server";

import { runOfflineConversionUploadJob } from "@/services/offlineConversionUploadJob";

export async function POST() {
  try {
    const result = await runOfflineConversionUploadJob();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Offline conversion upload job failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Upload job failed.",
      },
      {
        status: 500,
      },
    );
  }
}
