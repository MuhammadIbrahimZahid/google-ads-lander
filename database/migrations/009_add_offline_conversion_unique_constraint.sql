ALTER TABLE offline_conversion_uploads
ADD CONSTRAINT unique_lead_conversion
UNIQUE (
  lead_id,
  conversion_name
);