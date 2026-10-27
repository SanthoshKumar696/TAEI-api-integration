-- FUNCTION: public.get_state_taei_full_stemi_export(timestamp without time zone, timestamp without time zone, integer)

-- DROP FUNCTION IF EXISTS public.get_state_taei_full_stemi_export(timestamp without time zone, timestamp without time zone, integer);
--select * from get_state_taei_full_stemi_export('2025-12-03','2025-12-15',0)
CREATE OR REPLACE FUNCTION public.get_state_taei_full_stemi_export(
	p_from timestamp without time zone,
	p_to timestamp without time zone,
	hospital_id integer DEFAULT 0)
    RETURNS TABLE(
		triage_id integer,
date_time_of_triage                timestamp without time zone,
type_of_patient                    boolean,
pillar                             text,
name_of_patient                    character varying,
age_year                           integer,
age_month                          integer,
fathername                         character varying,
mothername                         character varying,
patient_mobile_number              character varying,
income                             character varying,
patient_ehr_id                     boolean,
cmchis_card                        character varying,
abha_card                          character varying,
phr_id                             character varying,
hmis_id                            character varying,
esi_card                           character varying,
address_line                       character varying,
district_name                      character varying,
state                              integer,
pincode                            character varying,
patienr_recieved_from              integer,
oth_patienr_recieved_from          character varying,
mode_of_arrival                    integer,
scene_ift                          integer,
source_type                        integer,
source_hospital                    character varying,
destination_hospital               character varying,
reason_for_referral                integer,
oth_reason_for_referral            character varying,
referral_doctor_name               character varying,
condition_of_patient               integer,
is_patient_stable_ift              integer,
date_and_time_of_incident          timestamp without time zone,
place_of_incident_name             character varying,
oth_place_of_incident              character varying,
institution_id                     integer,
user_id                            integer,
inserted_date                      timestamp without time zone,

gender_name                        character varying,
marital_status_name                character varying,
education_name                     character varying,
employment_status_name             character varying,
occupation_name                    character varying,
mode_of_arrival_name               character varying,
reason_for_referral_name           character varying,
condition_of_patient_name          character varying,
source_type_name                   character varying,
scene_ift_name                     character varying,
triage_accompanied_by_name         character varying,
triage_avpu_name                   character varying,
triage_flag_name                   character varying,
hospital_name                      character varying,
hospital_type_name                 character varying,

pc_medical_emergency text, oth_pc_medical_emergency character varying, pc_surgical_emergency character varying, oth_pc_surgical_emergency character varying, presenting_complaints_prem text, mass_casuality text, mass_casuality_tx integer, pulse integer, bp_systolic integer, bp_diastolic integer, spo2 integer, temperature numeric, brought_dead text, if_red_team_call_out text, is_patient_triaged_queue text, prem_op_ticket_docs text, triage_done_by character varying, work_spot_injury character varying, rta character varying, rta_helmet text, rta_rider_type character varying,
		
emo_past_history                   integer[],
emo_diagnosis                      character varying,
emo_emergency_category             integer,
emo_oth_emergency_category         character varying,
emo_is_patient_smells_alcohol      boolean,
emo_is_alcohol_consumption         boolean,
emo_is_drunken_drive_history       boolean,
emo_time_of_examination            timestamp without time zone,
emo_memory                         integer,
emo_self_control                   integer,
emo_is_smell_in_breath             boolean,
emo_is_urine_alchol_concentration  boolean,
emo_speech                         integer,
emo_general_disposition            integer,
emo_clothing                       integer,
emo_reaction_time                  integer,
emo_orientation_time               integer,
emo_is_drug_abuse                  boolean,
emo_is_mlc                         boolean,
emo_ar_number                      character varying,
emo_mlc_date                       date,
emo_mlc_time                       time without time zone,
emo_pain_scale                     character varying,
emo_pain_score                     character varying,
emo_treatment_given                character varying,
emo_trauma_treatment               integer,
emo_name_of_the_emo                character varying,

emo_emergency_category_name        character varying,
emo_memory_name                    character varying,
emo_self_control_name              character varying,
emo_speech_name                    character varying,
emo_general_disposition_name       character varying,
emo_clothing_name                  character varying,
emo_reaction_time_name             character varying,
emo_orientation_time_name          character varying,
emo_trauma_treatment_name          character varying,

emo_outcome                        integer,
emo_outcome_datetime               timestamp without time zone,
emo_sent_to                        character varying,
emo_outcome_hospital_type          integer,
emo_destination_hospital           character varying,
emo_destination_taei_hospital      character varying,
emo_reason_for_referral            character varying,
emo_condition_of_patient           character varying,
emo_referring_doctor_name          character varying,
emo_outcome_name                   character varying,				  
st_symptom_onset timestamp without time zone, st_risk_factors character varying, st_signs_symptoms character varying, st_fmc_type character varying, st_fmc_datetime timestamp without time zone, st_ecg_datetime timestamp without time zone, st_ecg_location character varying, st_diagnosis character varying, st_other_diagnosis character varying, st_stemi_confirmed_at timestamp without time zone, st_infarction_location character varying, st_loading_dose_location character varying, st_loading_dose_drug character varying, st_loading_dose_time timestamp without time zone, st_loading_dose_admin_date timestamp without time zone, st_thrombolysis_location character varying, st_thrombolytic_agent character varying, st_thrombolysis_start timestamp without time zone, st_thrombolysis_end timestamp without time zone, st_thrombolysis_date timestamp without time zone, st_thrombolysis_outcome character varying, st_thrombolysis_not_done_reason character varying, st_treatment_strategy character varying, st_management_id character varying, st_killip_risk character varying, st_planned_cag boolean, st_cath_lab_arrival timestamp without time zone, st_balloon_inflation timestamp without time zone, st_stent_type character varying, st_complications text, st_other_complications character varying, st_transfer_location character varying, st_counselling_id character varying, st_symptom_to_fmc character varying, st_fmc_to_ecg character varying, st_door_to_needle character varying, st_door_to_balloon character varying, st_total_ischemic_time integer, st_icu_admission boolean, st_hospital_stay_days integer, st_in_hospital_complication text, st_loading_dose_administration_date_treatment timestamp without time zone, st_outcome_type character varying, st_discharge_datetime timestamp without time zone, st_absconded_datetime timestamp without time zone, st_death_datetime timestamp without time zone, st_death_timing character varying, st_other_death_timing character varying, st_cause_of_death text, st_hospital_type character varying, st_destination_hospital character varying, st_referral_reason character varying, st_other_referral_reason character varying, st_patient_condition character varying, st_referring_doctor character varying, st_documented_in_taei_case_sheet boolean, nt_nstemi_confirmed_at timestamp without time zone, nt_loading_dose_location character varying, nt_loading_dose_drug character varying, nt_loading_dose_time timestamp without time zone, nt_loading_dose_admin_date timestamp without time zone, nt_timi_risk character varying, nt_treatment_strategy character varying, nt_cath_lab_arrival timestamp without time zone, nt_balloon_inflation timestamp without time zone, nt_stent_type character varying, nt_complications text, nt_other_complications character varying, nt_transfer_location character varying, nt_symptom_to_fmc character varying, nt_fmc_to_ecg character varying, nt_icu_admission boolean, nt_hospital_stay_days integer, nt_in_hospital_complications text, nt_management_id character varying, nt_coronory_angiography_name character varying, nt_outcome_type character varying, nt_discharge_datetime timestamp without time zone, nt_absconded_datetime timestamp without time zone, nt_death_datetime timestamp without time zone, nt_death_timing character varying, nt_other_death_timing character varying, nt_cause_of_death text, nt_hospital_type character varying, nt_destination_hospital character varying, nt_referral_reason character varying, nt_other_referral_reason character varying, nt_patient_condition character varying, nt_referring_doctor character varying, nt_documented_in_taei_case_sheet boolean, ua_ua_confirmed_at timestamp without time zone, ua_loading_dose_location character varying, ua_loading_dose_drug character varying, ua_loading_dose_time timestamp without time zone, ua_loading_dose_admin_date timestamp without time zone, ua_timi_risk character varying, ua_management_id character varying, ua_counselling_id character varying, ua_icu_admission boolean, ua_hospital_stay_days integer, ua_in_hospital_complications text, ua_symptom_to_fmc character varying, ua_fmc_to_ecg character varying, ua_door_to_balloon character varying, ua_other_complications character varying, ua_coronory_angiography_id integer, ua_outcome_type character varying, ua_discharge_datetime timestamp without time zone, ua_absconded_datetime timestamp without time zone, ua_death_datetime timestamp without time zone, ua_death_timing character varying, ua_other_death_timing character varying, ua_cause_of_death text, ua_hospital_type character varying, ua_destination_hospital character varying, ua_referral_reason character varying, ua_other_referral_reason character varying, ua_patient_condition character varying, ua_referring_doctor character varying, ua_documented_in_taei_case_sheet boolean) 
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

        'STEMI' AS pillar,

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

        -- HOSPITAL
        h.HospitalName AS hospital_name,
        
        ht.name AS hospital_type_name,
		
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
		
		--Stemi Start
----------------------------------------------------------------
        -- STEMI CLINICAL
        ----------------------------------------------------------------
        stc.symptom_onset_datetime,
        stc.risk_factors,
        stc.signs_symtoms,
        lkp_fmc.name AS st_fmc_type,
        stc.fmc_datetime,
        stc.ecg_datetime,
        lkp_ecg_loc.name AS st_ecg_location,
        lkp_diag.name AS st_diagnosis,
        stc.other_dignosis,

        ----------------------------------------------------------------
        -- STEMI TREATMENT
        ----------------------------------------------------------------
        stt.stemi_confirmed_at,
        lkp_infarct.name AS st_infarction_location,
        lkp_ldloc.name AS st_loading_dose_location,
        lkp_lddrug.name AS st_loading_dose_drug,
        stt.loading_dose_time,
        stt.loading_dose_administration_date,
        lkp_thrombo_loc.name AS st_thrombolysis_location,
        lkp_thrombo_agent.name AS st_thrombolytic_agent,
        stt.thrombolysis_start,
        stt.thrombolysis_end,
        stt.thrombolysis_date,
        lkp_thrombo_out.name AS st_thrombolysis_outcome,
        stt.thrombolysis_not_done_reason,
        lkp_strategy.name AS st_treatment_strategy,
        stt.management_id,
        lkp_killip.name AS st_killip_risk,
        stt.planned_cag,
        stt.cath_lab_arrival,
        stt.balloon_inflation,
        lkp_stent.name AS st_stent_type,
        stt.complications,
        stt.other_complications,
        lkp_transfer.name AS st_transfer_location,
        stt.counselling_id,
        stt.symptom_to_fmc,
        stt.fmc_to_ecg,
        stt.door_to_needle,
        stt.door_to_balloon,
        stt.total_ischemic_time,
        stt.icu_admission,
        stt.hospital_stay_days,
        stt.in_hospital_complication,
        stt.loading_dose_administration_date,

        ----------------------------------------------------------------
        -- STEMI OUTCOME
        ----------------------------------------------------------------
        lkp_outcome.name AS st_outcome_type,
        so.discharge_datetime AS st_discharge_datetime,
        so.absconded_datetime AS st_absconded_datetime,
        so.death_datetime AS st_death_datetime,
        lkp_deathtiming.name AS st_death_timing,
        so.other_death_timing AS st_other_death_timing,
        so.cause_of_death AS st_cause_of_death,
        lkp_hosp_type.name AS st_hospital_type,
        so.destination_hospital AS st_destination_hospital,
        lkp_ref_reason.name AS st_referral_reason,
        so.other_referral_reason AS st_other_referral_reason,
        lkp_patient_cond.name AS st_patient_condition,
        so.referring_doctor AS st_referring_doctor,
        so.documented_in_taei_case_sheet AS st_documented_in_taei_case_sheet,

        

        ----------------------------------------------------------------
        -- NSTEMI TREATMENT
        ----------------------------------------------------------------
        ntt.nstemi_confirmed_at,
        lkp_n_ldloc.name AS nt_loading_dose_location,
        lkp_n_lddrug.name AS nt_loading_dose_drug,
        ntt.loading_dose_time AS nt_loading_dose_time,
        ntt.loading_dose_administration_date AS nt_loading_dose_admin_date,
        lkp_timi.name AS nt_timi_risk,
        lkp_nst_strategy.name AS nt_treatment_strategy,
        ntt.cath_lab_arrival AS nt_cath_lab_arrival,
        ntt.balloon_inflation AS nt_balloon_inflation,
        lkp_stent2.name AS nt_stent_type,
        ntt.complications AS nt_complications,
        ntt.other_complications AS nt_other_complications,
        lkp_transfer2.name AS nt_transfer_location,
        ntt.symptom_to_fmc AS nt_symptom_to_fmc,
        ntt.fmc_to_ecg AS nt_fmc_to_ecg,
        ntt.icu_admission AS nt_icu_admission,
        ntt.hospital_stay_days AS nt_hospital_stay_days,
        ntt.in_hospital_complications AS nt_in_hospital_complications,
        ntt.management_id AS nt_management_id,
        lkp_conservative.name AS nt_coronory_angiography_name,
        --ntt.counselling_id AS nt_counselling_id,

        ----------------------------------------------------------------
        -- NSTEMI OUTCOME
        ----------------------------------------------------------------
        lkp_n_outcome.name AS nt_outcome_type,
        nso.discharge_datetime AS nt_discharge_datetime,
        nso.absconded_datetime AS nt_absconded_datetime,
        nso.death_datetime AS nt_death_datetime,
        lkp_n_deathtiming.name AS nt_death_timing,
        nso.other_death_timing AS nt_other_death_timing,
        nso.cause_of_death AS nt_cause_of_death,
        lkp_n_hosp_type.name AS nt_hospital_type,
        nso.destination_hospital AS nt_destination_hospital,
        lkp_n_ref_reason.name AS nt_referral_reason,
        nso.other_referral_reason AS nt_other_referral_reason,
        lkp_n_patient_cond.name AS nt_patient_condition,
        nso.referring_doctor AS nt_referring_doctor,
        nso.documented_in_taei_case_sheet AS nt_documented_in_taei_case_sheet,

       

        ----------------------------------------------------------------
        -- UA TREATMENT
        ----------------------------------------------------------------
        uat.ua_confirmed_at,
        lkp_u_ldloc.name AS ua_loading_dose_location,
        lkp_u_lddrug.name AS ua_loading_dose_drug,
        uat.loading_dose_time AS ua_loading_dose_time,
        uat.loading_dose_administration_date AS ua_loading_dose_admin_date,
        lkp_timi2.name AS ua_timi_risk,
        uat.management_id AS ua_management_id,
        uat.counselling_id AS ua_counselling_id,
        uat.icu_admission AS ua_icu_admission,
        uat.hospital_stay_days AS ua_hospital_stay_days,
        uat.in_hospital_complications AS ua_in_hospital_complications,
        uat.symptom_to_fmc AS ua_symptom_to_fmc,
        uat.fmc_to_ecg AS ua_fmc_to_ecg,
        uat.door_to_balloon AS ua_door_to_balloon,
        uat.other_complications AS ua_other_complications,
        uat.coronory_angiography_id AS ua_coronory_angiography_id,

        ----------------------------------------------------------------
        -- UA OUTCOME
        ----------------------------------------------------------------
        lkp_u_outcome.name AS ua_outcome_type,
        uao.discharge_datetime AS ua_discharge_datetime,
        uao.absconded_datetime AS ua_absconded_datetime,
        uao.death_datetime AS ua_death_datetime,
        lkp_u_deathtiming.name AS ua_death_timing,
        uao.other_death_timing AS ua_other_death_timing,
        uao.cause_of_death AS ua_cause_of_death,
        lkp_u_hosp_type.name AS ua_hospital_type,
        uao.destination_hospital AS ua_destination_hospital,
        lkp_u_ref_reason.name AS ua_referral_reason,
        uao.other_referral_reason AS ua_other_referral_reason,
        lkp_u_patient_cond.name AS ua_patient_condition,
        uao.referring_doctor AS ua_referring_doctor,
        uao.documented_in_taei_case_sheet AS ua_documented_in_taei_case_sheet
--Stemi End

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
INNER JOIN emo_triage et ON et.triage_id = tr.id
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
LEFT JOIN lkp_hospitals lk_h on et_out.destination_taei_hospital=lk_h.hospitalid
LEFT JOIN lkp_reason_for_referral rea_fef on rea_fef.id=et_out.reason_for_referral
LEFT JOIN lkp_condition_of_patient cop on cop.id=et_out.condition_of_patient

-- ==========================
-- STEMI / NSTEMI / UA (see Stemi.sql) :contentReference[oaicite:11]{index=11}
-- ==========================
-- STEMI clinical/treatment/outcome
LEFT JOIN stemi_clinical_assessment stc ON stc.triage_id = tr.id
LEFT JOIN stemi_treatment stt ON stt.triage_id = tr.id
LEFT JOIN stemi_outcome so ON so.triage_id = tr.id

-- NSTEMI clinical/treatment/outcome
LEFT JOIN nstemi_treatment ntt ON ntt.triage_id = tr.id
LEFT JOIN nstemi_outcome nso ON nso.triage_id = tr.id

-- (if you don't have nstemi_clinical_assessment table remove ntc references)

-- UA clinical/treatment/outcome
LEFT JOIN unstableangina_treatment uat ON uat.triage_id = tr.id
LEFT JOIN unstableangina_outcome uao ON uao.triage_id = tr.id

-- (if you don't have unstableangina_clinical_assessment remove uac references)

-- STEMI lookups
LEFT JOIN lkp_stemi_fmc_master lkp_fmc ON stc.fmc_type = lkp_fmc.id
LEFT JOIN lkp_stemi_ecg_location_master lkp_ecg_loc ON stc.ecg_location = lkp_ecg_loc.id
LEFT JOIN lkp_stemi_diagnosis_master lkp_diag ON stc.diagnosis = lkp_diag.id

LEFT JOIN lkp_stemi_infarction_location lkp_infarct ON stt.infarction_location_id = lkp_infarct.id
LEFT JOIN lkp_stemi_loading_dose_location lkp_ldloc ON stt.loading_dose_location_id = lkp_ldloc.id
LEFT JOIN lkp_stemi_loading_dose_drug lkp_lddrug ON stt.loading_dose_drug_id = lkp_lddrug.id
LEFT JOIN lkp_stemi_thrombolysis_location lkp_thrombo_loc ON stt.thrombolysis_location_id = lkp_thrombo_loc.id
LEFT JOIN lkp_stemi_thrombolytic_agent lkp_thrombo_agent ON stt.thrombolytic_agent_id = lkp_thrombo_agent.id
LEFT JOIN lkp_stemi_thrombolysis_outcome lkp_thrombo_out ON stt.thrombolysis_outcome_id = lkp_thrombo_out.id
LEFT JOIN lkp_stemi_treatment_strategy lkp_strategy ON stt.treatment_strategy_id = lkp_strategy.id
LEFT JOIN lkp_stemi_killip_risk_score lkp_killip ON stt.killip_risk_score_id = lkp_killip.id
LEFT JOIN lkp_stemi_stent_type lkp_stent ON stt.stent_type_id = lkp_stent.id
LEFT JOIN lkp_stemi_transfer_location lkp_transfer ON stt.transfer_location_id = lkp_transfer.id

-- STEMI outcome lookups
LEFT JOIN lkp_stemi_outcome_type lkp_outcome ON so.outcome_type_id = lkp_outcome.id
LEFT JOIN lkp_stemi_death_timing lkp_deathtiming ON so.death_timing_id = lkp_deathtiming.id
LEFT JOIN lkp_stemi_hospital_type lkp_hosp_type ON so.hospital_type_id = lkp_hosp_type.id
LEFT JOIN lkp_stemi_referral_reason lkp_ref_reason ON so.referral_reason_id = lkp_ref_reason.id
LEFT JOIN lkp_stemi_patient_condition lkp_patient_cond ON so.patient_condition_id = lkp_patient_cond.id

-- NSTEMI lookups
LEFT JOIN lkp_stemi_nstemi_loading_dose_location lkp_n_ldloc ON ntt.loading_dose_location_id = lkp_n_ldloc.id
LEFT JOIN lkp_stemi_nstemi_loading_dose_drug lkp_n_lddrug ON ntt.loading_dose_drug_id = lkp_n_lddrug.id
LEFT JOIN lkp_stemi_timi_risk_score lkp_timi ON ntt.timi_risk_score_id = lkp_timi.id
LEFT JOIN lkp_stemi_nstemi_treatment_strategy lkp_nst_strategy ON ntt.treatment_strategy_id = lkp_nst_strategy.id
LEFT JOIN lkp_stemi_stent_type lkp_stent2 ON ntt.stent_type_id = lkp_stent2.id
LEFT JOIN lkp_stemi_transfer_location lkp_transfer2 ON ntt.transfer_location_id = lkp_transfer2.id
LEFT JOIN lkp_stemi_conservative_management lkp_conservative ON ntt.coronory_angiography_id = lkp_conservative.id

-- NSTEMI outcome lookups
LEFT JOIN lkp_stemi_nstemi_outcome_type lkp_n_outcome ON nso.outcome_type_id = lkp_n_outcome.id
LEFT JOIN lkp_stemi_nstemi_death_timing lkp_n_deathtiming ON nso.death_timing_id = lkp_n_deathtiming.id
LEFT JOIN lkp_stemi_hospital_type lkp_n_hosp_type ON nso.hospital_type_id = lkp_n_hosp_type.id
LEFT JOIN lkp_stemi_referral_reason lkp_n_ref_reason ON nso.referral_reason_id = lkp_n_ref_reason.id
LEFT JOIN lkp_stemi_patient_condition lkp_n_patient_cond ON nso.patient_condition_id = lkp_n_patient_cond.id

-- UA lookups
LEFT JOIN lkp_stemi_nstemi_loading_dose_location lkp_u_ldloc ON uat.loading_dose_location_id = lkp_u_ldloc.id
LEFT JOIN lkp_stemi_nstemi_loading_dose_drug lkp_u_lddrug ON uat.loading_dose_drug_id = lkp_u_lddrug.id
LEFT JOIN lkp_stemi_timi_risk_score lkp_timi2 ON uat.timi_risk_score_id = lkp_timi2.id

-- UA outcome lookups
LEFT JOIN lkp_stemi_nstemi_outcome_type lkp_u_outcome ON uao.outcome_type_id = lkp_u_outcome.id
LEFT JOIN lkp_stemi_nstemi_death_timing lkp_u_deathtiming ON uao.death_timing_id = lkp_u_deathtiming.id
LEFT JOIN lkp_stemi_hospital_type lkp_u_hosp_type ON uao.hospital_type_id = lkp_u_hosp_type.id
LEFT JOIN lkp_stemi_referral_reason lkp_u_ref_reason ON uao.referral_reason_id = lkp_u_ref_reason.id
LEFT JOIN lkp_stemi_patient_condition lkp_u_patient_cond ON uao.patient_condition_id = lkp_u_patient_cond.id

-- --------------------------
-- Date filter (change the dates as needed)
-- --------------------------
WHERE tr.date_time_of_triage::date BETWEEN p_from AND p_to
AND et.emergency_category=11
ORDER BY tr.id DESC;
END;
$BODY$;