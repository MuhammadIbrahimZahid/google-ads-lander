import { NextResponse } from "next/server";

import { runOfflineConversionUploadJobDM } from "@/services/offlineConversionUploadJobDM";

export async function POST() {
  try {
    const result = await runOfflineConversionUploadJobDM();

    return NextResponse.json({
      success: true,

      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        message: error instanceof Error ? error.message : "DM upload failed",
      },

      {
        status: 500,
      },
    );
  }
}
