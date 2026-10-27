CREATE OR REPLACE FUNCTION public.get_drowning_non_index_by_triage_id(
    triage_id_input INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
AS $BODY$
DECLARE
    drowning_json JSON;
    drowning_outcome_json JSON;
BEGIN

    --------------------------------------------------------------------
    -- 1. Main Drowning Case Details
    --------------------------------------------------------------------
    SELECT json_build_object(
        'id', d.id,
        'triage_id', d.triage_id,
        'date_time_entry', to_char(d.date_time_entry, 'DD-Mon-YYYY HH12:MI AM'),

        -- Admission Info
        'patient_admitted', yn1.name,
        'admitting_department', d.admitting_department,
        'admission_datetime', to_char(d.admission_datetime, 'DD-Mon-YYYY HH12:MI AM'),

        -- Drowning Details
        'place_of_incident', poi.name,
        'other_place', d.other_place,

        'type_of_water', tow.name,
        'other_type_of_water', d.other_type_water,

        'activity_during_drowning', act.name,
        'other_activity', d.other_activity,

        -- Assessment
        'assessment', assess.name,

        -- Interventions
        'intervention', intr.name,
        'other_interventions', d.other_interventions,

        -- Supportive Care
        'supportive_care', d.supportive_care,
        'other_supportive_care', d.other_supportive_care,

        -- Complications at Admission
        'complications_admission', d.complications_admission,
        'other_complication_admitted', d.other_complication_admitted,

        -- Complications Developed Later
        'complications_developed', d.complications_developed,
        'other_complications_developed', d.other_complications_developed,

        -- Counselling Before Discharge
        'counselling_before_discharge', yn2.name,

        -- Discharge Info
        'discharge_datetime', to_char(d.discharge_datetime, 'DD-Mon-YYYY HH12:MI AM'),

        -- Hospital Stay
        'duration_of_hospital_stay', d.duration_of_hospital_stay

    )
    INTO drowning_json
    FROM drowning_cases d
    LEFT JOIN lkp_drw_yes_no yn1 ON yn1.id = d.patient_admitted_id
    LEFT JOIN lkp_drw_place_of_incident poi ON poi.id = d.place_of_incident_id
    LEFT JOIN lkp_drw_type_of_water tow ON tow.id = d.type_of_water_id
    LEFT JOIN lkp_drw_activity_during_drowning act ON act.id = d.activity_during_drowning_id
    LEFT JOIN lkp_drw_assessment assess ON assess.id = d.assessment_id
    LEFT JOIN lkp_drw_interventions intr ON intr.id = d.intervention_id
    LEFT JOIN lkp_drw_yes_no yn2 ON yn2.id = d.counselling_before_discharge_id
    WHERE d.triage_id = triage_id_input
    LIMIT 1;



    --------------------------------------------------------------------
    -- 2. Drowning Outcome Details
    --------------------------------------------------------------------
    SELECT json_build_object(
        'id', o.id,
        'outcome_type', ot.name,
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END,
        'discharge_datetime', to_char(o.discharge_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_datetime', to_char(o.absconded_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'death_datetime', to_char(o.death_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'cause_of_death', o.cause_of_death,

        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
        'referral_reason', rr.name,
        'other_reason_referral', o.other_reason_referral,

        'patient_condition', pc.name,
        'referring_doctor', o.referring_doctor,
        'documented_in_taei_case_sheet',
            CASE WHEN o.documented_in_taei_case_sheet THEN 'Yes' ELSE 'No' END,

        'created_at', to_char(o.created_at, 'DD-Mon-YYYY HH12:MI AM'),
        'updated_at', to_char(o.updated_at, 'DD-Mon-YYYY HH12:MI AM')
    )
    INTO drowning_outcome_json
    FROM drowning_outcome o
    LEFT JOIN lkp_drowning_outcome_type ot ON ot.id = o.outcome_type_id
    LEFT JOIN lkp_drowning_hospital_type ht ON ht.id = o.hospital_type_id
    LEFT JOIN lkp_drowning_referral_reason rr ON rr.id = o.referral_reason_id
    LEFT JOIN lkp_drowning_patient_condition pc ON pc.id = o.patient_condition_id
    WHERE o.triage_id = triage_id_input
    LIMIT 1;

    --------------------------------------------------------------------
    -- 3. Return Final Combined JSON
    --------------------------------------------------------------------
    RETURN json_build_object(
        'drowning', json_build_object(
            'case_details', drowning_json,
            'outcome', drowning_outcome_json
        )
    );

END;
$BODY$;
