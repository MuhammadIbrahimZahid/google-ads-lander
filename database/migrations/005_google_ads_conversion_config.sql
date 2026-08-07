CREATE TABLE public.google_ads_conversion_config (

    id BIGSERIAL PRIMARY KEY,

    conversion_name TEXT NOT NULL,

    conversion_action_id TEXT NOT NULL,

    conversion_type TEXT NOT NULL,

    active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE (
        conversion_name
    )

);