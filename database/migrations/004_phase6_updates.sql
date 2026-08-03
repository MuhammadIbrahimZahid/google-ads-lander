CREATE TABLE public.lead_status_history (

    id BIGSERIAL PRIMARY KEY,

    lead_id BIGINT NOT NULL
        REFERENCES public.leads(id)
        ON DELETE CASCADE,

    previous_status TEXT,

    new_status TEXT NOT NULL,

    changed_by TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()

);

CREATE TABLE public.lifecycle_events (

    id BIGSERIAL PRIMARY KEY,

    event_id UUID NOT NULL UNIQUE,

    lead_id BIGINT NOT NULL
        REFERENCES public.leads(id)
        ON DELETE CASCADE,

    event_name TEXT NOT NULL,

    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW()

);