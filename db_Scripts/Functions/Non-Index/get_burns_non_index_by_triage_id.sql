-- FUNCTION: public.get_burns_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_burns_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_burns_non_index_by_triage_id(
	triage_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    burns_json JSON;
    burns_tbsa_json JSON;
    burns_values_json JSON;
    burns_surgery_elective_json JSON;
    burns_outcome_json JSON;
BEGIN
    -- 1) BURNS main table
    SELECT json_build_object(
        'id', b.id,
        'triage_id', b.triage_id,
        'admitted', b.admitted,
        'admission_date', to_char(b.admission_date, 'DD-Mon-YYYY HH12:MI AM'),
        'type_of_burn', tob.name,
        'inhalation', b.inhalation,
        'oth_type_of_burn', b.oth_type_of_burn,
        'mode_of_injury', moi.name,
		'oth_mode_of_injury', b.oth_mode_of_injury,
        'place_of_incident', poi.name,
        'oth_place_of_incident', b.oth_place_of_incident,
        'tbsa', (
            SELECT string_agg(tb.name, ', ')
            FROM lkp_burns_tbsa tb
            WHERE tb.id = ANY(b.tbsa)
        ),
        'tbsa_total_per', b.tbsa_total_per,
        'degree_of_burn', dob.name,
        'associated_injuries', b.associated_injuries,
        'co_morbidities', (
            SELECT string_agg(cm.name, ', ')
            FROM lkp_burns_co_morbidities cm
            WHERE cm.id = ANY(b.co_morbidities)
        ),
        'is_pregnant', b.is_pregnant,
        'is_fluid_resuscitation_given', b.is_fluid_resuscitation_given,
        'is_mechanical_ventillation', b.is_mechanical_ventillation,
        'user_id', b.user_id,
        'inserted_date', to_char(b.inserted_date, 'DD-Mon-YYYY HH12:MI AM'),
        'ref_form_id', b.ref_form_id,
        'ref_id', b.ref_id
    )
    INTO burns_json
    FROM burns b
    LEFT JOIN lkp_burns_type_of_burn tob ON tob.id = b.type_of_burn
    LEFT JOIN lkp_burns_mode_of_injury moi ON moi.id = b.mode_of_injury
    LEFT JOIN lkp_burns_place_of_incident poi ON poi.id = b.place_of_incident
    LEFT JOIN lkp_burns_degree_of_burn dob ON dob.id = b.degree_of_burn
    WHERE b.triage_id = triage_id_input
    LIMIT 1;

    -- 2) BURNS_TBSA
    SELECT json_build_object(
        'id', t.id,
        'head', t.head,
        'neck', t.neck,
        'anterior_trunk', t.anterior_trunk,
        'posterior_trunk', t.posterior_trunk,
        'right_gluteal', t.right_gluteal,
        'left_gluteal', t.left_gluteal,
        'genital', t.genital,
        'right_arm', t.right_arm,
        'left_arm', t.left_arm,
        'right_forearm', t.right_forearm,
        'left_forearm', t.left_forearm,
        'right_hand', t.right_hand,
        'left_hand', t.left_hand,
        'right_thigh', t.right_thigh,
        'left_thigh', t.left_thigh,
        'right_leg', t.right_leg,
        'left_leg', t.left_leg,
        'right_foot', t.right_foot,
        'left_foot', t.left_foot
    )
    INTO burns_tbsa_json
    FROM burns_tbsa t
    WHERE t.burns_id IN (SELECT id FROM burns WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- 3) BURNS_VALUES
    SELECT json_build_object(
        'id', v.id,
        'wound_management', wm.name,
		'wound_management_conservative', v.wound_management_conservative,
        'conservative', c.name,
        'hyper_baric', v.hyper_baric,
        'hyper_baric_nos', v.hyper_baric_nos,
        'oth_conservative', v.oth_conservative,
        'surgery_emergency', se.name,
		'oth_surgery_emergency', v.oth_surgery_emergency,
        'is_surgery_emergency', v.is_surgery_emergency,
        'surgery_performed_date', to_char(v.surgery_performed_date, 'DD-Mon-YYYY HH12:MI AM'),
		'is_surgery_elective_performed',v.is_surgery_elective_performed,
        'supportive_measures', (
            SELECT string_agg(sm.name, ', ')
            FROM lkp_burns_supportive_measures sm
            WHERE sm.id = ANY(v.supportive_measures)
        ),
        'complications_hospital_stay', (
            SELECT string_agg(cs.name, ', ')
            FROM lkp_burns_stay_complications cs
            WHERE cs.id = ANY(v.complications_hospital_stay)
        ),
        'multidisciplinary_support', (
            SELECT string_agg(ms.name, ', ')
            FROM lkp_burns_multidisciplinary_support ms
            WHERE ms.id = ANY(v.multidisciplinary_support)
        ),
        'oth_multidisciplinary_support', v.oth_multidisciplinary_support,
        'skin_bank_available', v.skin_bank_available,
        'skin_bank_available_value', v.skin_bank_available_value
    )
    INTO burns_values_json
    FROM burns_values v
    LEFT JOIN lkp_burns_wound_management wm ON wm.id = v.wound_management
    LEFT JOIN lkp_burns_conservative c ON c.id = v.conservative
    LEFT JOIN lkp_burns_surgery_emergency se ON se.id = v.surgery_emergency
    WHERE v.burns_id IN (SELECT id FROM burns WHERE triage_id = triage_id_input)
    LIMIT 1;

 	SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', e.id,
                'surgery_elective', se.name,
                'oth_surgery_elective', e.oth_surgery_elective,
                'surgery_elective_date', to_char(e.surgery_elective_date, 'DD-Mon-YYYY HH12:MI AM')
            )
        ),
        '[]'::json
    )
    INTO burns_surgery_elective_json
    FROM burns_surgery_elective e
    LEFT JOIN lkp_burns_surgery_elective se ON se.id = e.surgery_elective
    WHERE e.burns_id IN (
        SELECT id FROM burns WHERE triage_id = triage_id_input
    );

    -- 5) BURNS_OUTCOME
    SELECT json_build_object(
        'id', o.id,
        'outcome', oc.name,
        'discharge_date', to_char(o.discharge_date, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_date', to_char(o.absconded_date, 'DD-Mon-YYYY HH12:MI AM'),
        'death_date', to_char(o.death_date, 'DD-Mon-YYYY HH12:MI AM'),
        'causeofdeath', o.causeofdeath,
        'transferred_to', tt.name,
        'ward_datetime', to_char(o.ward_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'ward_name', o.ward_name,
        'icu_datetime', to_char(o.icu_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
		'destination_taei_hospital', dh.hospitalname,
        'reason_for_referral', rr.name,
        'condition_of_patient', cp.name,
        'referring_doctor_name', o.referring_doctor_name,
        'documented_taei_sheet', o.documented_taei_sheet,
        'patient_exit_date', to_char(o.patient_exit_date, 'DD-Mon-YYYY HH12:MI AM'),
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO burns_outcome_json
    FROM burns_outcome o
    LEFT JOIN lkp_burns_outcome oc ON oc.id = o.outcome
    LEFT JOIN lkp_burns_transferred_to tt ON tt.id = o.transferred_to
    LEFT JOIN lkp_hospital_type ht ON ht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient cp ON cp.id = o.condition_of_patient
    WHERE o.burns_id IN (SELECT id FROM burns WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- Combine all into JSON object
    RETURN json_build_object(
        'burns', burns_json,
        'burns_tbsa', burns_tbsa_json,
        'burns_values', burns_values_json,
        'burns_surgery_elective', burns_surgery_elective_json,
        'burns_outcome', burns_outcome_json
    );
END;
$BODY$;