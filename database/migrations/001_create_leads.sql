CREATE TABLE public.leads (
    id BIGSERIAL PRIMARY KEY,

    -- Customer information
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,

    -- Landing context
    landing_page TEXT,
    referrer TEXT,

    -- Real Google Ads attribution
    gclid TEXT,

    -- UTM attribution
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,

    -- Development simulation fields
    debug_source TEXT,
    debug_campaign TEXT,
    debug_click_id TEXT,

    -- Lead lifecycle
    status TEXT NOT NULL DEFAULT 'new',

    -- Database timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);