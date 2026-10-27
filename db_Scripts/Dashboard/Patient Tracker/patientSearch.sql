--DROP FUNCTION IF EXISTS public.get_state_patient_tracker_search_triage(TEXT,TEXT,INT,INT,INT);
--select * from get_state_patient_tracker_search_triage('anb','',20,1,1)
CREATE OR REPLACE FUNCTION public.get_state_patient_tracker_search_triage(
    p_name TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0,
	p_search_type INT DEFAULT 1,
	p_case_id varchar(255) DEFAULT ''
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_agg(row_data)
    INTO result
    FROM (
        SELECT json_build_object(
            'triage_id', t.id,
            'date_time_of_triage', to_char(t.date_time_of_triage,'DD-Mon-YYYY HH12:MI AM'),
            'name_of_patient', t.name_of_patient,
            'patient_mobile_number', t.patient_mobile_number,
            'hospital_name', hospitalname,
            'districtname', districtname,
            'address',address_line,
            'gender', lg.name,
			'emergency_category',emc.name,
			'emergency_category_id',emo.emergency_category,
            -- 108 DETAILS
            'triage_by_108', (
                json_build_object(
                    'call_id', tb108.call_id,
                    'vehicle_number', tb108.vehicle_number,
                    'chief_complaint', tb108.chief_complaint
                )
            ),
            -- TRIAGE DETAILS
            'triage_dtls', (
                SELECT json_build_object(
                    'pulse', td.pulse,
                    'bp_systolic', td.bp_systolic,
                    'bp_diastolic', td.bp_diastolic,
                    'spo2', td.spo2,
                    'temperature', td.temperature,
					'brought_dead',td.brought_dead,
					'triage_flag',td.triage_flag
                )
                FROM triage_dtls td 
                WHERE td.triage_id = t.id
                LIMIT 1
            )
        ) AS row_data
        FROM triage t
        LEFT JOIN lkp_triage_gender lg ON t.gender = lg.id
		LEFT JOIN lkp_hospitals ho on ho.hospitalid=t.institution_id
		LEFT JOIN triage_by_108 tb108 on tb108.triage_id = t.id and call_id is not null
		LEFT JOIN emo_triage emo on emo.triage_id=t.id
		LEFT JOIN lkp_emo_emergency_category emc on emc.id=emo.emergency_category
		WHERE 
		(
			p_search_type = 1 
			AND p_name!='' 
			AND LOWER(t.name_of_patient) LIKE LOWER('%' || p_name || '%')
		)
		OR
		(
			p_search_type = 2 
			AND p_mobile!=''
			AND t.patient_mobile_number LIKE '%' || p_mobile || '%'
		)
		OR
		(
			p_search_type=3
			AND p_case_id!=''
			AND tb108.call_id=p_case_id
		)
        ORDER BY t.id DESC
        LIMIT p_limit OFFSET p_offset
    ) AS sub;

    RETURN result;
END;
$$;
