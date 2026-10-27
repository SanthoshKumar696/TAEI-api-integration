-- FUNCTION: public.get_trauma_list_filter(integer, integer, integer, timestamp without time zone, timestamp without time zone, character varying, integer)

-- DROP FUNCTION IF EXISTS public.get_trauma_list_filter(integer, integer, integer, timestamp without time zone, timestamp without time zone, character varying, integer);

CREATE OR REPLACE FUNCTION public.get_trauma_list_filter(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone,
	p_patient_name character varying DEFAULT NULL::character varying,
	p_discharge_status integer DEFAULT NULL::integer)
    RETURNS TABLE(triage_id integer, ddd character varying, mode_of_arrival character varying, scene_ift character varying, name_of_patient character varying, emergency_category character varying, presenting_complaint text, source_hospital character varying, destination_hospital character varying, statusid integer, triage_flag character varying, date_time_of_triage timestamp without time zone, date_and_time_of_incident timestamp without time zone, trauma_id integer, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    WITH base AS (
        SELECT DISTINCT tr.id
        FROM triage tr
        JOIN emo_triage emo 
            ON emo.triage_id = tr.id
           AND emo.inserted_date BETWEEN p_start_date AND p_end_date
           AND emo.emergency_category IN (1, 2)
        JOIN emo_triage_outcome emo_outcome 
            ON emo_outcome.emo_id = emo.id 
                and ( emo_outcome.outcome is null
                    or emo_outcome.outcome in(select id from lkp_emo_outcome where show_pillar= true)
                )
        WHERE tr.institution_id = p_hospital_id
          AND (p_patient_name IS NULL OR tr.name_of_patient ILIKE '%' || p_patient_name || '%')
    ),
    main_query AS (
        SELECT
            tr.id AS triage_id,
            ett.name AS ddd,
            moa.name AS mode_of_arrival,
            scene.name AS scene_ift,
            tr.name_of_patient,
            ec.name AS emergency_category,

            -- consolidated complaint text
            (
                SELECT string_agg(DISTINCT x.val, ', ')
                FROM (
                    SELECT pcme.name AS val
                    FROM triage_dtls td2
                    LEFT JOIN LATERAL unnest(td2.pc_medical_emergency) AS me(id) ON TRUE
                    LEFT JOIN lkp_triage_dtls_pc_medical_emergency pcme ON pcme.id = me.id
                    WHERE td2.triage_id = tr.id

                    UNION

                    SELECT pcse.name
                    FROM triage_dtls td3
                    LEFT JOIN lkp_triage_dtls_pc_surgical_emergency pcse ON pcse.id = td3.pc_surgical_emergency
                    WHERE td3.triage_id = tr.id

                    UNION
                    SELECT td.oth_pc_medical_emergency::TEXT FROM triage_dtls td WHERE td.triage_id = tr.id

                    UNION
                    SELECT td.oth_pc_surgical_emergency::TEXT FROM triage_dtls td WHERE td.triage_id = tr.id
                ) x
                WHERE x.val IS NOT NULL
            ) AS presenting_complaint,

            tr.source_hospital,
            tr.destination_hospital,

            CASE 
                WHEN t.id IS NULL THEN 1       -- NEW
                WHEN o.is_discharged = TRUE THEN 3   -- CLOSED
                ELSE 2                          -- OPEN
            END AS statusid,

            tf.name AS triage_flag,
            tr.date_time_of_triage,
            tr.date_and_time_of_incident,
            t.id AS trauma_id,
            COUNT(*) OVER()::INT AS total_count

        FROM base b
        JOIN triage tr ON tr.id = b.id
        JOIN emo_triage emo ON emo.triage_id = tr.id

        LEFT JOIN trauma t ON t.triage_id = tr.id
        LEFT JOIN trauma_outcome o ON o.trauma_id = t.id

        LEFT JOIN triage_dtls td ON td.triage_id = tr.id
        LEFT JOIN lkp_triage_dtls_triage_flag tf ON tf.id = td.triage_flag
        LEFT JOIN lkp_triage_mode_of_arrival moa ON moa.id = tr.mode_of_arrival
        LEFT JOIN lkp_triage_scene_ift scene ON scene.id = tr.scene_ift
        LEFT JOIN lkp_emo_emergency_category ec ON ec.id = emo.emergency_category
        LEFT JOIN lkp_emo_trauma_treatment ett ON ett.id = emo.emo_trauma_treatment
        
        WHERE  
        (
            (p_discharge_status IS NULL AND o.is_discharged IS NULL)
            OR (p_discharge_status = 1 AND o.is_discharged = TRUE)
            OR (p_discharge_status = 0 AND o.is_discharged = FALSE)
            OR (p_discharge_status = 2 AND (o.is_discharged IS NULL OR o.is_discharged = TRUE OR o.is_discharged = FALSE))
        )

        GROUP BY 
            tr.id, ett.name, moa.name, scene.name, ec.name,
            tr.name_of_patient, tr.source_hospital, tr.destination_hospital,
            tf.name, tr.date_time_of_triage, tr.date_and_time_of_incident,
            t.id, o.is_discharged
    )
    SELECT *
    FROM main_query
    ORDER BY triage_id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$BODY$;