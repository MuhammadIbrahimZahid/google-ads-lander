import { getAdminConversions } from "@/services/adminConversions";

export default async function AdminConversionsPage() {
  const conversions = await getAdminConversions();

  return (
    <main style={{ padding: "40px" }}>
      <h1>Admin Conversions</h1>

      <div style={{ marginTop: "30px" }}>
        {conversions.map((conversion) => (
          <div
            key={conversion.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <h2>Lead #{conversion.lead_id}</h2>

            <p>
              Name: {conversion.first_name} {conversion.last_name}
            </p>

            <p>Status: {conversion.upload_status}</p>

            <p>Google Job ID: {conversion.google_job_id ?? "N/A"}</p>

            <p>Error Code: {conversion.google_error_code ?? "None"}</p>

            <p>Error Message: {conversion.google_error_message ?? "None"}</p>

            <p>
              Uploaded:{" "}
              {conversion.uploaded_at
                ? new Date(conversion.uploaded_at).toLocaleString()
                : "Not uploaded"}
            </p>

            <p>
              Reconciliation:
              {conversion.reconciliation_status}
            </p>

            <p>
              Reconciled:
              {conversion.reconciled_at
                ? new Date(conversion.reconciled_at).toLocaleString()
                : "Not reconciled"}
            </p>

            <p>
              Notes:
              {conversion.reconciliation_notes ?? "None"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
