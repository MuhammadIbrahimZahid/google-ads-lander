"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/thank-you");
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Build & Track Google Ads Conversions
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl">
          Learn how real conversion tracking works using Next.js, GA4, GTM, and
          Google Ads.
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
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg">Conversion Tracking</h3>
            <p className="text-gray-600 mt-2">
              Learn how Google Ads tracks real user actions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg">GA4 Integration</h3>
            <p className="text-gray-600 mt-2">
              Understand analytics events and attribution.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg">Tag Manager</h3>
            <p className="text-gray-600 mt-2">
              Manage all tracking without touching code later.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h2 className="text-3xl font-bold">
          Ready to build real conversion tracking?
        </h2>

        <p className="text-gray-600 mt-4">
          Next step: we create a /thank-you page and start tracking conversions.
        </p>

        <button className="mt-8 px-8 py-4 bg-black text-white rounded-xl">
          Continue Learning
        </button>
      </section>
    </main>
  );
}
