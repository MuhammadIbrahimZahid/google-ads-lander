"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { completeConversion, getConversion } from "@/lib/session";

import type { CreateLeadInput } from "@/types/lead";

import { saveLeadIdentity } from "@/lib/leadIdentity";

export default function LeadForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateLeadInput>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    setMessage("");

    try {
      const conversion = getConversion();

      const attribution = conversion?.attribution ?? {};

      const leadData: CreateLeadInput = {
        ...formData,

        landingPage: attribution.landingPage,

        referrer: attribution.referrer,

        gclid: attribution.gclid,

        utmSource: attribution.utmSource,

        utmMedium: attribution.utmMedium,

        utmCampaign: attribution.utmCampaign,

        utmTerm: attribution.utmTerm,

        utmContent: attribution.utmContent,

        conversionEventId: conversion?.eventId,

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
       * Store identity temporarily.
       *
       * Used on thank-you page to create
       * Google Ads Enhanced Conversion payload.
       */
      saveLeadIdentity({
        firstName: formData.firstName,

        lastName: formData.lastName,

        email: formData.email,

        phone: formData.phone,

        country: formData.country,

        postalCode: formData.postalCode,
      });

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
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="lastName"
          placeholder="Surname"
          value={formData.lastName}
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

        <input
          name="country"
          placeholder="Country code (example: PK)"
          value={formData.country}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="postalCode"
          placeholder="Postal code"
          value={formData.postalCode}
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
