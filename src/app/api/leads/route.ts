import { NextResponse } from "next/server";

import { createLead } from "@/services/leads";

import type { CreateLeadInput } from "@/types/lead";

function normalizePhone(phone?: string) {
  if (!phone) {
    return undefined;
  }

  const cleaned = phone.replace(/\s+/g, "");

  return cleaned || undefined;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isTooLong(value: string | undefined, max: number) {
  return value ? value.length > max : false;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateLeadInput>;

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

    const cleanName = typeof name === "string" ? name.trim() : "";

    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

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
          message: "Invalid email address.",
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

    if (isTooLong(normalizedPhone, 30)) {
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

      phone: normalizedPhone,

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
    console.error("Lead API error:", error);

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
