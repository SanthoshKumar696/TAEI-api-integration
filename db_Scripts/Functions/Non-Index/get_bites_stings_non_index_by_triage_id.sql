-- FUNCTION: public.get_bites_stings_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_bites_stings_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_bites_stings_non_index_by_triage_id(
	triage_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    bites_stings_json JSON;
    bites_stings_outcome_json JSON;
BEGIN
    --------------------------------------------------------------------
    -- 1. Main Bites/Stings Data
    --------------------------------------------------------------------
    SELECT json_build_object(
        'id', b.id,
        'triage_id', b.triage_id,
        'date_time_of_entry', to_char(b.date_time_of_entry, 'DD-Mon-YYYY HH12:MI AM'),
        'patient_admitted', CASE WHEN b.patient_admitted THEN 'Yes' ELSE 'No' END,
        'name_of_dept', b.name_of_dept,
        'date_of_admit', to_char(b.date_of_admit, 'DD-Mon-YYYY HH12:MI AM'),
        'type_of_bite_sting', tbs.name,
        'type_of_organism', to_org.name,
        'venomous_type', vt.name,
        'oth_venomous_type', b.oth_venomous_type,
        'site_of_bite_sting', sbs.name,
        'symptoms_at_presentation', (
            SELECT string_agg(sp.name, ', ')
            FROM lkp_bite_symptoms_presentation sp
            WHERE sp.id = ANY(b.symptoms_at_presentation)
        ),
        'time_to_reach_after_bite_sting', b.time_to_reach_after_bite_sting,
        'time_interval', ti.name,
        'signs_of_envenomation_allergic_reaction', b.signs_of_envenomation_allergic_reaction,
        'investigations_performed', b.investigations_performed,
        'first_aid_given', CASE WHEN b.first_aid_given = 1 THEN 'Yes' ELSE 'No' END,
        'anti_venom_or_allergy_treatment_name', b.anti_venom_or_allergy_treatment_name,
        'anti_venom_or_allergy_treatment_dosage', b.anti_venom_or_allergy_treatment_dosage,
        'anti_venom_or_allergy_treatment_timing', b.anti_venom_or_allergy_treatment_timing,
        'supportive_care_provided', scp.name,
        'counselling_provided_before_discharge', CASE WHEN b.counselling_provided_before_discharge = 1 THEN 'Yes' ELSE 'No' END,
        'duration_of_hospital_stay', b.duration_of_hospital_stay,
        'user_id', b.user_id,
        'inserted_date', to_char(b.inserted_date, 'DD-Mon-YYYY HH12:MI AM'),
        'ref_form_id', b.ref_form_id,
        'ref_id', b.ref_id
    )
    INTO bites_stings_json
    FROM bites_stings b
    LEFT JOIN lkp_bite_type_of_bite_sting tbs ON tbs.id = b.type_of_bite_sting
    LEFT JOIN lkp_bite_type_of_organism to_org ON to_org.id = b.type_of_organism
    LEFT JOIN lkp_bite_venomous_type vt ON vt.id = b.venomous_type
    LEFT JOIN lkp_bite_site_of_bite_sting sbs ON sbs.id = b.site_of_bite_sting
    LEFT JOIN lkp_bite_time_interval ti ON ti.id = b.time_interval
    LEFT JOIN lkp_bite_supportive_care_provided scp ON scp.id = b.supportive_care_provided
    WHERE b.triage_id = triage_id_input
    LIMIT 1;

    --------------------------------------------------------------------
    -- 2. Outcome Data
    --------------------------------------------------------------------
    SELECT json_build_object(
        'id', o.id,
        'outcome', bo.name,
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
        'patient_exit_date', to_char(o.patient_exit_date, 'DD-Mon-YYYY HH12:MI AM'),
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO bites_stings_outcome_json
    FROM bites_stings_outcome o
    LEFT JOIN lkp_bite_outcome bo ON bo.id = o.outcome
    LEFT JOIN lkp_hospital_type ht ON ht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient cp ON cp.id = o.condition_of_patient
    WHERE o.bites_stings_id IN (SELECT id FROM bites_stings WHERE triage_id = triage_id_input)
    LIMIT 1;

    --------------------------------------------------------------------
    -- 3. Combine both sections
    --------------------------------------------------------------------
    RETURN json_build_object(
        'bites_stings', bites_stings_json,
        'outcome', bites_stings_outcome_json
    );

END;
$BODY$;
