"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { trackGenerateLead } from "@/lib/analytics";
import { canConvert, consumeConversion, getConversion } from "@/lib/session";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    if (!canConvert()) {
      router.replace("/");
      return;
    }

    const conversion = getConversion();

    if (!conversion || conversion.fired) {
      router.replace("/");
      return;
    }

    trackGenerateLead({
      lead_source: "landing_page",
      event_id: conversion.eventId,
    });

    /**
     * Allow GA4 event dispatch before
     * marking the conversion as completed.
     */
    const timer = setTimeout(() => {
      consumeConversion();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 px-6">
      <div className="max-w-xl text-center bg-white p-10 rounded-2xl shadow-sm border">
        <div className="text-5xl mb-4">🎉</div>

        <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>

        <p className="mt-4 text-gray-600">
          Your lead has been submitted successfully.
        </p>

        <div className="mt-6 text-sm text-gray-500">
          GA4 has received a <code>generate_lead</code> event.
        </div>

        <Link
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
