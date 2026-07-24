import { NextResponse } from "next/server";
import { createLead } from "@/services/leads";
import type { CreateLeadInput } from "@/types/lead";

function normalizePhone(phone?: string) {
  if (!phone) {
    return null;
  }

  const cleaned = phone.replace(/\s+/g, "");

  return cleaned || null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isTooLong(value: string | undefined, max: number) {
  return value ? value.length > max : false;
}

export async function POST(request: Request) {
  try {
    const body: CreateLeadInput = await request.json();

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

      device,

      conversionEventId,

      debugSource,
      debugCampaign,
      debugClickId,
    } = body;

    const cleanName = name?.trim();

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanName) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!cleanEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    if (isTooLong(cleanName, 100)) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (isTooLong(cleanEmail, 255)) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is too long.",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedPhone = normalizePhone(phone);

    if (isTooLong(normalizedPhone ?? undefined, 30)) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is too long.",
        },
        {
          status: 400,
        },
      );
    }

    const lead = await createLead({
      name: cleanName,

      email: cleanEmail,

      phone: normalizedPhone ?? undefined,

      landingPage,

      referrer,

      gclid,

      utmSource,

      utmMedium,

      utmCampaign,

      utmTerm,

      utmContent,

      device,

      conversionEventId,

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
