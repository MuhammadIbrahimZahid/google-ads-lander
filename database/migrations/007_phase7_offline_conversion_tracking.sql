CREATE TABLE public.offline_conversion_uploads (

    id BIGSERIAL PRIMARY KEY,

    lead_id BIGINT NOT NULL
        REFERENCES public.leads(id)
        ON DELETE CASCADE,

    conversion_name TEXT NOT NULL,

    gclid TEXT NOT NULL,

    conversion_time TIMESTAMPTZ NOT NULL,

    conversion_value NUMERIC DEFAULT 1,

    currency_code TEXT DEFAULT 'PKR',

    upload_status TEXT NOT NULL DEFAULT 'pending',

    google_response JSONB DEFAULT '{}',

    uploaded_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (
        lead_id,
        conversion_name
    )

);