import { NextResponse } from "next/server";
import { createLead } from "@/services/leads";

export async function POST() {
  try {
    const lead = await createLead({
      name: "Test User",
      email: "test@example.com",
      phone: "03000000000",

      landingPage: "/",
      referrer: "http://localhost:3000",

      debugSource: "google_ads",
      debugCampaign: "phase2_test",
      debugClickId: crypto.randomUUID(),
    });

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lead.",
      },
      { status: 500 },
    );
  }
}
