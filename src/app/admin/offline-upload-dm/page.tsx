"use client";

import { useState } from "react";

interface UploadResult {
  success?: boolean;
  processed?: number;
  uploaded?: number;
  failed?: number;
  requestId?: string;
  message?: string;
}

export default function OfflineUploadDMPage() {
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/offline-upload-dm", {
        method: "POST",
      });

      const data = await response.json();

      setResult(data);
    } catch {
      setResult({
        success: false,
        message: "Upload request failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold">Google Ads Data Manager</h1>

          <p className="mt-2 text-gray-600">
            Upload qualified CRM leads as offline conversions to Google Ads.
          </p>
        </div>

        {/* Action Card */}
        <div className="mt-8 bg-white rounded-2xl shadow p-8">
          <h2 className="text-xl font-semibold">Offline Conversion Upload</h2>

          <p className="mt-2 text-gray-600">
            This will find all pending qualified leads and send them to Google
            Data Manager.
          </p>

          <button
            onClick={upload}
            disabled={loading}
            className="
              mt-6
              px-8
              py-3
              rounded-xl
              bg-blue-600
              text-white
              font-semibold
              hover:bg-blue-700
              disabled:bg-gray-400
            "
          >
            {loading
              ? "Uploading conversions..."
              : "Upload Pending Conversions"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-semibold">Upload Result</h2>

            {result.success ? (
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Processed</span>

                  <strong>{result.processed}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Uploaded</span>

                  <strong className="text-green-600">{result.uploaded}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Failed</span>

                  <strong className="text-red-600">{result.failed}</strong>
                </div>

                {result.requestId && (
                  <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Google Request ID</p>

                    <code>{result.requestId}</code>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-4 text-red-600">{result.message}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
