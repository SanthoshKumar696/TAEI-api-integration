-- FUNCTION: public.get_state_taei_full_stroke_export(timestamp without time zone, timestamp without time zone, integer)

-- DROP FUNCTION IF EXISTS public.get_state_taei_full_stroke_export(timestamp without time zone, timestamp without time zone, integer);
--select * from get_state_taei_full_stroke_export('2025-12-1','2025-12-22',0)
CREATE OR REPLACE FUNCTION public.get_state_taei_full_stroke_export(
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
stroke_date_time_of_entry timestamp without time zone, stroke_oth_reason_for_referral character varying, stroke_admitted boolean, stroke_admitted_date_time timestamp without time zone, stroke_lysis_done_outside boolean, stroke_lysis_done_outside_date timestamp without time zone, stroke_oth_absolute_contraindication character varying, stroke_cbg boolean, stroke_cbg_date timestamp without time zone, stroke_history_of_anticoagulant boolean, stroke_bp_sbp character varying, stroke_bp_dbp character varying, stroke_aspect_score character varying, stroke_ct_scan boolean, stroke_ct_scan_date timestamp without time zone, stroke_mri_scan boolean, stroke_mri_scan_date timestamp without time zone, stroke_cath_lab_procedure boolean, stroke_cath_lab_procedure_date timestamp without time zone, stroke_procedure_done boolean, stroke_name_of_procedure character varying, stroke_lysis_done boolean, stroke_lysis_date timestamp without time zone, stroke_thrombectomy boolean, stroke_thrombectomy_dtls character varying, stroke_decompression_craniectomy boolean, stroke_decompression_craniectomy_dtls character varying, stroke_drug_prescribed character varying, stroke_user_id integer, stroke_inserted_date timestamp without time zone, stroke_ref_form_id integer, stroke_ref_id integer, stroke_arrival_time_symptoms_name character varying, stroke_reason_for_delay_name character varying, stroke_scene_ift_name character varying, stroke_referred_from_name character varying, stroke_reason_for_referral_name character varying, stroke_symptoms_name character varying, stroke_nihs_scale_name character varying, stroke_mri_scan_eligibility_name character varying, stroke_type_name character varying, stroke_thrombolysis_by_drug_name character varying, stroke_absolute_contraindication_names text, stroke_discharge_date timestamp without time zone, stroke_discharge_static_date timestamp without time zone, stroke_dama_date timestamp without time zone, stroke_absconded_date timestamp without time zone, stroke_death_date timestamp without time zone, stroke_transferred_ward_date timestamp without time zone, stroke_transferred_icu_date timestamp without time zone, stroke_cause_of_death character varying, stroke_destination_hospital character varying, stroke_destination_taei_hospital character varying, stroke_referring_doctor character varying, stroke_documented_taei_sheet boolean, stroke_treatment_given character varying, stroke_duration_stay integer, stroke_outcome_name character varying, stroke_transferred_to_name character varying, stroke_hospital_type_name character varying, stroke_reason_for_referral_outcome_name character varying, stroke_condition_of_patient_name character varying				  
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

        'STROKE' AS pillar,

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
		
		
	--Stroke Start
-- ==========================
-- STROKE RAW
-- ==========================
st.date_time_of_entry AS stroke_date_time_of_entry,
st.oth_reason_for_referral AS stroke_oth_reason_for_referral,
st.admitted AS stroke_admitted,
st.admitted_date_time AS stroke_admitted_date_time,
st.lysis_done_outside AS stroke_lysis_done_outside,
st.lysis_done_outside_date AS stroke_lysis_done_outside_date,
st.oth_absolute_contraindication AS stroke_oth_absolute_contraindication,
st.cbg AS stroke_cbg,
st.cbg_date AS stroke_cbg_date,
st.history_of_anticoagulant AS stroke_history_of_anticoagulant,
st.bp_sbp AS stroke_bp_sbp,
st.bp_dbp AS stroke_bp_dbp,
st.aspect_score AS stroke_aspect_score,
st.ct_scan AS stroke_ct_scan,
st.ct_scan_date AS stroke_ct_scan_date,
st.mri_scan AS stroke_mri_scan,
st.mri_scan_date AS stroke_mri_scan_date,
st.cath_lab_procedure AS stroke_cath_lab_procedure,
st.cath_lab_procedure_date AS stroke_cath_lab_procedure_date,
st.procedure_done AS stroke_procedure_done,
st.name_of_procedure AS stroke_name_of_procedure,
st.lysis_done AS stroke_lysis_done,
st.lysis_date AS stroke_lysis_date,
st.thrombectomy AS stroke_thrombectomy,
st.thrombectomy_dtls AS stroke_thrombectomy_dtls,
st.decompression_craniectomy AS stroke_decompression_craniectomy,
st.decompression_craniectomy_dtls AS stroke_decompression_craniectomy_dtls,
st.drug_prescribed AS stroke_drug_prescribed,
st.user_id AS stroke_user_id,
st.inserted_date AS stroke_inserted_date,
st.ref_form_id AS stroke_ref_form_id,
st.ref_id AS stroke_ref_id,

-- ==========================
-- LOOKUP NAMES
-- ==========================
lst_arr.name AS stroke_arrival_time_symptoms_name,
ls_delay.name AS stroke_reason_for_delay_name,
scene.name AS stroke_scene_ift_name,  -- from triage lookup
ls_ref_from.name AS stroke_referred_from_name,
ls_ref_reason.name AS stroke_reason_for_referral_name,
--lst_sym.name AS stroke_symptoms_name,
(
    SELECT string_agg(ss.name, ', ')::varchar
    FROM lkp_stroke_symptoms ss
    WHERE ss.id = ANY(st.symptoms)
) AS stroke_symptoms_name,
ls_nih.name AS stroke_nihs_scale_name,
ls_mri.name AS stroke_mri_scan_eligibility_name,
lst_type.name AS stroke_type_name,
ls_drug.name AS stroke_thrombolysis_by_drug_name,

-- ARRAY lookup (absolute contraindication)
(
    SELECT string_agg(ac.name, ', ')
    FROM lkp_stroke_absolute_contraindication ac
    WHERE ac.id = ANY(st.risk_factors)
) AS stroke_absolute_contraindication_names,

-- ==========================
-- OUTCOME RAW
-- ==========================
st_out.discharge_date AS stroke_discharge_date,
st_out.discharge_static_date AS stroke_discharge_static_date,
st_out.dama_date AS stroke_dama_date,
st_out.absconded_date AS stroke_absconded_date,
st_out.death_date AS stroke_death_date,
st_out.transferred_ward_date AS stroke_transferred_ward_date,
st_out.transferred_icu_date AS stroke_transferred_icu_date,
st_out.cause_of_death AS stroke_cause_of_death,
st_out.destination_hospital AS stroke_destination_hospital,
sto_h.hospitalname AS stroke_destination_taei_hospital,
st_out.referring_doctor AS stroke_referring_doctor,
st_out.documented_taei_sheet AS stroke_documented_taei_sheet,
st_out.treatment_given AS stroke_treatment_given,
st_out.duration_stay AS stroke_duration_stay,

-- ==========================
-- OUTCOME LOOKUP NAMES
-- ==========================
ls_out.name AS stroke_outcome_name,
ls_trans.name AS stroke_transferred_to_name,
lhts.name AS stroke_hospital_type_name,
lrrs.name AS stroke_reason_for_referral_outcome_name,
lconds.name AS stroke_condition_of_patient_name

--Stroke END

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
-- STROKE MAIN + LOOKUPS
-- ==========================
LEFT JOIN stroke st ON st.triage_id = tr.id
LEFT JOIN lkp_stroke_arrival_time_symptoms lst_arr ON lst_arr.id = st.arrival_time_symptoms
LEFT JOIN lkp_stroke_reason_for_delay ls_delay ON ls_delay.id = st.reason_for_delay
LEFT JOIN lkp_stroke_referred_from ls_ref_from ON ls_ref_from.id = st.referred_from
LEFT JOIN lkp_stroke_reason_for_referral ls_ref_reason ON ls_ref_reason.id = st.reason_for_referral
--LEFT JOIN lkp_stroke_symptoms lst_sym ON lst_sym.id = ANY(st.symptoms)
LEFT JOIN lkp_stroke_absolute_contraindication ls_ac ON FALSE  -- array handled in SELECT
LEFT JOIN lkp_stroke_nihs_scale ls_nih ON ls_nih.id = st.nihs_scale
LEFT JOIN lkp_stroke_mri_scan_wakeup_stroke ls_mri ON ls_mri.id = st.mri_scan_eligibility
LEFT JOIN lkp_stroke_type lst_type ON lst_type.id = st.type
LEFT JOIN lkp_stroke_thrombolysis_by_drug ls_drug ON ls_drug.id = st.thrombolysis_by_drug

-- ==========================
-- STROKE OUTCOME
-- ==========================
LEFT JOIN stroke_outcome st_out ON st_out.stroke_id = st.id
LEFT JOIN lkp_stroke_outcome ls_out ON ls_out.id = st_out.outcome
LEFT JOIN lkp_stroke_transferred_to ls_trans ON ls_trans.id = st_out.transferred_to
LEFT JOIN lkp_hospital_type lhts ON lhts.id = st_out.hospital_type
LEFT JOIN lkp_hospitals sto_h ON sto_h.hospitalid = st_out.destination_taei_hospital
LEFT JOIN lkp_reason_for_referral lrrs ON lrrs.id = st_out.reason_for_referral
LEFT JOIN lkp_condition_of_patient lconds ON lconds.id = st_out.condition_of_patient

-- --------------------------
-- Date filter (change the dates as needed)
-- --------------------------
WHERE tr.date_time_of_triage::date BETWEEN p_from AND p_to
AND et.emergency_category=10
ORDER BY tr.id DESC;
END;
$BODY$;
