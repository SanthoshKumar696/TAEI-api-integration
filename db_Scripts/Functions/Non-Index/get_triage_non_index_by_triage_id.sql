-- FUNCTION: public.get_triage_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_triage_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_triage_non_index_by_triage_id(
	p_triage_id integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'triage', json_build_object(
            'id', t.id,
            'date_time_of_triage', to_char(t.date_time_of_triage, 'DD-Mon-YYYY HH12:MI AM'),
            'type_of_patient', CASE WHEN t.type_of_patient THEN 'Yes' ELSE 'No' END,
            'name_of_patient', t.name_of_patient,
            'age_year', t.age_year,
            'age_month', t.age_month,
            'fathername', t.fathername,
            'mothername', t.mothername,
            'gender', lg.name,
            'marital_status', lm.name,
            'patient_mobile_number', t.patient_mobile_number,
            'education', le.name,
            'employment_status', les.name,
            'occupation', lo.name,
            'income', t.income,
            'patient_ehr_id', CASE WHEN t.patient_ehr_id THEN 'Yes' ELSE 'No' END,
            'cmchis_card', t.cmchis_card,
            'abha_card', t.abha_card,
            'phr_id', t.phr_id,
            'hmis_id', t.hmis_id,
			'esi_card', t.esi_card,
            'address_line', t.address_line,
            'district', ld.name,
            'state', ls.name,
            'pincode', t.pincode,
            'patienr_recieved_from', lprf.name,
            'oth_patienr_recieved_from', t.oth_patienr_recieved_from,
            'mode_of_arrival', lmoa.name,
            'scene_ift', lsi.name,
            'source_type', lst.name,
            'source_hospital', t.source_hospital,
            'destination_hospital', t.destination_hospital,
            'reason_for_referral', lrr.name,
            'oth_reason_for_referral', t.oth_reason_for_referral,
            'referral_doctor_name', t.referral_doctor_name,
            'condition_of_patient', lcp.name,
            'is_patient_stable_ift', lps.name,
            'date_and_time_of_incident', to_char(t.date_and_time_of_incident, 'DD-Mon-YYYY HH12:MI AM'),
            'place_of_incident', lpi.name,
            'oth_place_of_incident', t.oth_place_of_incident,
            'user_id', (SELECT username FROM public.auth_users WHERE id = t.user_id LIMIT 1),
            'inserted_date', to_char(t.inserted_date, 'DD-Mon-YYYY HH12:MI AM')
        ),
        'triage_by_108', (
		    SELECT json_build_object(
		        'id', tb108.id,
		        'call_id', tb108.call_id,
		        'district_name', tb108.district_name,
		        'taluk', tb108.taluk,
		        'city_name', tb108.city_name,
		        'base_location', tb108.base_location,
		        'vehicle_number', tb108.vehicle_number,
		        'vehicle_assigned_date_time', to_char(tb108.vehicle_assigned_date_time, 'DD-Mon-YYYY HH12:MI AM'),
		        'chief_complaint', tb108.chief_complaint,
		        'emergency_type', tb108.emergency_type,
		        'emergency_sub_type', tb108.emergency_sub_type,
		        'temperature', tb108.temperature,
		        'pulse', tb108.pulse,
		        'rr', tb108.rr,
		        'bp_sbp', tb108.bp_sbp,
		        'bp_dbp', tb108.bp_dbp,
		        'pupil_right', tb108.pupil_right,
		        'pupil_left', tb108.pupil_left,
		        'loc', tb108.loc,
		        'condition_of_patient', tb108.condition_of_patient,
		        'is_out_ar_mlc_number', CASE WHEN tb108.is_out_ar_mlc_number THEN 'Yes' ELSE 'No' END,
		        'out_ar_mlc_number_tx', tb108.out_ar_mlc_number_tx
		    )
		    FROM triage_by_108 tb108
		    WHERE tb108.triage_id = t.id
		),
        'triage_dtls', (
            SELECT json_build_object(
                'id', td.id,
                'accompanied_by', lab.name,
                'pc_medical_emergency', (
                    SELECT string_agg(lpme.name, ', ')
                    FROM lkp_triage_dtls_pc_medical_emergency lpme
                    WHERE lpme.id = ANY(td.pc_medical_emergency)
                ),
                'oth_pc_medical_emergency', td.oth_pc_medical_emergency,
                'pc_surgical_emergency', lpsurg.name,
                'oth_pc_surgical_emergency', td.oth_pc_surgical_emergency,
                'presenting_complaints_prem', (
                    SELECT string_agg(lpc.name, ', ')
                    FROM lkp_triage_dtls_presenting_complaints lpc
                    WHERE lpc.id = ANY(td.presenting_complaints_prem)
                ),
                'mass_casuality', CASE WHEN td.mass_casuality THEN 'Yes' ELSE 'No' END,
                'mass_casuality_tx', td.mass_casuality_tx,
                'cause', lc.name,
                'avpu', lav.name,
                'pulse', td.pulse,
                'bp_systolic', td.bp_systolic,
                'bp_diastolic', td.bp_diastolic,
                'spo2', td.spo2,
                'temperature', td.temperature,
                'brought_dead', CASE WHEN td.brought_dead THEN 'Yes' ELSE 'No' END,
                'triage_flag', ltf.name,
                'if_red_team_call_out', CASE WHEN td.if_red_team_call_out THEN 'Yes' ELSE 'No' END,
                'is_patient_triaged_queue', CASE WHEN td.is_patient_triaged_queue THEN 'Yes' ELSE 'No' END,
                'prem_op_ticket_docs', CASE WHEN td.prem_op_ticket_docs THEN 'Yes' ELSE 'No' END,
                'triage_done_by', td.triage_done_by,
                'work_spot_injury', wsi.name,
                'rta', rta.name,
                'rta_helmet', CASE WHEN td.rta_helmet THEN 'Yes' ELSE 'No' END,
                'rta_rider_type', rrt.name
            )
            FROM triage_dtls td
            LEFT JOIN lkp_triage_dtls_accompanied_by lab ON td.accompanied_by = lab.id
            LEFT JOIN lkp_triage_dtls_pc_surgical_emergency lpsurg ON td.pc_surgical_emergency = lpsurg.id
            LEFT JOIN lkp_triage_dtls_cause lc ON td.cause = lc.id
            LEFT JOIN lkp_triage_dtls_avpu lav ON td.avpu = lav.id
            LEFT JOIN lkp_triage_dtls_triage_flag ltf ON td.triage_flag = ltf.id

            LEFT JOIN lkp_triage_dtls_work_spot_injury wsi ON td.work_spot_injury = wsi.id
            LEFT JOIN lkp_triage_dtls_rta rta ON td.rta = rta.id
            LEFT JOIN lkp_triage_dtls_rta_rider_type rrt ON td.rta_rider_type = rrt.id
            WHERE td.triage_id = t.id
        )
    )
    INTO result
    FROM triage t
    LEFT JOIN lkp_triage_gender lg ON t.gender = lg.id
    LEFT JOIN lkp_triage_marital_status lm ON t.marital_status = lm.id
    LEFT JOIN lkp_triage_education le ON t.education = le.id
    LEFT JOIN lkp_triage_employment_status les ON t.employment_status = les.id
    LEFT JOIN lkp_triage_occupation lo ON t.occupation = lo.id
    LEFT JOIN lkp_district ld ON t.district = ld.id
    LEFT JOIN lkp_state ls ON t.state = ls.id
    LEFT JOIN lkp_triage_patienr_recieved_from lprf ON t.patienr_recieved_from = lprf.id
    LEFT JOIN lkp_triage_mode_of_arrival lmoa ON t.mode_of_arrival = lmoa.id
    LEFT JOIN lkp_triage_scene_ift lsi ON t.scene_ift = lsi.id
    LEFT JOIN lkp_triage_source_type lst ON t.source_type = lst.id
    LEFT JOIN lkp_triage_reason_for_referral lrr ON t.reason_for_referral = lrr.id
    LEFT JOIN lkp_triage_condition_of_patient lcp ON t.condition_of_patient = lcp.id
    LEFT JOIN lkp_triage_patient_stable lps ON t.is_patient_stable_ift = lps.id
    LEFT JOIN lkp_triage_place_of_incident lpi ON t.place_of_incident = lpi.id
    WHERE t.id = p_triage_id;

    RETURN result;
END;
$BODY$;