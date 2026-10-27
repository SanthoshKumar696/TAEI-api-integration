-- FUNCTION: public.get_prem_list(integer, integer, integer, timestamp without time zone, timestamp without time zone)

-- DROP FUNCTION IF EXISTS public.get_prem_list(integer, integer, integer, timestamp without time zone, timestamp without time zone);

CREATE OR REPLACE FUNCTION public.get_prem_list(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone)
    RETURNS TABLE(triage_id integer, mode_of_arrival character varying, scene_ift character varying, name_of_patient character varying, emergency_category character varying, presenting_complaint text, source_hospital character varying, destination_hospital character varying, statusid integer, triage_flag character varying, prem_id integer, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ON (tr.id)
        tr.id AS triage_id,
        moa.name AS mode_of_arrival,
        scene.name AS scene_ift,
        tr.name_of_patient, 
        ec.name AS emergency_category,
        string_agg(DISTINCT pcme.name, ', ')
            || COALESCE(', ' || td.oth_pc_medical_emergency, '')
            || COALESCE(', ' || pcse.name, '')
            || COALESCE(', ' || td.oth_pc_surgical_emergency, '') AS presenting_complaint,
        tr.source_hospital,
        tr.destination_hospital,
        CASE 
            WHEN main.id IS NULL THEN 1 
            WHEN outcome.is_discharged = true then 3
			else 2 END AS statusId, -- 1=new, 2=open, 3=closed
        tf.name AS triage_flag,
        main.id AS prem_id,
        COUNT(*) OVER()::INT AS total_count

    FROM triage tr
        JOIN emo_triage emo ON emo.triage_id = tr.id AND emo.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp
        LEFT JOIN lkp_emo_emergency_category ec ON ec.id = emo.emergency_category		
        LEFT JOIN prem main ON main.triage_id = tr.id --AND main.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp		
        LEFT JOIN prem_outcome outcome ON outcome.prem_id = main.id 
        LEFT JOIN triage_dtls td ON td.triage_id = tr.id
        LEFT JOIN lkp_triage_dtls_triage_flag tf ON tf.id = td.triage_flag
        LEFT JOIN lkp_triage_mode_of_arrival moa ON moa.id = tr.mode_of_arrival
        LEFT JOIN lkp_triage_scene_ift scene ON scene.id = tr.scene_ift
        LEFT JOIN lkp_triage_dtls_pc_surgical_emergency pcse ON pcse.id = td.pc_surgical_emergency
        LEFT JOIN LATERAL unnest(td.pc_medical_emergency) AS me(id) ON TRUE
        LEFT JOIN lkp_triage_dtls_pc_medical_emergency pcme ON pcme.id = me.id

    WHERE tr.institution_id = p_hospital_id
      AND (
          -- condition 1: emergency_category in 2,4,9
          (emo.emergency_category IN (2, 4, 9))
          -- OR condition 2: pediatric (<=12 years)
          OR (tr.age_year < 12 OR (tr.age_year = 12 AND tr.age_month <= 0))
      )
    GROUP BY tr.id, td.id, moa.name, scene.name, ec.name, pcse.name, 
             main.id, outcome.discharge_date, tf.name, outcome.is_discharged
    ORDER BY tr.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$BODY$;

ALTER FUNCTION public.get_prem_list(integer, integer, integer, timestamp without time zone, timestamp without time zone)
    OWNER TO taei;
