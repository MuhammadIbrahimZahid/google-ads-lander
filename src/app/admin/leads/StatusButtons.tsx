"use client";

import { useState } from "react";

import { pushToDataLayer } from "@/lib/dataLayer";

interface StatusButtonsProps {
  leadId: number;
  currentStatus: string;
}

const statuses = ["new", "contacted", "qualified", "disqualified"];

export default function StatusButtons({
  leadId,
  currentStatus,
}: StatusButtonsProps) {
  const [status, setStatus] = useState(currentStatus);

  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    if (newStatus === status) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: newStatus,
          changedBy: "admin",
          reason: "Admin CRM update",
          metadata: {
            source: "admin_crm",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const eventId = crypto.randomUUID();

      pushToDataLayer(`lead_${newStatus}`, {
        event_id: eventId,

        lead_id: leadId,

        previous_status: status,

        new_status: newStatus,
      });

      setStatus(newStatus);
    } catch (error) {
      console.error(error);

      alert("Status update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: "15px",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      {statuses.map((item) => (
        <button
          key={item}
          disabled={loading}
          onClick={() => updateStatus(item)}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            background: item === status ? "#111" : "#eee",
            color: item === status ? "#fff" : "#000",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
