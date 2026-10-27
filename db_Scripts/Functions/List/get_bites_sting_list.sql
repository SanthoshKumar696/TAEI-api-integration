-- FUNCTION: public.get_bites_sting_list(integer, integer, integer, timestamp without time zone, timestamp without time zone)

-- DROP FUNCTION IF EXISTS public.get_bites_sting_list(integer, integer, integer, timestamp without time zone, timestamp without time zone);

CREATE OR REPLACE FUNCTION public.get_bites_sting_list(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone)
    RETURNS TABLE(triage_id integer, mode_of_arrival character varying, scene_ift character varying, name_of_patient character varying, emergency_category character varying, presenting_complaint text, source_hospital character varying, destination_hospital character varying, statusid integer, triage_flag character varying, bites_stings_id integer, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
	    tr.id AS triage_id,					--FYI - TAEI ID and triage_id both are same
		moa.name AS mode_of_arrival,          -- Mode of arrival (lookup ref possible) --108 / Self / IFT / Others
		scene.name AS scene_ift,
		tr.name_of_patient, 
		ec.name AS emergency_category,
		string_agg(pcme.name, ', ') || COALESCE(', ' || td.oth_pc_medical_emergency::TEXT, '') ||
			COALESCE(', ' || pcse.name::TEXT, '') || COALESCE(', ' || td.oth_pc_surgical_emergency::TEXT, '') AS presenting_complaint,
        tr.source_hospital,            -- Source Hospital
        tr.destination_hospital,       -- Destination Hospital		
		case when main.id is null then 1 
			 when outcome.is_discharged = true then 3
			 else 2 END
		AS statusId, -- 1 for new, 2 for open and 3 for closed
		tf.name as triage_flag,
		main.id AS bites_stings_id,
        COUNT(*) OVER()::INT AS total_count
    FROM triage tr
		JOIN emo_triage emo ON emo.triage_id = tr.id AND emo.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp 
				AND emo.emergency_category = 6
			LEFT JOIN lkp_emo_emergency_category ec ON ec.id = emo.emergency_category		
		
		LEFT JOIN bites_stings main ON main.triage_id = tr.id --AND main.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp	
		LEFT JOIN bites_stings_outcome outcome ON outcome.bites_stings_id = main.id 
		
    	LEFT JOIN triage_dtls td ON td.triage_id = tr.id
			LEFT JOIN lkp_triage_dtls_triage_flag tf ON tf.id = td.triage_flag
			LEFT JOIN lkp_triage_mode_of_arrival moa ON moa.id = tr.mode_of_arrival
			LEFT JOIN lkp_triage_scene_ift scene ON scene.id = tr.scene_ift
			LEFT JOIN lkp_triage_dtls_pc_surgical_emergency pcse ON pcse.id = td.pc_surgical_emergency
			LEFT JOIN LATERAL unnest(td.pc_medical_emergency) AS me(id) ON true
			LEFT JOIN lkp_triage_dtls_pc_medical_emergency pcme ON pcme.id = me.id
     WHERE tr.institution_id = p_hospital_id
	 	GROUP BY tr.id, td.id, moa.name, scene.name, ec.name, pcse.name, main.id, outcome.discharge_date, tf.name, outcome.is_discharged
    	ORDER BY tr.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$BODY$;

ALTER FUNCTION public.get_bites_sting_list(integer, integer, integer, timestamp without time zone, timestamp without time zone)
    OWNER TO taei;
