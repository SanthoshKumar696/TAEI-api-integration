-- FUNCTION: public.get_triage_summary(timestamp without time zone, timestamp without time zone, integer, character varying, boolean)

-- DROP FUNCTION IF EXISTS public.get_triage_summary(timestamp without time zone, timestamp without time zone, integer, character varying, boolean);

CREATE OR REPLACE FUNCTION public.get_triage_summary(
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone,
	p_hospital_id integer,
	p_hospital_name character varying,
	p_is_age12 boolean DEFAULT false)
    RETURNS TABLE(total bigint, "108" bigint, "Non108" bigint, red bigint, yellow bigint, green bigint, black bigint, pending bigint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    WITH

    -- Scan cases_108 only once
    c108 AS (
	    SELECT 
	        "TriageId",
	        ("TriageId" IS NULL)::int AS is_pending
	    FROM cases_108
	    WHERE "InsertedDate" BETWEEN p_start_date AND p_end_date
	      AND "HospitalName" = p_hospital_name
	      AND "Emergency_Type" <> 'Pregnancy related'
	      AND (
	            p_is_age12 IS NOT TRUE
	            OR "Age" <= 12
	          )
	),
    c108_summary AS (
        SELECT 
		    COUNT(*) AS total_count,
		    SUM(COALESCE(is_pending, 0)) AS pending_count
		FROM c108
    ),

    -- Scan triage once
	tr AS (
		SELECT id
		FROM triage
		WHERE inserted_date BETWEEN p_start_date AND p_end_date
		  AND institution_id = p_hospital_id
		  AND (
				p_is_age12 IS NOT TRUE
				OR ((COALESCE(age_year,0) * 12 + COALESCE(age_month,0)) <= 144)
			  )
	),

    -- Scan triage_by_108 once
    t108 AS (
        SELECT triage_id, call_id
        FROM triage_by_108
        JOIN tr ON tr.id = triage_by_108.triage_id
    ),

    t108_summary AS (
        SELECT
            COUNT(*) FILTER (WHERE call_id IS NOT NULL) AS cnt_108,
            COUNT(*) FILTER (WHERE call_id IS NULL)  AS cnt_non108
        FROM t108
    ),

    -- Scan triage_dtls once
    tdt AS (
        SELECT triage_id, triage_flag
        FROM triage_dtls
        JOIN tr ON tr.id = triage_dtls.triage_id
    ),

    tdt_summary AS (
        SELECT
            COUNT(*) FILTER (WHERE triage_flag = 1) AS red,
            COUNT(*) FILTER (WHERE triage_flag = 2) AS yellow,
            COUNT(*) FILTER (WHERE triage_flag = 3) AS green,
            COUNT(*) FILTER (WHERE triage_flag = 4) AS black
        FROM tdt
    )

    SELECT
        t108_summary.cnt_108 + t108_summary.cnt_non108 AS total,
        t108_summary.cnt_108     AS "108",
        t108_summary.cnt_non108  AS "Non108",
        tdt_summary.red,
        tdt_summary.yellow,
        tdt_summary.green,
        tdt_summary.black,
        c108_summary.pending_count AS pending
    FROM c108_summary, t108_summary, tdt_summary;

END;
$BODY$;

ALTER FUNCTION public.get_triage_summary(timestamp without time zone, timestamp without time zone, integer, character varying, boolean)
    OWNER TO postgres;
