-- ============================================================
-- 1. Lookup Tables
-- ============================================================

CREATE TABLE lkp_stroke_arrival_time_symptoms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_arrival_time_symptoms (name) VALUES
('0 to 4.5 Hrs'),
('4.5 to 24 hrs'),
('More than 24 hrs'),
('Wake up stroke');

CREATE TABLE lkp_stroke_reason_for_delay (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_reason_for_delay (name) VALUES
('Lack of Awareness'),
('Delay in Transporation'),
('Multiple referrals'),
('Others');

CREATE TABLE lkp_stroke_referred_from (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_referred_from (name) VALUES
('Spoke Center'),
('HUB Center');

CREATE TABLE lkp_stroke_reason_for_referral (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_reason_for_referral (name) VALUES
('CT/MRI'),
('Neurological Opinion'),
('Mechanical Thrombectomy'),
('CATH Lab Procedure'),
('Others(Specify)');

CREATE TABLE lkp_stroke_symptoms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_symptoms (name) VALUES
('Balance problem'),
('Visual Distubances'),
('Face deviation'),
('Arm weakness'),
('Speech disturbance'),
('Time since the onset of symptoms');

CREATE TABLE lkp_stroke_absolute_contraindication (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_absolute_contraindication (name) VALUES
('Hyper Tension'),
('Diabetes Mellitus'),
('Previous Stroke'),
('Transient Ischemic Attack'),
('MI'),
('RHD'),
('Non RHD'),
('CKD'),
('Anemia'),
('Smoking'),
('Alcohol'),
('Tobacco use'),
('Others If any Specify');

CREATE TABLE lkp_stroke_nihs_scale (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_nihs_scale (name) VALUES
('Anterior'),
('Posterior');

CREATE TABLE lkp_stroke_mri_scan_wakeup_stroke (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_mri_scan_wakeup_stroke (name) VALUES
('Eligible'),
('Non Eligible');

CREATE TABLE lkp_stroke_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_type (name) VALUES
('Ischemic'),
('Hemorrhagic');

CREATE TABLE lkp_stroke_thrombolysis_by_drug (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_thrombolysis_by_drug (name) VALUES
('Alteplase'),
('Tenectiplase');

CREATE TABLE lkp_stroke_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_outcome (name) VALUES
('Discharged Improved'),
('Discharged Static'),
('DAMA'),
('Abscond'),
('Death'),
('Transferred To other hospital');

CREATE TABLE lkp_stroke_transferred_to (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_stroke_transferred_to (name) VALUES
('WARD'),
('ICU'),
('OT'),
('OTHER HOSPITAL');

-- ============================================================
-- 2. Main Table: stroke
-- ============================================================

CREATE TABLE stroke (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    date_time_of_entry TIMESTAMP NOT NULL,
    arrival_time_symptoms INTEGER REFERENCES lkp_stroke_arrival_time_symptoms(id),
    reason_for_delay INTEGER REFERENCES lkp_stroke_reason_for_delay(id),
    oth_reason_for_delay VARCHAR(256),
    scene_ift INTEGER REFERENCES lkp_triage_scene_ift(id),
    referred_from INTEGER REFERENCES lkp_stroke_referred_from(id),
    reason_for_referral INTEGER REFERENCES lkp_stroke_reason_for_referral(id),
    oth_reason_for_referral VARCHAR(256),
    admitted BOOLEAN,
    admitted_date_time TIMESTAMP,
    lysis_done_outside BOOLEAN,
    lysis_done_outside_date TIMESTAMP,
    symptoms INT[],-- INTEGER REFERENCES lkp_stroke_symptoms(id),
    risk_factors INT[],--INTEGER REFERENCES lkp_stroke_absolute_contraindication(id),
    oth_risk_factors VARCHAR(256),
    nihs_scale VARCHAR(50), --INTEGER REFERENCES lkp_stroke_nihs_scale(id),
    pre_morbit_scroe VARCHAR(256),
    is_absolute_contraindication BOOLEAN;
    oth_absolute_contraindication VARCHAR(256);
    cbg BOOLEAN,
    cbg_date TIMESTAMP, --TODO - MV - remove this
    cbg_txt VARCHAR(256);
    history_of_anticoagulant BOOLEAN,
    bp_sbp VARCHAR(10),
    bp_dbp VARCHAR(10),
    aspect_score VARCHAR(155),
    ct_scan BOOLEAN,
    ct_scan_date TIMESTAMP,
    ct_scan_findings VARCHAR(256),
    mri_scan BOOLEAN,
    mri_scan_date TIMESTAMP,
    mri_scan_eligibility INTEGER REFERENCES lkp_stroke_mri_scan_wakeup_stroke(id),
    mri_scan_eligility_status BOOLEAN,
    cath_lab_procedure BOOLEAN,
    cath_lab_procedure_date TIMESTAMP,
    cath_lab_findings VARCHAR(256);
    procedure_done BOOLEAN,
    name_of_procedure VARCHAR(256),
    type INTEGER REFERENCES lkp_stroke_type(id),
    hemorrhagic_specify VARCHAR(256),
    lysis_done BOOLEAN,
    lysis_date TIMESTAMP,
    thrombolysis_by_drug INTEGER REFERENCES lkp_stroke_thrombolysis_by_drug(id),
    thrombectomy BOOLEAN,
    thrombectomy_dtls VARCHAR(256),
    decompression_craniectomy BOOLEAN,
    decompression_craniectomy_dtls VARCHAR(256),
    drug_prescribed VARCHAR(256),
    user_id INT, 
    inserted_date TIMESTAMP,
    ref_form_id INT, 
    ref_id INT
);

-- ============================================================
-- Main Table: stroke_outcome (child of stroke)
-- ============================================================

CREATE TABLE stroke_outcome (
    id SERIAL PRIMARY KEY,
    stroke_id INTEGER NOT NULL REFERENCES stroke(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_stroke_outcome(id),
    is_discharged BOOLEAN,
    discharge_date TIMESTAMP,
    discharge_static_date TIMESTAMP,
    dama_date TIMESTAMP,
    absconded_date TIMESTAMP,
    death_date TIMESTAMP,
    transferred_ward_date TIMESTAMP,
    transferred_icu_date TIMESTAMP,    
    cause_of_death VARCHAR(256),
    transferred_to INTEGER REFERENCES lkp_stroke_transferred_to(id),
    hospital_type INTEGER REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_reason_for_referral(id),
    condition_of_patient INTEGER REFERENCES lkp_condition_of_patient(id),
    referring_doctor VARCHAR(256),
    documented_taei_sheet BOOLEAN,
    treatment_given VARCHAR(256),
    drug_prescribed VARCHAR(256),
    duration_stay INT
);