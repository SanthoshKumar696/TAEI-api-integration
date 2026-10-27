-- FUNCTION: public.get_triage_list(integer, integer, integer, timestamp without time zone, timestamp without time zone, boolean)

-- DROP FUNCTION IF EXISTS public.get_triage_list(integer, integer, integer, timestamp without time zone, timestamp without time zone, boolean);

CREATE OR REPLACE FUNCTION public.get_triage_list(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone,
	p_is_age12 boolean DEFAULT false)
    RETURNS TABLE(triage_id integer, caseid character varying, name_of_patient character varying, vehicle_number character varying, mode_of_arrival character varying, chief_complaint character varying, source_hospital character varying, destination_hospital character varying, statusid integer, triage_flag character varying, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
        tr.id AS triage_id,            
        t108.call_id AS caseId,
        tr.name_of_patient,
        t108.vehicle_number,
        moa.name AS mode_of_arrival,
        t108.chief_complaint,
        tr.source_hospital,
        tr.destination_hospital,
        CASE 
            WHEN emo.id IS NOT NULL THEN 3
            ELSE 2 
        END AS statusId,
        tf.name AS triage_flag,
        COUNT(*) OVER()::INT AS total_count
    FROM triage tr
        LEFT JOIN triage_by_108 t108 ON t108.triage_id = tr.id
        LEFT JOIN triage_dtls td ON td.triage_id = tr.id
        LEFT JOIN lkp_triage_dtls_triage_flag tf ON tf.id = td.triage_flag
        LEFT JOIN lkp_triage_mode_of_arrival moa ON moa.id = tr.mode_of_arrival
        LEFT JOIN emo_triage emo ON emo.triage_id = tr.id
    WHERE tr.institution_id = p_hospital_id
      AND tr.inserted_date BETWEEN p_start_date AND p_end_date

      -- ✅ CHILD AGE FILTER
      AND (
            p_is_age12 IS NOT TRUE
            OR ((COALESCE(tr.age_year,0) * 12 + COALESCE(tr.age_month,0)) <= 144)
          )

    ORDER BY tr.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$BODY$;

ALTER FUNCTION public.get_triage_list(integer, integer, integer, timestamp without time zone, timestamp without time zone, boolean)
    OWNER TO postgres;
