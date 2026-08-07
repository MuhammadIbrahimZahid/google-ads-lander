import pool from "@/lib/db";

export async function getAdminLeads() {
  const result = await pool.query(`
    SELECT
      MAX(id) AS latest_id,
      COUNT(*) AS total
    FROM public.leads;
  `);

  const leads = await pool.query(`
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      status,
      created_at,
      updated_at
    FROM public.leads
    ORDER BY created_at DESC;
  `);

  return leads.rows;
}
