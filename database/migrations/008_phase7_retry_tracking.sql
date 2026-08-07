ALTER TABLE public.offline_conversion_uploads

ADD COLUMN upload_attempts INTEGER NOT NULL DEFAULT 0,

ADD COLUMN last_attempt_at TIMESTAMPTZ,

ADD COLUMN next_retry_at TIMESTAMPTZ;