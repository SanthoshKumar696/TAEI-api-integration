-- FUNCTION: public.get_emo_triage_non_index_by_triage_id(bigint)

-- DROP FUNCTION IF EXISTS public.get_emo_triage_non_index_by_triage_id(bigint);

CREATE OR REPLACE FUNCTION public.get_emo_triage_non_index_by_triage_id(
	p_triage_id bigint)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    emo_json JSON;
    emo_triage_outcome_json JSON;
BEGIN   
	--------------------------------------------------------------------
    -- 1. Main EMO Data
    --------------------------------------------------------------------
	SELECT json_build_object(
		'id', e.id,
		'triage_id', e.triage_id,
		'past_history', (
			SELECT string_agg(l.name, ', ')
			FROM lkp_emo_past_history l
			WHERE l.id = ANY(e.past_history)
		),
		'diagnosis', e.diagnosis,
		'emergency_category', COALESCE(lkpec.name, e.emergency_category::text),
		'oth_emergency_category', e.oth_emergency_category,
		'is_patient_smells_alcohol', CASE WHEN e.is_patient_smells_alcohol THEN 'Yes' ELSE 'No' END,
		'is_alcohol_consumption', CASE WHEN e.is_alcohol_consumption THEN 'Yes' ELSE 'No' END,
		'is_drunken_drive_history', CASE WHEN e.is_drunken_drive_history THEN 'Yes' ELSE 'No' END,
		'time_of_examination', to_char(e.time_of_examination, 'DD-Mon-YYYY HH12:MI AM'),
		'memory', COALESCE(lkmem.name, e.memory::text),
		'self_control', COALESCE(lksc.name, e.self_control::text),
		'is_smell_in_breath', CASE WHEN e.is_smell_in_breath THEN 'Yes' ELSE 'No' END,
		'is_urine_alchol_concentration', CASE WHEN e.is_urine_alchol_concentration THEN 'Yes' ELSE 'No' END,
		'speech', COALESCE(lkspeech.name, e.speech::text),
		'general_disposition', COALESCE(lkgd.name, e.general_disposition::text),
		'clothing', COALESCE(lkcloth.name, e.clothing::text),
		'reaction_time', COALESCE(lkrt.name, e.reaction_time::text),
		'orientation_time', COALESCE(lkot.name, e.orientation_time::text),
		'is_drug_abuse', CASE WHEN e.is_drug_abuse THEN 'Yes' ELSE 'No' END,
		'is_mlc', CASE WHEN e.is_mlc THEN 'Yes' ELSE 'No' END,
		'ar_number', e.ar_number,
		'mlc_date', e.mlc_date,
		'mlc_time', e.mlc_time,
		'pain_scale', e.pain_scale,
		'pain_score', e.pain_score,
		'treatment_given', e.treatment_given,
		'emo_trauma_treatment', COALESCE(lktreat.name, e.emo_trauma_treatment::text),
		'name_of_the_emo', e.name_of_the_emo
	) 
	INTO emo_json
	FROM emo_triage e
	LEFT JOIN lkp_emo_emergency_category lkpec ON lkpec.id = e.emergency_category
	LEFT JOIN lkp_emo_recall_info lkmem ON lkmem.id = e.memory
	LEFT JOIN lkp_emo_recall_info lksc ON lksc.id = e.self_control
	LEFT JOIN lkp_emo_speech lkspeech ON lkspeech.id = e.speech
	LEFT JOIN lkp_emo_gen_disposition lkgd ON lkgd.id = e.general_disposition
	LEFT JOIN lkp_emo_clothing lkcloth ON lkcloth.id = e.clothing
	LEFT JOIN lkp_emo_recall_info lkrt ON lkrt.id = e.reaction_time
	LEFT JOIN lkp_emo_orientation_time lkot ON lkot.id = e.orientation_time
	LEFT JOIN lkp_emo_trauma_treatment lktreat ON lktreat.id = e.emo_trauma_treatment
	WHERE e.triage_id = p_triage_id
	LIMIT 1;

	--------------------------------------------------------------------
    -- 2. Outcome Data
    --------------------------------------------------------------------
    SELECT json_build_object(
        'id', o.id,
        'outcome', bo.name,
        'outcome_datetime', to_char(o.outcome_datetime, 'DD-Mon-YYYY HH12:MI AM'),        
		'sent_to', o.sent_to,
        'hospital_type', ht.name,		
        'destination_hospital', o.destination_hospital,
		'destination_taei_hospital', dh.hospitalname,
        'reason_for_referral', rr.name,
        'condition_of_patient', cp.name,
        'referring_doctor_name', o.referring_doctor_name,
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO emo_triage_outcome_json
    FROM emo_triage_outcome o
    LEFT JOIN lkp_emo_outcome bo ON bo.id = o.outcome
    LEFT JOIN lkp_hospital_type ht ON ht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient cp ON cp.id = o.condition_of_patient
    WHERE o.emo_id IN (SELECT id FROM emo_triage WHERE triage_id = p_triage_id)
    LIMIT 1;
	
    --------------------------------------------------------------------
    -- 3. Combine both sections
    --------------------------------------------------------------------
    RETURN json_build_object(
        'emo', emo_json,
        'outcome', emo_triage_outcome_json
    );	
END;
$BODY$;

ALTER FUNCTION public.get_emo_triage_non_index_by_triage_id(bigint)
    OWNER TO postgres;
