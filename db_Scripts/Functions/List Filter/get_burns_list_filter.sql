-- FUNCTION: public.get_burns_list_filter(integer, integer, integer, timestamp without time zone, timestamp without time zone, character varying, integer)

-- DROP FUNCTION IF EXISTS public.get_burns_list_filter(integer, integer, integer, timestamp without time zone, timestamp without time zone, character varying, integer);

CREATE OR REPLACE FUNCTION public.get_burns_list_filter(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone,
	p_patient_name character varying,
	p_discharge_status integer)
    RETURNS TABLE(triage_id integer, mode_of_arrival character varying, scene_ift character varying, name_of_patient character varying, emergency_category character varying, presenting_complaint text, source_hospital character varying, destination_hospital character varying, statusid integer, triage_flag character varying, burns_id integer, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
        tr.id AS triage_id,
        moa.name AS mode_of_arrival,
        scene.name AS scene_ift,
        tr.name_of_patient,
        ec.name AS emergency_category,

        STRING_AGG(DISTINCT pcme.name, ', ')
            || COALESCE(', ' || td.oth_pc_medical_emergency, '')
            || COALESCE(', ' || pcse.name, '')
            || COALESCE(', ' || td.oth_pc_surgical_emergency, '') AS presenting_complaint,

        tr.source_hospital,
        tr.destination_hospital,

        CASE 
            WHEN main.id IS NULL THEN 1
            WHEN outcome.is_discharged = TRUE THEN 3
            ELSE 2
        END AS statusId,

        tf.name AS triage_flag,
        main.id AS burns_id,

        COUNT(*) OVER()::INT AS total_count

    FROM triage tr
        JOIN emo_triage emo 
            ON emo.triage_id = tr.id
           AND emo.inserted_date BETWEEN p_start_date AND p_end_date
           AND emo.emergency_category IN (3, 4)
        JOIN emo_triage_outcome emo_outcome 
            ON emo_outcome.emo_id = emo.id 
				and ( emo_outcome.outcome is null
					or emo_outcome.outcome in(select id from lkp_emo_outcome where show_pillar= true)
				)
        LEFT JOIN lkp_emo_emergency_category ec ON ec.id = emo.emergency_category
        LEFT JOIN burns main ON main.triage_id = tr.id
        LEFT JOIN burns_outcome outcome ON outcome.burns_id = main.id

        LEFT JOIN triage_dtls td ON td.triage_id = tr.id
        LEFT JOIN lkp_triage_dtls_triage_flag tf ON tf.id = td.triage_flag
        LEFT JOIN lkp_triage_mode_of_arrival moa ON moa.id = tr.mode_of_arrival
        LEFT JOIN lkp_triage_scene_ift scene ON scene.id = tr.scene_ift
        LEFT JOIN lkp_triage_dtls_pc_surgical_emergency pcse ON pcse.id = td.pc_surgical_emergency
        LEFT JOIN LATERAL unnest(td.pc_medical_emergency) AS me(id) ON TRUE
        LEFT JOIN lkp_triage_dtls_pc_medical_emergency pcme ON pcme.id = me.id

    WHERE tr.institution_id = p_hospital_id

        -- ⬇ 1. Patient name fuzzy search
        AND (
                p_patient_name IS NULL 
             OR p_patient_name = '' 
             OR tr.name_of_patient ILIKE '%' || p_patient_name || '%'
        )

        -- ⬇ 2. Discharged filter (NULL = ignore)
        AND 
            (
                (p_discharge_status IS NULL AND outcome.is_discharged IS NULL)
                OR (p_discharge_status = 1 AND outcome.is_discharged = TRUE)
                OR (p_discharge_status = 0 AND outcome.is_discharged = FALSE)
                OR (p_discharge_status = 2 AND (outcome.is_discharged IS NULL OR outcome.is_discharged = TRUE OR outcome.is_discharged = FALSE))
            )

    GROUP BY 
        tr.id, td.id, moa.name, scene.name, ec.name,
        pcse.name, main.id, outcome.is_discharged, tf.name

    ORDER BY tr.id DESC
    LIMIT p_limit OFFSET p_offset;

END;
$BODY$;