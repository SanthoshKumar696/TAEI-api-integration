-- FUNCTION: public.get_emo_triage_list(integer, integer, integer, timestamp without time zone, timestamp without time zone)

-- DROP FUNCTION IF EXISTS public.get_emo_triage_list(integer, integer, integer, timestamp without time zone, timestamp without time zone);

CREATE OR REPLACE FUNCTION public.get_emo_triage_list(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone)
    RETURNS TABLE(triage_id integer, name_of_patient character varying, mode_of_arrival character varying, scene_ift character varying, medical_emergency text, surgical_emergency text, statusid integer, triage_flag character varying, emo_id integer, isadult integer, total_count integer) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT 
        tr.id AS triage_id,             -- Case ID
        tr.name_of_patient,             -- Patient Name
        moa.name AS mode_of_arrival,    -- Mode of arrival (lookup ref possible)
		scene.name AS scene_ift,
		string_agg(pcme.name, ', ') || COALESCE(', ' || td.oth_pc_medical_emergency::TEXT, '') AS medical_emergency,
		pcse.name || COALESCE(', ' || td.oth_pc_surgical_emergency::TEXT, '')  AS surgical_emergency,
		case when emo.id is null then 1 
			 when emo.emergency_category is null then 2
			 else 3 end -- 0 is dummy for now - we may have to decide latter
		AS statusId, 					--Need to show status in UI - 1 for new, 2 for open and 3 for closed
		tf.name as triage_flag,
		emo.id AS emo_id,            		-- EMO PK ID
		case when (COALESCE(tr.age_year, 0)*12+ COALESCE(tr.age_month, 0)) > 144 then 1 else 0 end AS isadult,
        COUNT(*) OVER()::INT AS total_count
    FROM triage tr
		LEFT JOIN emo_triage emo ON emo.triage_id = tr.id --AND emo.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp	
			--AND emo.emergency_category IS NULL -- This condition to be added we may get empty records
	    LEFT JOIN triage_by_108 t108 ON t108.triage_id = tr.id
	    LEFT JOIN triage_dtls td ON td.triage_id = tr.id -- can add if needed
			LEFT JOIN lkp_triage_dtls_triage_flag tf ON tf.id = td.triage_flag
			LEFT JOIN lkp_triage_mode_of_arrival moa ON moa.id = tr.mode_of_arrival	
			LEFT JOIN lkp_triage_scene_ift scene ON scene.id = tr.scene_ift
			LEFT JOIN lkp_triage_dtls_pc_surgical_emergency pcse ON pcse.id = td.pc_surgical_emergency
			LEFT JOIN LATERAL unnest(td.pc_medical_emergency) AS me(id) ON true
			LEFT JOIN lkp_triage_dtls_pc_medical_emergency pcme ON pcme.id = me.id
	   WHERE tr.institution_id = p_hospital_id-- (p_triage_id IS NULL OR tr.id = p_triage_id) -- TODO:-  need to add InstitutionId and hospitalid if required
	   		AND tr.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp	
		GROUP BY tr.id, td.id, moa.name, scene.name, pcse.name, tf.name, emo.id
    	ORDER BY tr.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$BODY$;

ALTER FUNCTION public.get_emo_triage_list(integer, integer, integer, timestamp without time zone, timestamp without time zone)
    OWNER TO taei;
