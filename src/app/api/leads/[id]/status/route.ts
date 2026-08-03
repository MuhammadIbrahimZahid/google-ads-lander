import { NextResponse } from "next/server";

import { changeLeadStatus } from "@/services/leadLifecycle";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = Number(id);

    if (!Number.isInteger(leadId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid lead id.",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    const { status, changedBy, reason, metadata } = body;

    if (!status || typeof status !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required.",
        },
        {
          status: 400,
        },
      );
    }

    const lead = await changeLeadStatus({
      leadId,

      newStatus: status,

      changedBy,

      reason,

      metadata,
    });

    return NextResponse.json({
      success: true,

      lead,
    });
  } catch (error) {
    console.error("Lead status update API error:", error);

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to update lead status.",
      },
      {
        status: 500,
      },
    );
  }
}
