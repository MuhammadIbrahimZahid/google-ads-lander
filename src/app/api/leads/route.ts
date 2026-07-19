import { NextResponse } from "next/server";
import { createLead } from "@/services/leads";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      landingPage,
      referrer,
      gclid,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      debugSource,
      debugCampaign,
      debugClickId,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and email are required.",
        },
        {
          status: 400,
        },
      );
    }

    const lead = await createLead({
      name,
      email,
      phone,

      landingPage,
      referrer,

      gclid,

      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,

      debugSource,
      debugCampaign,
      debugClickId,
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
      {
        status: 500,
      },
    );
  }
}
