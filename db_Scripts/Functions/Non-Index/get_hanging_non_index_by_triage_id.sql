-- FUNCTION: public.get_hanging_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_hanging_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_hanging_non_index_by_triage_id(
	triage_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    hanging_json JSON;
    hanging_outcome_json JSON;
BEGIN
    SELECT json_build_object(
        'id', h.id,
        'triage_id', h.triage_id,
        'date_time_of_entry', to_char(h.date_time_of_entry, 'DD-Mon-YYYY HH12:MI AM'),
        'patient_admitted', CASE WHEN h.patient_admitted THEN 'Yes' ELSE 'No' END,
        'name_of_dept', h.name_of_dept,
        'date_of_admit', to_char(h.date_of_admit, 'DD-Mon-YYYY HH12:MI AM'),
        'nature_of_incident', ni.name,
        'suspension_of_body', sb.name,
        'materials_used_for_hanging', mu.name,
        'symptoms_at_presentation', (
            SELECT string_agg(sp.name, ', ')
            FROM lkp_hanging_symptoms_presentation sp
            WHERE sp.id = ANY(h.symptoms_at_presentation)
        ),
        'interventions', i.name,
        'oth_interventions', h.oth_interventions,
        'supportive_care_provided', scp.name,
        'oth_supportive_care_provided', h.oth_supportive_care_provided,
        'is_counselling_provided', CASE WHEN h.is_counselling_provided THEN 'Yes' ELSE 'No' END,
        'duration_of_hospital_stay', h.duration_of_hospital_stay,
        'user_id', h.user_id,
        'inserted_date', to_char(h.inserted_date, 'DD-Mon-YYYY HH12:MI AM'),
        'ref_form_id', h.ref_form_id,
        'ref_id', h.ref_id
    )
    INTO hanging_json
    FROM hanging h
    LEFT JOIN lkp_hanging_nature_of_incident ni ON ni.id = h.nature_of_incident
    LEFT JOIN lkp_hanging_suspension_of_body sb ON sb.id = h.suspension_of_body
    LEFT JOIN lkp_hanging_materials_used mu ON mu.id = h.materials_used_for_hanging
    LEFT JOIN lkp_hanging_interventions i ON i.id = h.interventions
    LEFT JOIN lkp_hanging_supportive_care_provided scp ON scp.id = h.supportive_care_provided
    WHERE h.triage_id = triage_id_input
    LIMIT 1;

    SELECT json_build_object(
        'id', o.id,
        'outcome', ho.name,
        'discharge_date', to_char(o.discharge_date, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_date', to_char(o.absconded_date, 'DD-Mon-YYYY HH12:MI AM'),
        'death_date', to_char(o.death_date, 'DD-Mon-YYYY HH12:MI AM'),
        'cause_of_death', o.cause_of_death,
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
		'destination_taei_hospital', dh.hospitalname,
        'reason_for_referral', rr.name,
        'condition_of_patient', cp.name,
        'referring_doctor', o.referring_doctor,
        'documented_taei_sheet', CASE WHEN o.documented_taei_sheet THEN 'Yes' ELSE 'No' END,
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO hanging_outcome_json
    FROM hanging_outcome o
    LEFT JOIN lkp_hanging_outcome ho ON ho.id = o.outcome
    LEFT JOIN lkp_hospital_type ht ON ht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient cp ON cp.id = o.condition_of_patient
    WHERE o.hanging_id IN (
        SELECT id FROM hanging WHERE triage_id = triage_id_input
    )
    LIMIT 1;

    RETURN json_build_object(
        'hanging', hanging_json,
        'outcome', hanging_outcome_json
    );

END;
$BODY$;
