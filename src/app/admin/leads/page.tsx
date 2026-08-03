import { getAdminLeads } from "@/services/adminLeads";
import StatusButtons from "./StatusButtons";

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <main
      style={{
        padding: "40px",
      }}
    >
      <h1>Admin Leads</h1>

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gap: "20px",
        }}
      >
        {leads.map((lead) => (
          <div
            key={lead.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h2>Lead #{lead.id}</h2>

            <p>
              Name: {lead.first_name} {lead.last_name}
            </p>

            <p>Email: {lead.email}</p>

            <p>Phone: {lead.phone ?? "N/A"}</p>

            <p>Status: {lead.status}</p>

            <StatusButtons leadId={lead.id} currentStatus={lead.status} />

            <p>Created: {new Date(lead.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
