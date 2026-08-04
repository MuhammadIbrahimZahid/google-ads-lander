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

function normalizeOptionalText(value?: string) {
  if (!value) {
    return undefined;
  }

  const cleaned = value.trim();

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
      firstName,
      lastName,
      email,
      phone,

      country,
      postalCode,

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

    const cleanFirstName =
      typeof firstName === "string" ? firstName.trim() : "";

    const cleanLastName = typeof lastName === "string" ? lastName.trim() : "";

    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    const cleanCountry = normalizeOptionalText(country);

    const cleanPostalCode = normalizeOptionalText(postalCode);

    if (!cleanFirstName) {
      return NextResponse.json(
        {
          success: false,
          message: "First name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!cleanLastName) {
      return NextResponse.json(
        {
          success: false,
          message: "Surname is required.",
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

    if (isTooLong(cleanFirstName, 100)) {
      return NextResponse.json(
        {
          success: false,
          message: "First name is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (isTooLong(cleanLastName, 100)) {
      return NextResponse.json(
        {
          success: false,
          message: "Surname is too long.",
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

    if (isTooLong(cleanCountry, 100)) {
      return NextResponse.json(
        {
          success: false,
          message: "Country value is too long.",
        },
        {
          status: 400,
        },
      );
    }

    if (isTooLong(cleanPostalCode, 30)) {
      return NextResponse.json(
        {
          success: false,
          message: "Postal code is too long.",
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
      firstName: cleanFirstName,

      lastName: cleanLastName,

      email: cleanEmail,

      phone: normalizedPhone,

      country: cleanCountry,

      postalCode: cleanPostalCode,

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
