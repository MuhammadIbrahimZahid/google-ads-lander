ALTER TABLE public.leads

DROP COLUMN name,

ADD COLUMN first_name TEXT NOT NULL,

ADD COLUMN last_name TEXT NOT NULL,

ADD COLUMN country TEXT,

ADD COLUMN postal_code TEXT;