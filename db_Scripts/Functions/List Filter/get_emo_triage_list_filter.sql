-- FUNCTION: public.get_emo_triage_list_filter(integer, integer, integer, timestamp without time zone, timestamp without time zone, text, integer, boolean)

-- DROP FUNCTION IF EXISTS public.get_emo_triage_list_filter(integer, integer, integer, timestamp without time zone, timestamp without time zone, text, integer, boolean);

CREATE OR REPLACE FUNCTION public.get_emo_triage_list_filter(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone,
	p_patient_name text,
	p_discharge_status integer,
	p_is_age12 boolean DEFAULT false)
    RETURNS TABLE(triage_id integer, name_of_patient character varying, mode_of_arrival character varying, scene_ift character varying, medical_emergency text, surgical_emergency text, statusid integer, triage_flag character varying, emo_id integer, isadult integer, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    WITH base AS (
        SELECT tr.id AS triage_id
        FROM triage tr
        LEFT JOIN emo_triage emo ON emo.triage_id = tr.id      
        LEFT JOIN emo_triage_outcome outc ON outc.emo_id = emo.id
        WHERE tr.institution_id = p_hospital_id
			AND tr.inserted_date BETWEEN p_start_date AND p_end_date
			AND (
				p_patient_name IS NULL OR p_patient_name = '' OR 
				tr.name_of_patient ILIKE '%' || p_patient_name || '%'
			)
			AND 
			(
				(p_discharge_status IS NULL AND outc.is_discharged IS NULL)
				OR (p_discharge_status = 1 AND outc.is_discharged = TRUE)
				OR (p_discharge_status = 0 AND outc.is_discharged = FALSE)
				OR (p_discharge_status = 2 AND (outc.is_discharged IS NULL OR outc.is_discharged = TRUE OR outc.is_discharged = FALSE))
			)
			AND (
	            p_is_age12 IS NOT TRUE
	            OR ((COALESCE(tr.age_year,0) * 12 + COALESCE(tr.age_month,0)) <= 144)
          	)
    )
    SELECT 
        tr.id AS triage_id,
        tr.name_of_patient,
        moa.name AS mode_of_arrival,
        scene.name AS scene_ift,
        
        -- MEDICAL EMERGENCY AGGREGATION
        string_agg(pcme.name, ', ')
        || 
        COALESCE(
            CASE WHEN td.oth_pc_medical_emergency IS NOT NULL 
                 THEN ', ' || td.oth_pc_medical_emergency::TEXT 
            END,
        '') AS medical_emergency,

        -- SURGICAL EMERGENCY
        pcse.name 
        || 
        COALESCE(
            CASE WHEN td.oth_pc_surgical_emergency IS NOT NULL
                 THEN ', ' || td.oth_pc_surgical_emergency::TEXT
            END,
        '') AS surgical_emergency,

        CASE 
            WHEN emo.id IS NULL THEN 1
            WHEN emo.emergency_category IS NULL THEN 2
            ELSE 3
        END AS statusId,

        tf.name AS triage_flag,
        emo.id AS emo_id,

        CASE WHEN (COALESCE(tr.age_year,0)*12 + COALESCE(tr.age_month,0)) > 144 
             THEN 1 ELSE 0 END AS isadult,

        COUNT(*) OVER()::INT AS total_count

    FROM base b
    JOIN triage tr ON tr.id = b.triage_id
    LEFT JOIN emo_triage emo ON emo.triage_id = tr.id
    LEFT JOIN triage_dtls td ON td.triage_id = tr.id
    LEFT JOIN LATERAL unnest(td.pc_medical_emergency) AS me(id) ON TRUE
    LEFT JOIN lkp_triage_dtls_pc_medical_emergency pcme ON pcme.id = me.id
    LEFT JOIN lkp_triage_dtls_pc_surgical_emergency pcse ON pcse.id = td.pc_surgical_emergency
    LEFT JOIN lkp_triage_dtls_triage_flag tf ON tf.id = td.triage_flag
    LEFT JOIN lkp_triage_mode_of_arrival moa ON moa.id = tr.mode_of_arrival
    LEFT JOIN lkp_triage_scene_ift scene ON scene.id = tr.scene_ift

    GROUP BY tr.id, td.id, moa.name, scene.name, pcse.name, tf.name, emo.id
    ORDER BY tr.id DESC
    LIMIT p_limit OFFSET p_offset;

END;
$BODY$;

ALTER FUNCTION public.get_emo_triage_list_filter(integer, integer, integer, timestamp without time zone, timestamp without time zone, text, integer, boolean)
    OWNER TO postgres;
