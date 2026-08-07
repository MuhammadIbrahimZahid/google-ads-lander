-- Find qualified/disqualified/contact lifecycle events quickly
CREATE INDEX idx_lifecycle_events_event_name
ON public.lifecycle_events(event_name);


-- Find lifecycle events for a specific lead
CREATE INDEX idx_lifecycle_events_lead_id
ON public.lifecycle_events(lead_id);


-- Find leads by Google Click ID
-- Required for offline conversion reconciliation
CREATE INDEX idx_leads_gclid
ON public.leads(gclid);


-- Find pending uploads for processing jobs
CREATE INDEX idx_offline_conversion_uploads_status
ON public.offline_conversion_uploads(upload_status);


-- Find uploads belonging to a lead
CREATE INDEX idx_offline_conversion_uploads_lead_id
ON public.offline_conversion_uploads(lead_id);


-- Find uploaded conversion history by conversion type
CREATE INDEX idx_offline_conversion_uploads_conversion_name
ON public.offline_conversion_uploads(conversion_name);