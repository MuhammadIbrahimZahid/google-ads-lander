import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      {" "}
      <div className="mx-auto max-w-3xl space-y-8">
        {" "}
        <h1 className="text-3xl font-bold">Privacy Policy </h1>
        <p>Last updated: August 2026</p>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Overview</h2>

          <p>
            This privacy policy explains how information is collected and used
            when you interact with this website. We collect information provided
            by users through our lead forms to respond to inquiries, manage
            customer relationships, and improve our services.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Information We Collect</h2>

          <p>We may collect information such as:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Name and contact information</li>
            <li>Email address and phone number</li>
            <li>Information submitted through website forms</li>
            <li>
              Advertising attribution information such as Google Click ID
              (GCLID), campaign information, and referral details
            </li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">How We Use Information</h2>

          <p>Information collected through this website is used to:</p>

          <ul className="list-disc space-y-1 pl-6">
            <li>Respond to customer inquiries</li>
            <li>Manage leads and customer communications</li>
            <li>Improve website performance and user experience</li>
            <li>
              Measure advertising effectiveness and understand which marketing
              activities generate qualified leads
            </li>
          </ul>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            Google Ads and Conversion Measurement
          </h2>

          <p>
            We use Google Ads measurement technologies to understand the
            effectiveness of our advertising campaigns.
          </p>

          <p>
            When a user submits a lead form, relevant attribution information,
            including Google Click ID (GCLID) when available, may be securely
            stored with the lead record.
          </p>

          <p>
            If a lead later becomes a qualified business opportunity, we may
            send conversion information to Google Ads through the Google Ads
            API. This helps measure advertising performance and improve campaign
            optimization.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl-semibold">Data Protection</h2>

          <p>
            We take reasonable measures to protect collected information and
            limit access to authorized systems and personnel.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Third-Party Services</h2>

          <p>
            We may use third-party services such as Google services for
            analytics, advertising measurement, and conversion tracking. These
            providers process information according to their own privacy
            policies.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Contact</h2>

          <p>
            For questions about this privacy policy or how your information is
            handled, please contact us at:
          </p>

          <p>your-email@example.com</p>
        </section>
      </div>
    </main>
  );
}
