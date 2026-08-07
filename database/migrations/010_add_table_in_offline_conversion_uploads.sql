ALTER TABLE public.offline_conversion_uploads
ADD COLUMN google_job_id TEXT;

ALTER TABLE offline_conversion_uploads
ADD COLUMN google_error_code TEXT,
ADD COLUMN google_error_message TEXT;

ALTER TABLE public.offline_conversion_uploads

ADD COLUMN reconciliation_status TEXT NOT NULL DEFAULT 'pending',

ADD COLUMN reconciled_at TIMESTAMPTZ,

ADD COLUMN reconciliation_notes TEXT;

CREATE INDEX idx_offline_conversion_reconciliation_status

ON public.offline_conversion_uploads(reconciliation_status);