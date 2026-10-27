-- FUNCTION: public.get_state_taei_full_triage_emo_export(timestamp without time zone, timestamp without time zone, integer)

-- DROP FUNCTION IF EXISTS public.get_state_taei_full_triage_emo_export(timestamp without time zone, timestamp without time zone, integer);
select * from get_state_taei_full_triage_emo_export('2025-11-03','2025-11-15',0)

CREATE OR REPLACE FUNCTION public.get_state_taei_full_triage_emo_export(
	p_from timestamp without time zone,
	p_to timestamp without time zone,
	hospital_id integer DEFAULT 0)
    RETURNS TABLE(
	triage_id                          integer,
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
district                           integer,
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
place_of_incident                  integer,
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
place_of_incident_name             character varying,
reason_for_referral_name           character varying,
condition_of_patient_name          character varying,
source_type_name                   character varying,
scene_ift_name                     character varying,
triage_accompanied_by_name         character varying,
triage_avpu_name                   character varying,
triage_flag_name                   character varying,
hospital_name                      character varying,
district_name                      character varying,
hospital_type_name                 character varying,

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
emo_reason_for_referral            integer,
emo_condition_of_patient           integer,
emo_referring_doctor_name          character varying,
emo_outcome_name                   character varying

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
        tr.district,
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
        tr.place_of_incident,
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
        place.name AS place_of_incident_name,
        reason.name AS reason_for_referral_name,
        cond.name AS condition_of_patient_name,
        src.name AS source_type_name,
        scene.name AS scene_ift_name,

        triage_accomp.name AS triage_accompanied_by_name,
        triage_avpu.name AS triage_avpu_name,
        triage_flag.name AS triage_flag_name,

        -- HOSPITAL
        h.HospitalName AS hospital_name,
        h.DistrictName AS district_name,
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
		et_out.reason_for_referral AS emo_reason_for_referral,
		et_out.condition_of_patient AS emo_condition_of_patient,
		et_out.referring_doctor_name AS emo_referring_doctor_name,

		-- EMO OUTCOME LOOKUP NAME
		eo.name AS emo_outcome_name

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

-- --------------------------
-- Date filter (change the dates as needed)
-- --------------------------
WHERE tr.date_time_of_triage::date BETWEEN p_from AND p_to

ORDER BY tr.id DESC;
END;
$BODY$;
