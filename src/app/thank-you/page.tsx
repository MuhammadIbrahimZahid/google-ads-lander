export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 px-6">
      <div className="max-w-xl text-center bg-white p-10 rounded-2xl shadow-sm border">
        <div className="text-5xl mb-4">🎉</div>

        <h1 className="text-3xl font-bold text-gray-900">Thank You!</h1>

        <p className="mt-4 text-gray-600">
          Your action has been recorded successfully. This page will later be
          used as a Google Ads conversion event.
        </p>

        <div className="mt-6 text-sm text-gray-500">
          Next step: we connect this page to Google Ads conversion tracking.
        </div>

        <a
          href="/"
          className="inline-block mt-8 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
