-- FUNCTION: public.get_emo_triage_summary(timestamp without time zone, timestamp without time zone, integer, boolean)

-- DROP FUNCTION IF EXISTS public.get_emo_triage_summary(timestamp without time zone, timestamp without time zone, integer, boolean);

CREATE OR REPLACE FUNCTION public.get_emo_triage_summary(
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone,
	p_hospital_id integer,
	p_is_age12 boolean DEFAULT false)
    RETURNS TABLE(total bigint, "108" bigint, red bigint, yellow bigint, green bigint, black bigint, pending bigint) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
   	WITH filtered_triage AS (
        SELECT e.id AS emo_id,
               t.id AS triage_id,
               tb108.call_id,
               td.triage_flag
        FROM triage t
	        LEFT JOIN emo_triage e ON e.triage_id = t.id
	        LEFT JOIN triage_by_108 tb108 ON tb108.triage_id = t.id
	        LEFT JOIN triage_dtls td ON td.triage_id = t.id
        WHERE t.inserted_Date BETWEEN p_start_date AND p_end_date
          AND t.institution_id = p_hospital_id
		  AND (
				p_is_age12 IS NOT TRUE
				OR ((COALESCE(t.age_year,0) * 12 + COALESCE(t.age_month,0)) <= 144)
			)
    )
    SELECT 
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE call_id IS NOT NULL) AS "108",
        COUNT(*) FILTER (WHERE triage_flag = 1) AS red,
        COUNT(*) FILTER (WHERE triage_flag = 2) AS yellow,
        COUNT(*) FILTER (WHERE triage_flag = 3) AS green,
        COUNT(*) FILTER (WHERE triage_flag = 4) AS black,
		COUNT(*) FILTER (WHERE emo_id is null) AS pending      
    FROM filtered_triage;
END;
$BODY$;

ALTER FUNCTION public.get_emo_triage_summary(timestamp without time zone, timestamp without time zone, integer, boolean)
    OWNER TO postgres;
