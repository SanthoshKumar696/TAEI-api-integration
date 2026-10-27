-- FUNCTION: public.get_state_taei_full_prem_export(timestamp without time zone, timestamp without time zone, integer)

-- DROP FUNCTION IF EXISTS public.get_state_taei_full_prem_export(timestamp without time zone, timestamp without time zone, integer);
--select * from get_state_taei_full_prem_export('2025-12-15','2025-12-24',0)
CREATE OR REPLACE FUNCTION public.get_state_taei_full_prem_export(
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
				  
				  prem_date_time_of_entry timestamp without time zone, prem_patient_admitted boolean, prem_name_of_dept character varying, prem_date_of_admit timestamp without time zone, prem_is_prem_casesheet_used boolean, prem_oth_presenting_complaints_prem character varying, prem_temperature numeric, prem_approx_weight numeric, prem_cbg numeric, prem_co_morbid_conditions boolean, prem_user_id integer, prem_inserted_date timestamp without time zone, prem_ref_form_id integer, prem_ref_id integer, prem_presenting_complaints_names text, prem_development_name character varying, prem_triage_flag_name character varying, prem_treatment_given character varying, prem_airway_name character varying, prem_breathing_name character varying, prem_circulation_hr_name character varying, prem_perfusion_name character varying, prem_liver_span_name character varying, prem_systolic_bp_name character varying, prem_map_name character varying, prem_disability_name character varying, prem_tone_posture_name character varying, prem_eye_position_movements_name character varying, prem_pupils_name character varying, prem_diagnosis_name character varying, prem_diagnosis_refvalue_name character varying, prem_procedures_done_names text, prem_discharge_date timestamp without time zone, prem_absconded_date timestamp without time zone, prem_death_date timestamp without time zone, prem_cause_of_death character varying, prem_patient_exit_date timestamp without time zone, prem_destination_hospital character varying, prem_destination_taei_hospital integer, prem_referring_doctor character varying, prem_outcome_name character varying, prem_hospital_type_name character varying, prem_reason_for_referral_name character varying, prem_condition_of_patient_name character varying, prem_patient_stabilised_referral_name character varying) 
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

        'BURNS' AS pillar,

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
		
		--PREM Start
-- ==========================
-- PREM RAW
-- ==========================
pr.date_time_of_entry AS prem_date_time_of_entry,
pr.patient_admitted AS prem_patient_admitted,
pr.name_of_dept AS prem_name_of_dept,
pr.date_of_admit AS prem_date_of_admit,
pr.is_prem_casesheet_used AS prem_is_prem_casesheet_used,
pr.oth_presenting_complaints_prem AS prem_oth_presenting_complaints_prem,
pr.temperature AS prem_temperature,
pr.approx_weight AS prem_approx_weight,
pr.cbg AS prem_cbg,
pr.co_morbid_conditions AS prem_co_morbid_conditions,
pr.user_id AS prem_user_id,
pr.inserted_date AS prem_inserted_date,
pr.ref_form_id AS prem_ref_form_id,
pr.ref_id AS prem_ref_id,

-- ==========================
-- PREM LOOKUP NAMES
-- ==========================
(
  SELECT string_agg(pc.name, ', ')
  FROM lkp_prem_presenting_complaints pc
  WHERE pc.id = ANY(pr.presenting_complaints_prem)
) AS prem_presenting_complaints_names,

lprem_development.name AS prem_development_name,
lprem_triage_flag.name AS prem_triage_flag_name,

-- ==========================
-- PREM VITALS RAW
-- ==========================
prv.treatment_given AS prem_treatment_given,

-- ==========================
-- PREM VITALS LOOKUP NAMES
-- ==========================
lprem_airway.name AS prem_airway_name,
lprem_breathing.name AS prem_breathing_name,
lprem_circulation_hr.name AS prem_circulation_hr_name,
lprem_perfusion.name AS prem_perfusion_name,
lprem_liver_span.name AS prem_liver_span_name,
lprem_systolic_bp.name AS prem_systolic_bp_name,
lprem_map.name AS prem_map_name,
lprem_disability.name AS prem_disability_name,
lprem_tone_posture.name AS prem_tone_posture_name,
lprem_eye_position_movements.name AS prem_eye_position_movements_name,
lprem_pupils.name AS prem_pupils_name,
lprem_diagnosis.name AS prem_diagnosis_name,
lprem_diagnosis_ref.name AS prem_diagnosis_refvalue_name,

(
  SELECT string_agg(proc.name, ', ')
  FROM lkp_prem_procedures_done proc
  WHERE proc.id = ANY(prv.procedures_done)
) AS prem_procedures_done_names,

-- ==========================
-- PREM OUTCOME RAW
-- ==========================
pr_out.discharge_date AS prem_discharge_date,
pr_out.absconded_date AS prem_absconded_date,
pr_out.death_date AS prem_death_date,
pr_out.cause_of_death AS prem_cause_of_death,
pr_out.patient_exit_date AS prem_patient_exit_date,
pr_out.destination_hospital AS prem_destination_hospital,
pr_out.destination_taei_hospital AS prem_destination_taei_hospital,
pr_out.referring_doctor AS prem_referring_doctor,

-- ==========================
-- PREM OUTCOME LOOKUPS
-- ==========================
lprem_outcome.name AS prem_outcome_name,
lhtp.name AS prem_hospital_type_name,
lref2.name AS prem_reason_for_referral_name,
lcond2.name AS prem_condition_of_patient_name,
lprem_stabilised.name AS prem_patient_stabilised_referral_name

--PREM End

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
-- PREM MAIN
-- ==========================
LEFT JOIN prem pr ON pr.triage_id = tr.id
LEFT JOIN lkp_prem_development lprem_development ON lprem_development.id = pr.development
LEFT JOIN lkp_prem_triage_flag lprem_triage_flag ON lprem_triage_flag.id = pr.triage_flag

-- ==========================
-- PREM VITALS + LOOKUPS
-- ==========================
LEFT JOIN prem_vitals prv ON prv.prem_id = pr.id

LEFT JOIN lkp_prem_airway lprem_airway ON lprem_airway.id = prv.airway
LEFT JOIN lkp_prem_breathing lprem_breathing ON lprem_breathing.id = prv.breathing
LEFT JOIN lkp_prem_circulation_hr lprem_circulation_hr ON lprem_circulation_hr.id = prv.circulation_hr
LEFT JOIN lkp_prem_perfusion lprem_perfusion ON lprem_perfusion.id = prv.perfusion
LEFT JOIN lkp_prem_liver_span lprem_liver_span ON lprem_liver_span.id = prv.liver_span
LEFT JOIN lkp_prem_systolic_bp lprem_systolic_bp ON lprem_systolic_bp.id = prv.systolic_bp
LEFT JOIN lkp_prem_map lprem_map ON lprem_map.id = prv.map
LEFT JOIN lkp_prem_disability lprem_disability ON lprem_disability.id = prv.disability
LEFT JOIN lkp_prem_tone_posture lprem_tone_posture ON lprem_tone_posture.id = prv.tone_posture
LEFT JOIN lkp_prem_eye_position_movements lprem_eye_position_movements ON lprem_eye_position_movements.id = prv.eye_position_movements
LEFT JOIN lkp_prem_pupils lprem_pupils ON lprem_pupils.id = prv.pupils
LEFT JOIN lkp_prem_diagnosis lprem_diagnosis ON lprem_diagnosis.id = prv.diagnosis
LEFT JOIN lkp_prem_diagnosis_ref lprem_diagnosis_ref ON lprem_diagnosis_ref.id = prv.diagnosis_refvalue

-- ==========================
-- PREM OUTCOME
-- ==========================
LEFT JOIN prem_outcome pr_out ON pr_out.prem_id = pr.id
LEFT JOIN lkp_prem_outcome lprem_outcome ON lprem_outcome.id = pr_out.outcome
LEFT JOIN lkp_hospital_type lhtp ON lhtp.id = pr_out.hospital_type
LEFT JOIN lkp_reason_for_referral lref2 ON lref2.id = pr_out.reason_for_referral
LEFT JOIN lkp_condition_of_patient lcond2 ON lcond2.id = pr_out.condition_of_patient
LEFT JOIN lkp_prem_stabilised_referral lprem_stabilised ON lprem_stabilised.id = pr_out.patient_stabilised_referral

-- --------------------------
-- Date filter (change the dates as needed)
-- --------------------------
WHERE tr.date_time_of_triage::date BETWEEN p_from AND p_to
AND emergency_category in (9)
ORDER BY tr.id DESC;
END;
$BODY$;

