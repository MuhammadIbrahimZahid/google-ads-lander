"use client";

import { ensureConversion } from "@/lib/session";
import { trackHeroCTAClick } from "@/lib/analytics";
import { hasTrackedHeroClick, markHeroClickTracked } from "@/lib/tracking";
import { useEffect, useState } from "react";
import LeadModal from "@/components/LeadModal";
import { captureAttribution, getAttribution } from "@/lib/attribution";
import { captureFirstTouchAttribution } from "@/lib/firstTouchAttribution";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    captureAttribution();

    const attribution = getAttribution();

    if (attribution) {
      captureFirstTouchAttribution(attribution);
    }
  }, []);

  const handleClick = () => {
    ensureConversion();

    if (!hasTrackedHeroClick()) {
      trackHeroCTAClick({
        button_name: "Get Started",
      });

      markHeroClickTracked();
    }

    setShowForm(true);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Offline Conversion Uploader
        </h1>

        <p className="mt-6 text-gray-600 max-w-3xl">
          Offline Conversion Uploader is an internal marketing tool that
          connects CRM lead qualification data with Google Ads.
        </p>

        <p className="mt-4 text-gray-600 max-w-3xl">
          The application uploads qualified lead conversion events from our
          database to Google Ads using the Google Ads API, allowing marketing
          teams to optimize campaigns based on qualified leads instead of only
          form submissions.
        </p>

        <p className="mt-4 text-gray-600 max-w-3xl">
          This tool is used internally by our marketing and sales team to
          improve lead quality measurement and advertising performance.
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Get Started
          </button>

          <button className="px-6 py-3 border rounded-xl">View Demo</button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg">
              Google Ads Offline Conversions
            </h3>

            <p className="text-gray-600 mt-2">
              Upload qualified lead outcomes from internal systems to Google Ads
              for optimization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg">CRM Lead Qualification</h3>

            <p className="text-gray-600 mt-2">
              Connect sales qualification events with advertising performance
              data.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg">
              Google Ads API Integration
            </h3>

            <p className="text-gray-600 mt-2">
              Send qualified conversion events programmatically through the
              Google Ads API.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h2 className="text-3xl font-bold">Improve lead quality measurement</h2>

        <p className="text-gray-600 mt-4">
          Connect qualified business outcomes with Google Ads campaign
          optimization.
        </p>

        <button
          onClick={handleClick}
          className="mt-8 px-8 py-4 bg-black text-white rounded-xl"
        >
          Continue
        </button>
      </section>

      <LeadModal open={showForm} onClose={() => setShowForm(false)} />
    </main>
  );
}
