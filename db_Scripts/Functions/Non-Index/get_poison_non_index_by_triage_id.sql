-- FUNCTION: public.get_poison_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_poison_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_poison_non_index_by_triage_id(
	triage_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    poison_json JSON;
    poison_outcome_json JSON;
BEGIN
    --------------------------------------------------------------------
    -- 1. Main POISONS Data
    --------------------------------------------------------------------
    SELECT json_build_object(
        'id', p.id,
        'triage_id', p.triage_id,
        'date_time_of_entry', to_char(p.date_time_of_entry, 'DD-Mon-YYYY HH12:MI AM'),
        'patient_admitted', CASE WHEN p.patient_admitted THEN 'Yes' ELSE 'No' END,
        'name_of_dept', p.name_of_dept,
        'date_of_admit', to_char(p.date_of_admit, 'DD-Mon-YYYY HH12:MI AM'),
        'type_of_poisoning', tp.name,
        'route_of_exposure', rexp.name,
        'substance_involved', si.name,
        'substance_involved_sub', sis.name,
        'oth_substance_involved', p.oth_substance_involved,
        'brand_or_product_name', p.brand_or_product_name,
        'quantity', p.quantity,
        'source_of_substance', ss.name,
        'symptoms_at_presentation', (
            SELECT string_agg(sp.name, ', ')
            FROM lkp_poison_symptoms_presentation sp
            WHERE sp.id = ANY(p.symptoms_at_presentation)
        ),
        'time_of_onset_of_symptoms', to_char(p.time_of_onset_of_symptoms, 'DD-Mon-YYYY HH12:MI AM'),
        'time_elapsed_exposure_symptom', p.time_elapsed_exposure_symptom,
        'investigations_performed', p.investigations_performed,
        'severity_of_poisoning', sev.name,
        'decontamination', (
            SELECT string_agg(dc.name, ', ')
            FROM lkp_poison_decontamination dc
            WHERE dc.id = ANY(p.decontamination)
        ),
        'antidote_administered_name', p.antidote_administered_name,
        'antidote_administered_dosage', p.antidote_administered_dosage,
        'antidote_administered_timing', to_char(p.antidote_administered_timing, 'DD-Mon-YYYY HH12:MI AM'),
        'supportive_care_provided', (
            SELECT string_agg(sc.name, ', ')
            FROM lkp_poison_supportive_care_provided sc
            WHERE sc.id = ANY(p.supportive_care_provided)
        ),
        'no_of_cycles_performed', p.no_of_cycles_performed,
        'counselling_provided', CASE WHEN p.counselling_provided THEN 'Yes' ELSE 'No' END,
        'duration_of_hospital_stay', p.duration_of_hospital_stay,
        'user_id', p.user_id,
        'inserted_date', to_char(p.inserted_date, 'DD-Mon-YYYY HH12:MI AM'),
        'ref_form_id', p.ref_form_id,
        'ref_id', p.ref_id
    )
    INTO poison_json
    FROM poisons p
    LEFT JOIN lkp_poison_type_of_poisoning tp ON tp.id = p.type_of_poisoning
    LEFT JOIN lkp_poison_route_of_exposure rexp ON rexp.id = p.route_of_exposure
    LEFT JOIN lkp_poison_substance_involved si ON si.id = p.substance_involved
    LEFT JOIN lkp_poison_substance_involved_sub sis ON sis.id = p.substance_involved_sub
    LEFT JOIN lkp_poison_source_of_substance ss ON ss.id = p.source_of_substance
    LEFT JOIN lkp_poison_severity_of_poisoning sev ON sev.id = p.severity_of_poisoning
    WHERE p.triage_id = triage_id_input
    LIMIT 1;

    --------------------------------------------------------------------
    -- 2. POISONS_OUTCOME Data
    --------------------------------------------------------------------
    SELECT json_build_object(
        'id', o.id,
        'outcome', po.name,
        'discharge_date', to_char(o.discharge_date, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_date', to_char(o.absconded_date, 'DD-Mon-YYYY HH12:MI AM'),
        'death_date', to_char(o.death_date, 'DD-Mon-YYYY HH12:MI AM'),
        'cause_of_death', o.cause_of_death,
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
		'destination_taei_hospital', dh.hospitalname,
        'reason_for_referral', rr.name,
        'oth_reason_for_referral', o.oth_reason_for_referral,
        'condition_of_patient', cp.name,
        'referring_doctor', o.referring_doctor,
        'documented_taei_sheet', CASE WHEN o.documented_taei_sheet THEN 'Yes' ELSE 'No' END,
        'patient_exit_date', to_char(o.patient_exit_date, 'DD-Mon-YYYY HH12:MI AM'),
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO poison_outcome_json
    FROM poisons_outcome o
    LEFT JOIN lkp_poison_outcome po ON po.id = o.outcome
    LEFT JOIN lkp_hospital_type ht ON ht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient cp ON cp.id = o.condition_of_patient
    WHERE o.poison_id IN (SELECT id FROM poisons WHERE triage_id = triage_id_input)
    LIMIT 1;

    --------------------------------------------------------------------
    -- 3. Combine All into One JSON Object
    --------------------------------------------------------------------
    RETURN json_build_object(
        'poisons', poison_json,
        'poisons_outcome', poison_outcome_json
    );

END;
$BODY$;
