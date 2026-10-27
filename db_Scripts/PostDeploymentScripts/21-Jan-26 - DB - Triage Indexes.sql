CREATE INDEX IF NOT EXISTS idx_triage_date
    ON public.triage USING btree
    (date_time_of_triage ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_triage_hosp_date_id

-- DROP INDEX IF EXISTS public.idx_triage_hosp_date_id;

CREATE INDEX IF NOT EXISTS idx_triage_hosp_date_id
    ON public.triage USING btree
    (institution_id ASC NULLS LAST, inserted_date DESC NULLS FIRST, id DESC NULLS FIRST)
    TABLESPACE pg_default;
-- Index: idx_triage_inst_date_id

-- DROP INDEX IF EXISTS public.idx_triage_inst_date_id;

CREATE INDEX IF NOT EXISTS idx_triage_inst_date_id
    ON public.triage USING btree
    (institution_id ASC NULLS LAST, inserted_date DESC NULLS FIRST, id DESC NULLS FIRST)
    TABLESPACE pg_default;
-- Index: idx_triage_institution_date

-- DROP INDEX IF EXISTS public.idx_triage_institution_date;

CREATE INDEX IF NOT EXISTS idx_triage_institution_date
    ON public.triage USING btree
    (institution_id ASC NULLS LAST, date_time_of_triage ASC NULLS LAST)
    TABLESPACE pg_default;