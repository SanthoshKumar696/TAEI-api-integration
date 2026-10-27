-- FUNCTION: public.get_prem_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_prem_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_prem_non_index_by_triage_id(
	triage_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    prem_json JSON;
    prem_vitals_json JSON;
    prem_outcome_json JSON;
BEGIN
    -- 1) Main PREM table
    SELECT json_build_object(
        'id', p.id,
        'triage_id', p.triage_id,
        'date_time_of_entry', to_char(p.date_time_of_entry, 'DD-Mon-YYYY HH12:MI AM'),
        'patient_admitted', p.patient_admitted,
        'name_of_dept', p.name_of_dept,
        'date_of_admit', to_char(p.date_of_admit, 'DD-Mon-YYYY HH12:MI AM'),
        'is_prem_casesheet_used', p.is_prem_casesheet_used,
        'presenting_complaints_prem', (
            SELECT string_agg(pc.name, ', ')
            FROM lkp_prem_presenting_complaints pc
            WHERE pc.id = ANY(p.presenting_complaints_prem)
        ),
        'oth_presenting_complaints_prem', p.oth_presenting_complaints_prem,
        'temperature', p.temperature,
        'approx_weight', p.approx_weight,
        'cbg', p.cbg,
        'development', ld.name,
        'co_morbid_conditions', p.co_morbid_conditions,
        'triage_flag', tf.name,
        'user_id', p.user_id,
        'inserted_date', to_char(p.inserted_date, 'DD-Mon-YYYY HH12:MI AM'),
        'ref_form_id', p.ref_form_id,
        'ref_id', p.ref_id
    )
    INTO prem_json
    FROM prem p
    LEFT JOIN lkp_prem_development ld ON ld.id = p.development
    LEFT JOIN lkp_prem_triage_flag tf ON tf.id = p.triage_flag
    WHERE p.triage_id = triage_id_input
    LIMIT 1;

    -- 2) PREM_VITALS
    SELECT json_build_object(
        'id', v.id,
        'airway', la.name,
        'breathing', lb.name,
        'circulation_hr', ch.name,
        'perfusion', lp.name,
        'liver_span', ls.name,
        'systolic_bp', sb.name,
        'map', lm.name,
        'disability', ld.name,
        'tone_posture', tp.name,
        'eye_position_movements', epm.name,
        'pupils', pup.name,
        'diagnosis', d.name,
        'diagnosis_refvalue', dr.name,
        'procedures_done', (
            SELECT string_agg(pd.name, ', ')
            FROM lkp_prem_procedures_done pd
            WHERE pd.id = ANY(v.procedures_done)
        ),
        'treatment_given', v.treatment_given
    )
    INTO prem_vitals_json
    FROM prem_vitals v
    LEFT JOIN lkp_prem_airway la ON la.id = v.airway
    LEFT JOIN lkp_prem_breathing lb ON lb.id = v.breathing
    LEFT JOIN lkp_prem_circulation_hr ch ON ch.id = v.circulation_hr
    LEFT JOIN lkp_prem_perfusion lp ON lp.id = v.perfusion
    LEFT JOIN lkp_prem_liver_span ls ON ls.id = v.liver_span
    LEFT JOIN lkp_prem_systolic_bp sb ON sb.id = v.systolic_bp
    LEFT JOIN lkp_prem_map lm ON lm.id = v.map
    LEFT JOIN lkp_prem_disability ld ON ld.id = v.disability
    LEFT JOIN lkp_prem_tone_posture tp ON tp.id = v.tone_posture
    LEFT JOIN lkp_prem_eye_position_movements epm ON epm.id = v.eye_position_movements
    LEFT JOIN lkp_prem_pupils pup ON pup.id = v.pupils
    LEFT JOIN lkp_prem_diagnosis d ON d.id = v.diagnosis
    LEFT JOIN lkp_prem_diagnosis_ref dr ON dr.id = v.diagnosis_refvalue
    WHERE v.prem_id IN (SELECT id FROM prem WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- 3) PREM_OUTCOME
    SELECT json_build_object(
        'id', o.id,
        'outcome', po.name,
        'discharge_date', to_char(o.discharge_date, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_date', to_char(o.absconded_date, 'DD-Mon-YYYY HH12:MI AM'),
        'death_date', to_char(o.death_date, 'DD-Mon-YYYY HH12:MI AM'),
        'cause_of_death', o.cause_of_death,
        'patient_exit_date', to_char(o.patient_exit_date, 'DD-Mon-YYYY HH12:MI AM'),
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
		'destination_taei_hospital', dh.hospitalname,
        'reason_for_referral', rr.name,
        'condition_of_patient', cp.name,
        'referring_doctor', o.referring_doctor,
        'patient_stabilised_referral', psr.name,
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO prem_outcome_json
    FROM prem_outcome o
    LEFT JOIN lkp_prem_outcome po ON po.id = o.outcome
    LEFT JOIN lkp_hospital_type ht ON ht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient cp ON cp.id = o.condition_of_patient
    LEFT JOIN lkp_prem_stabilised_referral psr ON psr.id = o.patient_stabilised_referral
    WHERE o.prem_id IN (SELECT id FROM prem WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- Combine all into JSON object
    RETURN json_build_object(
        'prem', prem_json,
        'vitals', prem_vitals_json,
        'outcome', prem_outcome_json
    );
END;
$BODY$;
