-- FUNCTION: public.get_state_taei_full_export(timestamp without time zone, timestamp without time zone, integer)

-- DROP FUNCTION IF EXISTS public.get_state_taei_full_trauma_export(timestamp without time zone, timestamp without time zone, integer);

CREATE OR REPLACE FUNCTION public.get_state_taei_full_trauma_export(
	p_from timestamp without time zone,
	p_to timestamp without time zone,
	hospital_id integer DEFAULT 0)
    
	RETURNS TABLE(
    triage_id integer,
    date_time_of_triage timestamp without time zone,
    type_of_patient boolean,
    pillar text,
    name_of_patient character varying,
    age_year integer,
    age_month integer,
    fathername character varying,
    mothername character varying,
    patient_mobile_number character varying,
    income character varying,
    patient_ehr_id boolean,
    cmchis_card character varying,
    abha_card character varying,
    phr_id character varying,
    hmis_id character varying,
    esi_card character varying,
    address_line character varying,
    district integer,
    state integer,
    pincode character varying,
    patienr_recieved_from integer,
    oth_patienr_recieved_from character varying,
    mode_of_arrival integer,
    scene_ift integer,
    source_type integer,
    source_hospital character varying,
    destination_hospital character varying,
    reason_for_referral integer,
    oth_reason_for_referral character varying,
    referral_doctor_name character varying,
    condition_of_patient integer,
    is_patient_stable_ift integer,
    date_and_time_of_incident timestamp without time zone,
    place_of_incident integer,
    oth_place_of_incident character varying,
    institution_id integer,
    user_id integer,
    inserted_date timestamp without time zone,

    gender_name character varying,
    marital_status_name character varying,
    education_name character varying,
    employment_status_name character varying,
    occupation_name character varying,
    mode_of_arrival_name character varying,
    place_of_incident_name character varying,
    reason_for_referral_name character varying,
    condition_of_patient_name character varying,
    source_type_name character varying,
    scene_ift_name character varying,
    triage_accompanied_by_name character varying,
    triage_avpu_name character varying,
    triage_flag_name character varying,
    hospital_name character varying,
    district_name character varying,
    hospital_type_name character varying,

    emo_past_history integer[],
    emo_diagnosis character varying,
    emo_emergency_category integer,
    emo_oth_emergency_category character varying,
    emo_is_patient_smells_alcohol boolean,
    emo_is_alcohol_consumption boolean,
    emo_is_drunken_drive_history boolean,
    emo_time_of_examination timestamp without time zone,
    emo_memory integer,
    emo_self_control integer,
    emo_is_smell_in_breath boolean,
    emo_is_urine_alchol_concentration boolean,
    emo_speech integer,
    emo_general_disposition integer,
    emo_clothing integer,
    emo_reaction_time integer,
    emo_orientation_time integer,
    emo_is_drug_abuse boolean,
    emo_is_mlc boolean,
    emo_ar_number character varying,
    emo_mlc_date date,
    emo_mlc_time time without time zone,
    emo_pain_scale character varying,
    emo_pain_score character varying,
    emo_treatment_given character varying,
    emo_trauma_treatment integer,
    emo_name_of_the_emo character varying,

    emo_emergency_category_name character varying,
    emo_memory_name character varying,
    emo_self_control_name character varying,
    emo_speech_name character varying,
    emo_general_disposition_name character varying,
    emo_clothing_name character varying,
    emo_reaction_time_name character varying,
    emo_orientation_time_name character varying,
    emo_trauma_treatment_name character varying,

    emo_outcome integer,
    emo_outcome_datetime timestamp without time zone,
    emo_sent_to character varying,
    emo_outcome_hospital_type integer,
    emo_destination_hospital character varying,
    emo_destination_taei_hospital integer,
    emo_reason_for_referral integer,
    emo_condition_of_patient integer,
    emo_referring_doctor_name character varying,
    emo_outcome_name character varying,

    trauma_patient_admitted boolean,
    trauma_name_of_dept character varying,
    trauma_date_time_of_entry timestamp without time zone,
    trauma_mechanism_of_injury integer,
    trauma_type_of_injury integer,
    trauma_oth_type_of_injury character varying,
    trauma_rta integer,
    trauma_rta_helmet boolean,
    trauma_rta_seatbelt boolean,
    trauma_ikt_availed boolean,
    trauma_assault integer,
    trauma_workspot_injury integer,
    trauma_injuries_identified integer[],
    trauma_oth_injuries_identified character varying,
    trauma_part_of_the_body_injured integer[],
    trauma_oth_body_injured character varying,
    trauma_gcs_eye integer,
    trauma_gcs_verbal integer,
    trauma_gcs_motor integer,
    trauma_gcs_total character varying,

    trauma_mechanism_of_injury_name character varying,
    trauma_type_of_injury_name character varying,
    trauma_rta_name character varying,
    trauma_assault_name character varying,
    trauma_workspot_injury_name character varying,
    trauma_gcs_eye_name character varying,
    trauma_gcs_verbal_name character varying,
    trauma_gcs_motor_name character varying,

    trauma_injuries_identified_names text,
    trauma_body_parts_injured_names text,

    trauma_bp_systolic integer,
    trauma_bp_diastolic integer,
    trauma_rr numeric,
    trauma_rts_autogenerate numeric,
    trauma_flag integer,
    trauma_values_admitted boolean,
    trauma_ecg boolean,
    trauma_ecgfindings character varying,
    trauma_xray boolean,
    trauma_xray_date_time timestamp without time zone,
    trauma_xrayfindings character varying,
    trauma_efast boolean,
    trauma_efast_date_time timestamp without time zone,
    trauma_efastfindings character varying,
    trauma_ct boolean,
    trauma_ct_date_time timestamp without time zone,
    trauma_ctfindings character varying,
    trauma_mri boolean,
    trauma_mri_date_time timestamp without time zone,
    trauma_mrifindings character varying,
    trauma_abg boolean,
    trauma_abg_date_time timestamp without time zone,
    trauma_abgfindings character varying,
    trauma_blood_investigation boolean,
    trauma_blood_date_time timestamp without time zone,
    trauma_hcg boolean,
    trauma_hcg_date_time timestamp without time zone,
    trauma_urine_test boolean,
    trauma_urine_date_time timestamp without time zone,
    trauma_oth_specify character varying,
    trauma_oth_date_time timestamp without time zone,

    trauma_flag_name character varying,
    trauma_speciality_opinion integer[],
    trauma_iscpr boolean,
    trauma_cpr_done integer,
    trauma_blood_transfusion_done boolean,
    trauma_on_arrival_nerve_blocks boolean,
    trauma_mech_intubation boolean,
    trauma_mech_intubation_dtls integer,
    trauma_first_pass_intubation boolean,
    trauma_other_procedure_done integer,
    trauma_oth_procedure_done character varying,
    trauma_final_diagnosis character varying,
    trauma_management integer,
    trauma_type_of_surgery integer,
    trauma_surgery_type integer,
    trauma_surgery_name character varying,
    trauma_date_time timestamp without time zone,
    trauma_surgery_takenup_from_incident_date integer,
    trauma_surgery_takenup_from_triage_date integer,
    trauma_name_of_surgery character varying,
    trauma_surgery_done_by character varying,
    trauma_surgery_done_under integer,
    trauma_rehabilitation_required boolean,

    trauma_speciality_opinion_names text,
    trauma_cpr_done_name character varying,
    trauma_mech_intubation_dtls_name character varying,
    trauma_other_procedure_done_name character varying,
    trauma_management_name character varying,
    trauma_type_of_surgery_name character varying,
    trauma_surgery_type_name character varying,
    trauma_surgery_done_under_name character varying,

    trauma_outcome integer,
    trauma_discharge_datetime timestamp without time zone,
    trauma_discharge_details character varying,
    trauma_outcome_hospital_type integer,
    trauma_destination_hospital character varying,
    trauma_destination_taei_hospital integer,
    trauma_reason_for_referral integer,
    trauma_condition_of_patient integer,
    trauma_referring_doctor_name character varying,
    trauma_taei_case_documented boolean,
    trauma_name_of_doctor character varying,
    trauma_stayed_duration integer,
    trauma_outcome_name character varying,
    trauma_hospital_type_name character varying,
    trauma_reason_for_referral_name character varying,
    trauma_condition_of_patient_name character varying

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
		'Trauma' as pillar,
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
		et_out.destination_taei_hospital AS emo_destination_taei_hospital,
		et_out.reason_for_referral AS emo_reason_for_referral,
		et_out.condition_of_patient AS emo_condition_of_patient,
		et_out.referring_doctor_name AS emo_referring_doctor_name,

		-- EMO OUTCOME LOOKUP NAME
		eo.name AS emo_outcome_name,

--TRAUMA
tm.patient_admitted AS trauma_patient_admitted,
tm.name_of_dept AS trauma_name_of_dept,
tm.date_time_of_entry AS trauma_date_time_of_entry,
tm.mechanism_of_injury AS trauma_mechanism_of_injury,
tm.type_of_injury AS trauma_type_of_injury,
tm.oth_type_of_injury AS trauma_oth_type_of_injury,
tm.rta AS trauma_rta,
tm.rta_helmet AS trauma_rta_helmet,
tm.rta_seatbelt AS trauma_rta_seatbelt,
tm.ikt_availed AS trauma_ikt_availed,
tm.assault AS trauma_assault,
tm.workspot_injury AS trauma_workspot_injury,
tm.injuries_identified AS trauma_injuries_identified,
tm.oth_injuries_identified AS trauma_oth_injuries_identified,
tm.part_of_the_body_injured AS trauma_part_of_the_body_injured,
tm.oth_body_injured AS trauma_oth_body_injured,
tm.gcs_eye AS trauma_gcs_eye,
tm.gcs_verbal AS trauma_gcs_verbal,
tm.gcs_motor AS trauma_gcs_motor,
tm.gcs_total AS trauma_gcs_total,

ltm.name AS trauma_mechanism_of_injury_name,
ltt.name AS trauma_type_of_injury_name,
lrta.name AS trauma_rta_name,
lass.name AS trauma_assault_name,
lwork.name AS trauma_workspot_injury_name,
lgcs_eye.name AS trauma_gcs_eye_name,
lgcs_verbal.name AS trauma_gcs_verbal_name,
lgcs_motor.name AS trauma_gcs_motor_name,

(SELECT string_agg(li.name, ', ') 
 FROM lkp_trauma_injuries_identified li 
 WHERE li.id = ANY(tm.injuries_identified)
) AS trauma_injuries_identified_names,

(SELECT string_agg(pb.name, ', ') 
 FROM lkp_trauma_part_of_the_body_injured pb 
 WHERE pb.id = ANY(tm.part_of_the_body_injured)
) AS trauma_body_parts_injured_names,

tv.bp_systolic AS trauma_bp_systolic,
tv.bp_diastolic AS trauma_bp_diastolic,
tv.rr AS trauma_rr,
tv.rts_autogenerate AS trauma_rts_autogenerate,
tv.trauma_flag AS trauma_flag,
tv.admitted AS trauma_values_admitted,
tv.ecg AS trauma_ecg,
tv.ecgfindings AS trauma_ecgfindings,
tv.xray AS trauma_xray,
tv.xray_date_time AS trauma_xray_date_time,
tv.xrayfindings AS trauma_xrayfindings,
tv.efast AS trauma_efast,
tv.efast_date_time AS trauma_efast_date_time,
tv.efastfindings AS trauma_efastfindings,
tv.ct AS trauma_ct,
tv.ct_date_time AS trauma_ct_date_time,
tv.ctfindings AS trauma_ctfindings,
tv.mri AS trauma_mri,
tv.mri_date_time AS trauma_mri_date_time,
tv.mrifindings AS trauma_mrifindings,
tv.abg AS trauma_abg,
tv.abg_date_time AS trauma_abg_date_time,
tv.abgfindings AS trauma_abgfindings,
tv.blood_investigation AS trauma_blood_investigation,
tv.blood_date_time AS trauma_blood_date_time,
tv.hcg AS trauma_hcg,
tv.hcg_date_time AS trauma_hcg_date_time,
tv.urine_test AS trauma_urine_test,
tv.urine_date_time AS trauma_urine_date_time,
tv.oth_specify AS trauma_oth_specify,
tv.oth_date_time AS trauma_oth_date_time,

lflag.name AS trauma_flag_name,

tf.speciality_opinion AS trauma_speciality_opinion,
tf.iscpr AS trauma_iscpr,
tf.cpr_done AS trauma_cpr_done,
tf.blood_transfusion_done AS trauma_blood_transfusion_done,
tf.on_arrival_nerve_blocks AS trauma_on_arrival_nerve_blocks,
tf.mech_intubation AS trauma_mech_intubation,
tf.mech_intubation_dtls AS trauma_mech_intubation_dtls,
tf.first_pass_intubation AS trauma_first_pass_intubation,
tf.other_procedure_done AS trauma_other_procedure_done,
tf.oth_procedure_done AS trauma_oth_procedure_done,
tf.final_diagnosis AS trauma_final_diagnosis,
tf.management AS trauma_management,
tf.type_of_surgery AS trauma_type_of_surgery,
tf.surgery_type AS trauma_surgery_type,
tf.surgery_name AS trauma_surgery_name,
tf.date_time AS trauma_date_time,
tf.surgery_takenup_from_incident_date AS trauma_surgery_takenup_from_incident_date,
tf.surgery_takenup_from_triage_date AS trauma_surgery_takenup_from_triage_date,
tf.name_of_surgery AS trauma_name_of_surgery,
tf.surgery_done_by AS trauma_surgery_done_by,
tf.surgery_done_under AS trauma_surgery_done_under,
tf.rehabilitation_required AS trauma_rehabilitation_required,

(SELECT string_agg(lo2.name, ', ')
 FROM lkp_trauma_speciality_opinion lo2 
 WHERE lo2.id = ANY(tf.speciality_opinion)
) AS trauma_speciality_opinion_names,

lcpr.name AS trauma_cpr_done_name,
lint.name AS trauma_mech_intubation_dtls_name,
lopd.name AS trauma_other_procedure_done_name,
lman.name AS trauma_management_name,
ltos.name AS trauma_type_of_surgery_name,
lst.name AS trauma_surgery_type_name,
lsd.name AS trauma_surgery_done_under_name,

t_out.outcome AS trauma_outcome,
t_out.discharge_datetime AS trauma_discharge_datetime,
t_out.discharge_details AS trauma_discharge_details,
t_out.hospital_type AS trauma_outcome_hospital_type,
t_out.destination_hospital AS trauma_destination_hospital,
t_out.destination_taei_hospital AS trauma_destination_taei_hospital,
t_out.reason_for_referral AS trauma_reason_for_referral,
t_out.condition_of_patient AS trauma_condition_of_patient,
t_out.referring_doctor_name AS trauma_referring_doctor_name,
t_out.taei_case_documented AS trauma_taei_case_documented,
t_out.name_of_doctor AS trauma_name_of_doctor,
t_out.stayed_duration AS trauma_stayed_duration,

lo.name AS trauma_outcome_name,
lht.name AS trauma_hospital_type_name,
lref.name AS trauma_reason_for_referral_name,
lcond.name AS trauma_condition_of_patient_name
--Trauma End


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
-- TRAUMA + lookup joins (see Trauma.sql) :contentReference[oaicite:8]{index=8}
-- ==========================
INNER JOIN trauma tm ON tm.triage_id = tr.id
LEFT JOIN trauma_values tv ON tv.trauma_id = tm.id
LEFT JOIN trauma_final tf ON tf.trauma_id = tm.id
LEFT JOIN trauma_outcome t_out ON t_out.trauma_id = tm.id

LEFT JOIN lkp_trauma_mechanism_of_injury ltm ON ltm.id = tm.mechanism_of_injury
LEFT JOIN lkp_trauma_type_of_injury ltt ON ltt.id = tm.type_of_injury
LEFT JOIN lkp_trauma_rta lrta ON lrta.id = tm.rta
LEFT JOIN lkp_trauma_assault lass ON lass.id = tm.assault
LEFT JOIN lkp_trauma_workspot_injury lwork ON lwork.id = tm.workspot_injury
LEFT JOIN lkp_trauma_gcs_eye lgcs_eye ON lgcs_eye.id = tm.gcs_eye
LEFT JOIN lkp_trauma_gcs_verbal lgcs_verbal ON lgcs_verbal.id = tm.gcs_verbal
LEFT JOIN lkp_trauma_gcs_motor lgcs_motor ON lgcs_motor.id = tm.gcs_motor

LEFT JOIN lkp_trauma_flag lflag ON lflag.id = tv.trauma_flag

LEFT JOIN lkp_trauma_speciality_opinion lo2 ON lo2.id = ANY(tf.speciality_opinion)
LEFT JOIN lkp_trauma_cpr lcpr ON lcpr.id = tf.cpr_done
LEFT JOIN lkp_trauma_mech_intubation_dtls lint ON lint.id = tf.mech_intubation_dtls
LEFT JOIN lkp_trauma_oth_procedure_done lopd ON lopd.id = tf.other_procedure_done
LEFT JOIN lkp_trauma_management lman ON lman.id = tf.management
LEFT JOIN lkp_trauma_type_of_surgery ltos ON ltos.id = tf.type_of_surgery
LEFT JOIN lkp_trauma_surgery_type lst ON lst.id = tf.surgery_type
LEFT JOIN lkp_trauma_surgery_done_under lsd ON lsd.id = tf.surgery_done_under

LEFT JOIN lkp_trauma_outcome lo ON lo.id = t_out.outcome
LEFT JOIN lkp_trauma_hospital_type lht ON lht.id = t_out.hospital_type
LEFT JOIN lkp_trauma_reason_for_referral lref ON lref.id = t_out.reason_for_referral
LEFT JOIN lkp_trauma_condition_of_patient lcond ON lcond.id = t_out.condition_of_patient

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

-- --------------------------
-- Date filter (change the dates as needed)
-- --------------------------
WHERE tr.date_time_of_triage::date BETWEEN p_from AND p_to

ORDER BY tr.id DESC;
END;
$BODY$;

