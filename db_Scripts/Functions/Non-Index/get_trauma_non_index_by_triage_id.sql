-- FUNCTION: public.get_trauma_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_trauma_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_trauma_non_index_by_triage_id(
	triage_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    trauma_json JSON;
    trauma_values_json JSON;
    trauma_final_json JSON;
    trauma_outcome_json JSON;
BEGIN
    -- 1) TRAUMA main table
    SELECT json_build_object(
        'id', t.id,
        'triage_id', t.triage_id,
        'patient_admitted', t.patient_admitted,
        'name_of_dept', t.name_of_dept,
        'date_time_of_entry', to_char(t.date_time_of_entry, 'DD-Mon-YYYY HH12:MI AM'),
        'mechanism_of_injury', mi.name,
        'type_of_injury', ti.name,
        'oth_type_of_injury', t.oth_type_of_injury,
        'rta', rta.name,
        'rta_helmet', t.rta_helmet,
		'rta_seatbelt', t.rta_seatbelt,
        'ikt_availed', t.ikt_availed,
        'assault', ass.name,
        'workspot_injury', wi.name,
        'injuries_identified', (
            SELECT string_agg(li.name, ', ')
            FROM lkp_trauma_injuries_identified li
            WHERE li.id = ANY(t.injuries_identified)
        ),
        'oth_injuries_identified', t.oth_injuries_identified,
        'part_of_the_body_injured', (
            SELECT string_agg(pb.name, ', ')
            FROM lkp_trauma_part_of_the_body_injured pb
            WHERE pb.id = ANY(t.part_of_the_body_injured)
        ),
        'oth_body_injured', t.oth_body_injured,
        'gcs_eye', ge.name,
        'gcs_verbal', gv.name,
        'gcs_motor', gm.name,
        'gcs_total', t.gcs_total,
        'user_id', t.user_id,
        'inserted_date', to_char(t.inserted_date, 'DD-Mon-YYYY HH12:MI AM')
    )
    INTO trauma_json
    FROM trauma t
    LEFT JOIN lkp_trauma_mechanism_of_injury mi ON mi.id = t.mechanism_of_injury
    LEFT JOIN lkp_trauma_type_of_injury ti ON ti.id = t.type_of_injury
    LEFT JOIN lkp_trauma_rta rta ON rta.id = t.rta
    LEFT JOIN lkp_trauma_assault ass ON ass.id = t.assault
    LEFT JOIN lkp_trauma_workspot_injury wi ON wi.id = t.workspot_injury
    LEFT JOIN lkp_trauma_gcs_eye ge ON ge.id = t.gcs_eye
    LEFT JOIN lkp_trauma_gcs_verbal gv ON gv.id = t.gcs_verbal
    LEFT JOIN lkp_trauma_gcs_motor gm ON gm.id = t.gcs_motor
    WHERE t.triage_id = triage_id_input
    LIMIT 1;

    -- 2) TRAUMA_VALUES
    SELECT json_build_object(
        'id', v.id,
        'bp_systolic', v.bp_systolic,
        'bp_diastolic', v.bp_diastolic,
        'rr', v.rr,
        'rts_autogenerate', v.rts_autogenerate,
        'trauma_flag', tf.name,
        'admitted', v.admitted,
        'ecg', v.ecg,
        'ecgfindings', v.ecgfindings,
        'xray', v.xray,
        'xray_date_time', to_char(v.xray_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'xrayfindings', v.xrayfindings,
        'efast', v.efast,
        'efast_date_time', to_char(v.efast_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'efastfindings', v.efastfindings,
        'ct', v.ct,
        'ct_date_time', to_char(v.ct_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'ctfindings', v.ctfindings,
        'mri', v.mri,
        'mri_date_time', to_char(v.mri_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'mrifindings', v.mrifindings,
        'abg', v.abg,
        'abg_date_time', to_char(v.abg_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'abgfindings', v.abgfindings,
        'blood_investigation', v.blood_investigation,
        'blood_date_time', to_char(v.blood_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'hcg', v.hcg,
        'hcg_date_time', to_char(v.hcg_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'urine_test', v.urine_test,
        'urine_date_time', to_char(v.urine_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'oth_specify', v.oth_specify,
        'oth_date_time', to_char(v.oth_date_time, 'DD-Mon-YYYY HH12:MI AM')
    )
    INTO trauma_values_json
    FROM trauma_values v
    LEFT JOIN lkp_trauma_flag tf ON tf.id = v.trauma_flag
    WHERE v.trauma_id IN (SELECT id FROM trauma WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- 3) TRAUMA_FINAL
    SELECT json_build_object(
        'id', f.id,
        'speciality_opinion', (
            SELECT string_agg(sp.name, ', ')
            FROM lkp_trauma_speciality_opinion sp
            WHERE sp.id = ANY(f.speciality_opinion)
        ),
        'iscpr', f.iscpr,
        'cpr_done', cpr.name,
        'blood_transfusion_done', f.blood_transfusion_done,
        'on_arrival_nerve_blocks', f.on_arrival_nerve_blocks,
        'mech_intubation', f.mech_intubation,
        'mech_intubation_dtls', mid.name,
        'first_pass_intubation', f.first_pass_intubation,
        'other_procedure_done', opd.name,
        'oth_procedure_done', f.oth_procedure_done,
        'final_diagnosis', f.final_diagnosis,
        'management', mg.name,
        'type_of_surgery', tos.name,
        'surgery_type', st.name,
        'surgery_name', f.surgery_name,
        'date_time', to_char(f.date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'surgery_takenup_from_incident_date', f.surgery_takenup_from_incident_date,
        'surgery_takenup_from_triage_date', f.surgery_takenup_from_triage_date,
        'name_of_surgery', f.name_of_surgery,
        'surgery_done_under', sdu.name,
        'surgery_done_by', f.surgery_done_by,
        'rehabilitation_required', f.rehabilitation_required
    )
    INTO trauma_final_json
    FROM trauma_final f
    LEFT JOIN lkp_trauma_cpr cpr ON cpr.id = f.cpr_done
    LEFT JOIN lkp_trauma_mech_intubation_dtls mid ON mid.id = f.mech_intubation_dtls
    LEFT JOIN lkp_trauma_oth_procedure_done opd ON opd.id = f.other_procedure_done
    LEFT JOIN lkp_trauma_management mg ON mg.id = f.management
    LEFT JOIN lkp_trauma_type_of_surgery tos ON tos.id = f.type_of_surgery
    LEFT JOIN lkp_trauma_surgery_type st ON st.id = f.surgery_type
    LEFT JOIN lkp_trauma_surgery_done_under sdu ON sdu.id = f.surgery_done_under
    WHERE f.trauma_id IN (SELECT id FROM trauma WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- 4) TRAUMA_OUTCOME
    SELECT json_build_object(
        'id', o.id,
        'outcome', oc.name,
        'discharge_datetime', to_char(o.discharge_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'discharge_details', o.discharge_details,
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
		'destination_taei_hospital', dh.hospitalname,
        'reason_for_referral', rr.name,
        'condition_of_patient', cp.name,
        'referring_doctor_name', o.referring_doctor_name,
        'taei_case_documented', o.taei_case_documented,
        'name_of_doctor', o.name_of_doctor,
        'stayed_duration', o.stayed_duration,
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO trauma_outcome_json
    FROM trauma_outcome o
    LEFT JOIN lkp_trauma_outcome oc ON oc.id = o.outcome
    LEFT JOIN lkp_trauma_hospital_type ht ON ht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_trauma_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_trauma_condition_of_patient cp ON cp.id = o.condition_of_patient
    WHERE o.trauma_id IN (SELECT id FROM trauma WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- Combine all results into JSON arrays
    RETURN json_build_object(
        'trauma', trauma_json,
        'trauma_values', trauma_values_json,
        'trauma_final', trauma_final_json,
        'trauma_outcome', trauma_outcome_json
    );
END;
$BODY$;
