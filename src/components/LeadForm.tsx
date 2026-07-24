"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { completeConversion, getConversion } from "@/lib/session";

import type { CreateLeadInput } from "@/types/lead";

export default function LeadForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateLeadInput>({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      /**
       * Read active conversion journey.
       *
       * Single source of truth:
       * conversion.attribution
       */
      const conversion = getConversion();

      const attribution = conversion?.attribution ?? {};

      const leadData: CreateLeadInput = {
        ...formData,

        /**
         * Landing context
         */
        landingPage: attribution.landingPage,

        referrer: attribution.referrer,

        /**
         * Attribution
         */
        gclid: attribution.gclid,

        utmSource: attribution.utmSource,

        utmMedium: attribution.utmMedium,

        utmCampaign: attribution.utmCampaign,

        utmTerm: attribution.utmTerm,

        utmContent: attribution.utmContent,

        /**
         * Conversion identity
         */
        conversionEventId: conversion?.eventId,

        /**
         * Device
         */
        device: attribution.device,
      };

      const response = await fetch("/api/leads", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(leadData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      /**
       * Lead saved successfully.
       *
       * Unlock generate_lead
       * on thank-you page.
       */
      completeConversion();

      router.push("/thank-you");
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to submit lead.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Complete Your Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="email"
          type="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="phone"
          placeholder="Your phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}
    </section>
  );
}
