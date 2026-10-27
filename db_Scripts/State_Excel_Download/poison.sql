-- FUNCTION: public.get_state_taei_full_triage_emo_export(timestamp without time zone, timestamp without time zone, integer)

-- DROP FUNCTION IF EXISTS public.get_state_taei_full_triage_emo_export(timestamp without time zone, timestamp without time zone, integer);

CREATE OR REPLACE FUNCTION public.get_state_taei_full_poison_export(
	p_from timestamp without time zone,
	p_to timestamp without time zone,
	hospital_id integer DEFAULT 0)
    RETURNS TABLE(triage_id integer, date_time_of_triage timestamp without time zone, type_of_patient boolean, pillar text, name_of_patient character varying, age_year integer, age_month integer, fathername character varying, mothername character varying, patient_mobile_number character varying, income character varying, patient_ehr_id boolean, cmchis_card character varying, abha_card character varying, phr_id character varying, hmis_id character varying, esi_card character varying, address_line character varying, district_name character varying, state integer, pincode character varying, patienr_recieved_from integer, oth_patienr_recieved_from character varying, mode_of_arrival integer, scene_ift integer, source_type integer, source_hospital character varying, destination_hospital character varying, reason_for_referral integer, oth_reason_for_referral character varying, referral_doctor_name character varying, condition_of_patient integer, is_patient_stable_ift integer, date_and_time_of_incident timestamp without time zone, place_of_incident_name character varying, oth_place_of_incident character varying, institution_id integer, user_id integer, inserted_date timestamp without time zone, gender_name character varying, marital_status_name character varying, education_name character varying, employment_status_name character varying, occupation_name character varying, mode_of_arrival_name character varying, reason_for_referral_name character varying, condition_of_patient_name character varying, source_type_name character varying, scene_ift_name character varying, triage_accompanied_by_name character varying, triage_avpu_name character varying, triage_flag_name character varying, pc_medical_emergency text, oth_pc_medical_emergency character varying, pc_surgical_emergency character varying, oth_pc_surgical_emergency character varying, presenting_complaints_prem text, mass_casuality text, mass_casuality_tx integer, pulse integer, bp_systolic integer, bp_diastolic integer, spo2 integer, temperature numeric, brought_dead text, if_red_team_call_out text, is_patient_triaged_queue text, prem_op_ticket_docs text, triage_done_by character varying, work_spot_injury character varying, rta character varying, rta_helmet text, rta_rider_type character varying, hospital_name character varying, hospital_type_name character varying, emo_past_history integer[], emo_diagnosis character varying, emo_emergency_category integer, emo_oth_emergency_category character varying, emo_is_patient_smells_alcohol boolean, emo_is_alcohol_consumption boolean, emo_is_drunken_drive_history boolean, emo_time_of_examination timestamp without time zone, emo_memory integer, emo_self_control integer, emo_is_smell_in_breath boolean, emo_is_urine_alchol_concentration boolean, emo_speech integer, emo_general_disposition integer, emo_clothing integer, emo_reaction_time integer, emo_orientation_time integer, emo_is_drug_abuse boolean, emo_is_mlc boolean, emo_ar_number character varying, emo_mlc_date date, emo_mlc_time time without time zone, emo_pain_scale character varying, emo_pain_score character varying, emo_treatment_given character varying, emo_trauma_treatment integer, emo_name_of_the_emo character varying, emo_emergency_category_name character varying, emo_memory_name character varying, emo_self_control_name character varying, emo_speech_name character varying, emo_general_disposition_name character varying, emo_clothing_name character varying, emo_reaction_time_name character varying, emo_orientation_time_name character varying, emo_trauma_treatment_name character varying, emo_outcome integer, emo_outcome_datetime timestamp without time zone, emo_sent_to character varying, emo_outcome_hospital_type integer, emo_destination_hospital character varying, emo_destination_taei_hospital character varying, emo_reason_for_referral character varying, emo_condition_of_patient character varying, emo_referring_doctor_name character varying, emo_outcome_name character varying
				 , poi_poison_id integer, poi_triage_id integer, poi_date_time_of_entry text, poi_patient_admitted text, poi_name_of_dept character varying, poi_date_of_admit text, poi_type_of_poisoning_id integer, poi_type_of_poisoning_name character varying, poi_route_of_exposure_id integer, poi_route_of_exposure_name character varying, poi_substance_involved_id integer, poi_substance_involved_name character varying, poi_substance_involved_sub_id integer, poi_substance_involved_sub_name character varying, poi_oth_substance_involved character varying, poi_brand_or_product_name character varying, poi_quantity character varying, poi_source_of_substance_id integer, poi_source_of_substance_name character varying, poi_symptoms_at_presentation text, poi_time_of_onset_of_symptoms text, poi_time_elapsed_exposure_symptom character varying, poi_investigations_performed character varying, poi_severity_of_poisoning_id integer, poi_severity_of_poisoning_name character varying, poi_decontamination text, poi_antidote_administered_name character varying, poi_antidote_administered_dosage character varying, poi_antidote_administered_timing text, poi_supportive_care_provided text, poi_no_of_cycles_performed integer, poi_counselling_provided text, poi_duration_of_hospital_stay integer, poi_inserted_date text, poi_outcome_id integer, poi_outcome_type_id integer, poi_outcome_type_name character varying, poi_discharge_date text, poi_absconded_date text, poi_death_date text, poi_cause_of_death character varying, poi_hospital_type_id integer, poi_hospital_type_name character varying, poi_destination_hospital character varying, poi_destination_taei_hospital_id integer, poi_destination_taei_hospital_name character varying, poi_reason_for_referral_id integer, poi_reason_for_referral_name character varying, poi_oth_reason_for_referral character varying, poi_condition_of_patient_id integer, poi_condition_of_patient_name character varying, poi_referring_doctor character varying, poi_documented_taei_sheet text, poi_patient_exit_date text
				 ) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        tr.id AS triage_id,
        tr.date_time_of_triage,
        tr.type_of_patient,

        'EMO' AS pillar,

        tr.name_of_patient,
        tr.age_year,
        tr.age_month,
        tr.fathername,
        tr.mothername,
        tr.patient_mobile_number,
        tr.income,
        tr.patient_ehr_id,
        tr.cmchis_card,
        tr.abha_card,
        tr.phr_id,
        tr.hmis_id,
        tr.esi_card,
        tr.address_line,
        h.DistrictName AS district_name,
        tr.state,
        tr.pincode,
        tr.patienr_recieved_from,
        tr.oth_patienr_recieved_from,
        tr.mode_of_arrival,
        tr.scene_ift,
        tr.source_type,
        tr.source_hospital,
        tr.destination_hospital,
        tr.reason_for_referral,
        tr.oth_reason_for_referral,
        tr.referral_doctor_name,
        tr.condition_of_patient,
        tr.is_patient_stable_ift,
        tr.date_and_time_of_incident,
        place.name AS place_of_incident_name,
        tr.oth_place_of_incident,
        tr.institution_id,
        tr.user_id,
        tr.inserted_date,

        -- LOOKUPS
        g.name AS gender_name,
        ms.name AS marital_status_name,
        edu.name AS education_name,
        emp.name AS employment_status_name,
        occ.name AS occupation_name,
        moa.name AS mode_of_arrival_name,
        reason.name AS reason_for_referral_name,
        cond.name AS condition_of_patient_name,
        src.name AS source_type_name,
        scene.name AS scene_ift_name,

        triage_accomp.name AS triage_accompanied_by_name,
        triage_avpu.name AS triage_avpu_name,
        triage_flag.name AS triage_flag_name,

		--Triage Details
				
                (
                    SELECT string_agg(lpme.name, ', ')
                    FROM lkp_triage_dtls_pc_medical_emergency lpme
                    WHERE lpme.id = ANY(td.pc_medical_emergency)
                ) pc_medical_emergency,
                td.oth_pc_medical_emergency oth_pc_medical_emergency,
                lpsurg.name pc_surgical_emergency,
                td.oth_pc_surgical_emergency oth_pc_surgical_emergency,
                (
                    SELECT string_agg(lpc.name, ', ')
                    FROM lkp_triage_dtls_presenting_complaints lpc
                    WHERE lpc.id = ANY(td.presenting_complaints_prem)
                ) presenting_complaints_prem,
                CASE WHEN td.mass_casuality THEN 'Yes' ELSE 'No' END as mass_casuality,
                td.mass_casuality_tx as mass_casuality_tx,                
                td.pulse pulse,
                td.bp_systolic bp_systolic,
                td.bp_diastolic bp_diastolic,
                td.spo2 spo2,
                td.temperature temperature,
                CASE WHEN td.brought_dead THEN 'Yes' ELSE 'No' END brought_dead,
                CASE WHEN td.if_red_team_call_out THEN 'Yes' ELSE 'No' END if_red_team_call_out,
                CASE WHEN td.is_patient_triaged_queue THEN 'Yes' ELSE 'No' END is_patient_triaged_queue,
                CASE WHEN td.prem_op_ticket_docs THEN 'Yes' ELSE 'No' END prem_op_ticket_docs,
                td.triage_done_by triage_done_by,
                wsi.name work_spot_injury,
                rta.name rta,
                CASE WHEN td.rta_helmet THEN 'Yes' ELSE 'No' END rta_helmet,
                rrt.name rta_rider_type,
        -- HOSPITAL
        h.HospitalName AS hospital_name,
        
        ht.name AS hospital_type_name,
		-- EMO TRIAGE RAW FIELDS
		et.past_history AS emo_past_history,
		et.diagnosis AS emo_diagnosis,
		et.emergency_category AS emo_emergency_category,
		et.oth_emergency_category AS emo_oth_emergency_category,
		et.is_patient_smells_alcohol AS emo_is_patient_smells_alcohol,
		et.is_alcohol_consumption AS emo_is_alcohol_consumption,
		et.is_drunken_drive_history AS emo_is_drunken_drive_history,
		et.time_of_examination AS emo_time_of_examination,
		et.memory AS emo_memory,
		et.self_control AS emo_self_control,
		et.is_smell_in_breath AS emo_is_smell_in_breath,
		et.is_urine_alchol_concentration AS emo_is_urine_alchol_concentration,
		et.speech AS emo_speech,
		et.general_disposition AS emo_general_disposition,
		et.clothing AS emo_clothing,
		et.reaction_time AS emo_reaction_time,
		et.orientation_time AS emo_orientation_time,
		et.is_drug_abuse AS emo_is_drug_abuse,
		et.is_mlc AS emo_is_mlc,
		et.ar_number AS emo_ar_number,
		et.mlc_date AS emo_mlc_date,
		et.mlc_time AS emo_mlc_time,
		et.pain_scale AS emo_pain_scale,
		et.pain_score AS emo_pain_score,
		et.treatment_given AS emo_treatment_given,
		et.emo_trauma_treatment AS emo_trauma_treatment,
		et.name_of_the_emo AS emo_name_of_the_emo,

		-- EMO LOOKUP NAMES
		ec.name AS emo_emergency_category_name,
		mem.name AS emo_memory_name,
		sc.name AS emo_self_control_name,
		sp.name AS emo_speech_name,
		gd.name AS emo_general_disposition_name,
		cl.name AS emo_clothing_name,
		rt.name AS emo_reaction_time_name,
		ot.name AS emo_orientation_time_name,
		trt.name AS emo_trauma_treatment_name,

		-- EMO OUTCOME RAW
		et_out.outcome AS emo_outcome,
		et_out.outcome_datetime AS emo_outcome_datetime,
		et_out.sent_to AS emo_sent_to,
		et_out.hospital_type AS emo_outcome_hospital_type,
		et_out.destination_hospital AS emo_destination_hospital,
		lk_h.hospitalname AS emo_destination_taei_hospital,
		rea_fef.name AS emo_reason_for_referral,
		cop.name AS emo_condition_of_patient,
		et_out.referring_doctor_name AS emo_referring_doctor_name,

		-- EMO OUTCOME LOOKUP NAME
		eo.name AS emo_outcome_name,
		
		--poison start
		p.id,
        p.triage_id,
        to_char(p.date_time_of_entry, 'DD-Mon-YYYY HH12:MI AM'),
        CASE WHEN p.patient_admitted THEN 'Yes' ELSE 'No' END,
        p.name_of_dept,
        to_char(p.date_of_admit, 'DD-Mon-YYYY HH12:MI AM'),

        p.type_of_poisoning,
        tp.name,

        p.route_of_exposure,
        rexp.name,

        p.substance_involved,
        si.name,

        p.substance_involved_sub,
        sis.name,

        p.oth_substance_involved,
        p.brand_or_product_name,
        p.quantity,

        p.source_of_substance,
        ss.name,

        sp2.symptoms,
        to_char(p.time_of_onset_of_symptoms, 'DD-Mon-YYYY HH12:MI AM'),
        p.time_elapsed_exposure_symptom,
        p.investigations_performed,

        p.severity_of_poisoning,
        sev.name,

        dc.decontamination,

        p.antidote_administered_name,
        p.antidote_administered_dosage,
        to_char(p.antidote_administered_timing, 'DD-Mon-YYYY HH12:MI AM'),

        sc2.supportive_care,
        p.no_of_cycles_performed,
        CASE WHEN p.counselling_provided THEN 'Yes' ELSE 'No' END,
        p.duration_of_hospital_stay,
        to_char(p.inserted_date, 'DD-Mon-YYYY HH12:MI AM'),

        -- OUTCOME
        o.id,
        o.outcome,
        po.name,

        to_char(o.discharge_date, 'DD-Mon-YYYY HH12:MI AM'),
        to_char(o.absconded_date, 'DD-Mon-YYYY HH12:MI AM'),
        to_char(o.death_date, 'DD-Mon-YYYY HH12:MI AM'),
        o.cause_of_death,

        o.hospital_type,
        ht2.name,

        o.destination_hospital,
        o.destination_taei_hospital,
        dh.hospitalname,

        o.reason_for_referral,
        rr.name,
        o.oth_reason_for_referral,

        o.condition_of_patient,
        cp.name,

        o.referring_doctor,
        CASE WHEN o.documented_taei_sheet THEN 'Yes' ELSE 'No' END,
        to_char(o.patient_exit_date, 'DD-Mon-YYYY HH12:MI AM')
		--poinson end

FROM triage tr

-- --------------------------
-- TRIAGE LOOKUP JOINS (from Triage.sql)
-- --------------------------
LEFT JOIN lkp_triage_gender             g    ON g.id = tr.gender
LEFT JOIN lkp_triage_marital_status    ms    ON ms.id = tr.marital_status
LEFT JOIN lkp_triage_education        edu    ON edu.id = tr.education
LEFT JOIN lkp_triage_employment_status emp    ON emp.id = tr.employment_status
LEFT JOIN lkp_triage_occupation       occ    ON occ.id = tr.occupation
LEFT JOIN lkp_triage_mode_of_arrival  moa    ON moa.id = tr.mode_of_arrival
LEFT JOIN lkp_triage_place_of_incident place  ON place.id = tr.place_of_incident
LEFT JOIN lkp_triage_reason_for_referral reason ON reason.id = tr.reason_for_referral
LEFT JOIN lkp_triage_condition_of_patient cond   ON cond.id = tr.condition_of_patient
LEFT JOIN lkp_triage_source_type      src    ON src.id = tr.source_type
LEFT JOIN lkp_triage_scene_ift        scene  ON scene.id = tr.scene_ift

-- triage_dtls lookups
LEFT JOIN triage_dtls td ON td.triage_id = tr.id
LEFT JOIN lkp_triage_dtls_accompanied_by triage_accomp ON triage_accomp.id = td.accompanied_by
LEFT JOIN lkp_triage_dtls_avpu triage_avpu ON triage_avpu.id = td.avpu
LEFT JOIN lkp_triage_dtls_triage_flag triage_flag ON triage_flag.id = td.triage_flag

LEFT JOIN lkp_triage_dtls_pc_surgical_emergency lpsurg ON td.pc_surgical_emergency = lpsurg.id
LEFT JOIN lkp_triage_dtls_cause lc ON td.cause = lc.id
LEFT JOIN lkp_triage_dtls_work_spot_injury wsi ON td.work_spot_injury = wsi.id
LEFT JOIN lkp_triage_dtls_rta rta ON td.rta = rta.id
LEFT JOIN lkp_triage_dtls_rta_rider_type rrt ON td.rta_rider_type = rrt.id

-- --------------------------
-- HOSPITAL
-- --------------------------
LEFT JOIN lkp_hospitals h ON h.HospitalId = tr.institution_id  -- hospital names from Common.sql. :contentReference[oaicite:7]{index=7}
LEFT JOIN lkp_hospital_type ht ON ht.id = tr.institution_id    -- if you have a separate hospital type table; adjust as needed

-- ==========================
-- EMO TRIAGE + outcome
-- ==========================
LEFT JOIN emo_triage et ON et.triage_id = tr.id
LEFT JOIN emo_triage_outcome et_out ON et_out.emo_id = et.id

LEFT JOIN lkp_emo_emergency_category ec ON ec.id = et.emergency_category
LEFT JOIN lkp_emo_recall_info mem ON mem.id = et.memory
LEFT JOIN lkp_emo_recall_info sc ON sc.id = et.self_control
LEFT JOIN lkp_emo_recall_info rt ON rt.id = et.reaction_time
LEFT JOIN lkp_emo_speech sp ON sp.id = et.speech
LEFT JOIN lkp_emo_gen_disposition gd ON gd.id = et.general_disposition
LEFT JOIN lkp_emo_clothing cl ON cl.id = et.clothing
LEFT JOIN lkp_emo_orientation_time ot ON ot.id = et.orientation_time
LEFT JOIN lkp_emo_trauma_treatment trt ON trt.id = et.emo_trauma_treatment
LEFT JOIN lkp_emo_outcome eo ON eo.id = et_out.outcome
LEFT JOIN lkp_hospitals lk_h on destination_taei_hospital=lk_h.hospitalid
LEFT JOIN lkp_reason_for_referral rea_fef on rea_fef.id=et_out.reason_for_referral
LEFT JOIN lkp_condition_of_patient cop on cop.id=et_out.condition_of_patient

-- ==========================
-- POISONS + lookups (from Poisons.sql) :contentReference[oaicite:9]{index=9}
-- ==========================
 	LEFT JOIN poisons p on p.triage_id=tr.id

    LEFT JOIN lkp_poison_type_of_poisoning tp ON tp.id = p.type_of_poisoning
    LEFT JOIN lkp_poison_route_of_exposure rexp ON rexp.id = p.route_of_exposure
    LEFT JOIN lkp_poison_substance_involved si ON si.id = p.substance_involved
    LEFT JOIN lkp_poison_substance_involved_sub sis ON sis.id = p.substance_involved_sub
    LEFT JOIN lkp_poison_source_of_substance ss ON ss.id = p.source_of_substance
    LEFT JOIN lkp_poison_severity_of_poisoning sev ON sev.id = p.severity_of_poisoning

    LEFT JOIN LATERAL (
        SELECT string_agg(sp.name, ', ') AS symptoms
        FROM lkp_poison_symptoms_presentation sp
        WHERE sp.id = ANY(p.symptoms_at_presentation)
    ) sp2 ON TRUE

    LEFT JOIN LATERAL (
        SELECT string_agg(dc.name, ', ') AS decontamination
        FROM lkp_poison_decontamination dc
        WHERE dc.id = ANY(p.decontamination)
    ) dc ON TRUE

    LEFT JOIN LATERAL (
        SELECT string_agg(sc.name, ', ') AS supportive_care
        FROM lkp_poison_supportive_care_provided sc
        WHERE sc.id = ANY(p.supportive_care_provided)
    ) sc2 ON TRUE

    LEFT JOIN poisons_outcome o ON o.poison_id = p.id
    LEFT JOIN lkp_poison_outcome po ON po.id = o.outcome
    LEFT JOIN lkp_hospital_type ht2 ON ht2.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral rr ON rr.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient cp ON cp.id = o.condition_of_patient

-- --------------------------
-- Date filter (change the dates as needed)
-- --------------------------
WHERE tr.date_time_of_triage::date BETWEEN p_from AND p_to
AND emergency_category=5
ORDER BY tr.date_time_of_triage DESC;
END;
$BODY$;
