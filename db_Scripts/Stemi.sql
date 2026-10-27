

-- ============================================================
-- Main Table - Admission 
-- ============================================================

CREATE TABLE stemi_admission (
	id SERIAL PRIMARY KEY,
    triage_id INTEGER,
    is_admitted BOOLEAN,
    date_time_entry TIMESTAMP,
    department_name varchar(200),
    date_time_admission TIMESTAMP,
    is_discharged BOOLEAN
);

-- ============================================================
-- 1. Lookup Tables Clinical Assessment 
-- ============================================================

CREATE TABLE lkp_stemi_coronory_angiography (
	id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_stemi_coronory_angiography (name) VALUES
('Emergency'),
('Elective')

CREATE TABLE lkp_stemi_cv_risk_factor_master (
	id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_stemi_cv_risk_factor_master (name) VALUES
('Hypertension'),
('Diabetes mellitus'),
('Smoking or tobacco use'),
('Dyslipidemia'),
('Family history of CAD'),
('Obesity'),
('Previous MI or cardiac procedures');
('Others');


CREATE TABLE lkp_stemi_fmc_master (
	id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_stemi_fmc_master (name) VALUES
('PHC'),
('CHC'),
('Private Clinic/Hospital'),
('108 Ambulance'),
('Spoke Hospital'),
('Hub Hospital');

CREATE TABLE lkp_stemi_ecg_location_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_stemi_ecg_location_master (name) VALUES
('108 Ambulance'),
('By referring Hospital'),
('Inside Hospital');

CREATE TABLE lkp_stemi_diagnosis_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);
INSERT INTO lkp_stemi_diagnosis_master (name) VALUES
('Unstable Angina (No ST elevation, Troponin normal)'),
('NSTEMI (No ST elevation, Troponin raised)'),
('STEMI (ST elevation)'),
('Others Specify');

CREATE TABLE lkp_stemi_sign_symptom (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_sign_symptom (name) VALUES
('Chest pain / Discomfort'),
('Back / Epigastric Pain'),
('Lightheadedness'),
('Nausea/Vomiting'),
('Diaphoresis (Sweating)'),
('Palpitations'),
('Dyspnea'),
('Shortness of breath'),
('Syncope or Dizziness'),
('Others, please specify');
-- ============================================================
-- 2. Main Table - Clinical Assessment 
-- ============================================================

CREATE TABLE stemi_clinical_assessment (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER,
    symptom_onset_datetime TIMESTAMP,
    cv_risk_factors  INTEGER REFERENCES lkp_stemi_cv_risk_factor_master(id),
    signs_symtoms varchar(200),
    fmc_type INTEGER REFERENCES lkp_stemi_fmc_master(id),
    fmc_datetime TIMESTAMP,
    ecg_datetime TIMESTAMP,
    ecg_location INTEGER REFERENCES lkp_stemi_ecg_location_master(id),
    diagnosis INTEGER REFERENCES lkp_stemi_diagnosis_master(id),
    other_dignosis varchar(255)
);
ALTER TABLE public.stemi_clinical_assessment
ADD COLUMN risk_factors VARCHAR(255);
ALTER TABLE public.stemi_clinical_assessment
ADD COLUMN other_risk_factor VARCHAR(255);
-- ============================================================
-- 3. Lookup Tables Stemi Treatment
-- ============================================================

CREATE TABLE lkp_stemi_infarction_location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_infarction_location (name) VALUES
('Anterior wall MI V1-V6'),
('Anteroseptal MI V1-V4'),
('Extensive Anterior wall MI LI, aVL, V1-V6'),
('High lateral MI I, aVL'),
('Inferior wall MI LII, LIII, aVF'),
('Lateral wall MI LI, aVL, V5, V6'),
('Posterior wall MI V7, V8, V9'),
('Right Ventricular MI V3R-V6R');

CREATE TABLE lkp_stemi_loading_dose_location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_loading_dose_location (name) VALUES
('108 Ambulance'),
('By referring Hospital'),
('Inside Hospital');
('Not Given');

CREATE TABLE lkp_stemi_loading_dose_drug (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_loading_dose_drug (name) VALUES
('Chewable/Crushed aspirin - 300mg'),
('Clopidogrel - 300 mg'),
('Atrovastatin - 80 mg'),
('Rosuvastatin - 40 mg'),
('Clopidogrel - 600 mg'),
('Ticagrelor - 180 mg'),
('Prasugrel 60 mg');

CREATE TABLE lkp_stemi_thrombolysis_location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_thrombolysis_location (name) VALUES
('By referring Hospital'),
('Inside Hospital'),
('Not done, planned PPCI');
('Not done');

CREATE TABLE lkp_stemi_thrombolytic_agent (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_thrombolytic_agent (name) VALUES
('Streptokinase'),
('Tenecteplase (TNK tPA)'),
('Reteplase'),
('Alteplase');

CREATE TABLE lkp_stemi_thrombolysis_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_thrombolysis_outcome (name) VALUES
('Successful Thrombolysis (Pharmaco-invasive PCI)'),
('Failed Thrombolysis (Rescue PCI)');

CREATE TABLE lkp_stemi_treatment_strategy (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_treatment_strategy (name) VALUES
('Not suitable for PCI, Thrombolysis Stabilisation & CABG'),
('Not suitable for PCI, Conservative Management'),
('Suitable for PPCI'),
('Suitable for PCI, Direct Stenting'),
('Suitable for PCI, Predilataion & Stenting'),
('Sutiable for PCI, Thrombosuction');

CREATE TABLE lkp_stemi_conservative_management (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_conservative_management (name) VALUES
('Anti anginal drugs'),
('Analgesics'),
('Anti Platelet therapy'),
('Anti Coagulant therapy'),
('Lipid Lowering Therapy'),
('Oxygen therapy'),
('Statins'),
('Angiotensin converting enzyme inhibitors (ACEI)'),
('Angiotensin receptor blockers (ARB)'),
('Aldosterone Antagonist');

CREATE TABLE lkp_stemi_killip_risk_score (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_killip_risk_score (name) VALUES
('Class I: No evidence of heart failure - 5% mortality'),
(' Class II: Mild to moderate heart failure - 14% mortality'),
(' Class III: Rales more than half way up the lung fields, pulmonary edema - 32% mortality'),
('Class IV: Cardiogenic Shock - 58%');

CREATE TABLE lkp_stemi_transfer_location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_transfer_location (name) VALUES
('Post cath ICU'),
('Cardio - Throracic Vascular Suregery'),
('Ward');

CREATE TABLE lkp_stemi_pre_discharge_counselling (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_pre_discharge_counselling (name) VALUES
('Lifestyle modifications'),
('Physical activity'),
('Diet'),
('Weight reducation'),
('Psyco-Social Counselling'),
('Job counselling'),
('Sexual activity');

CREATE TABLE lkp_stemi_stent_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_stent_type (name) VALUES
('DES'),
('BOPA');

CREATE TABLE lkp_stemi_coronory_angiography (
	id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_stemi_coronory_angiography (name) VALUES
('Emergency'),
('Elective') 

CREATE TABLE lkp_stemi_complications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
INSERT INTO lkp_stemi_complications (name) VALUES
('No-reflow'),
('Cardiogenic shock'),
('Arrhythmia'),
('Pulmonary Edema'),
('Heart failure'),
('Papillary Muscle rupture'),
('Reinfarction'),
('Others, please specify');



-- ============================================================
-- 4. Main Tables - Stemi Treatment
-- ============================================================

CREATE TABLE stemi_treatment (
    id SERIAL PRIMARY KEY,
    triage_id int,
    stemi_confirmed_at TIMESTAMP,

    infarction_location_id INT REFERENCES lkp_stemi_infarction_location(id),
    loading_dose_location_id INT REFERENCES lkp_stemi_loading_dose_location(id),
    loading_dose_drug_id INT REFERENCES lkp_stemi_loading_dose_drug(id),
    loading_dose_time TIMESTAMP,

    thrombolysis_location_id INT REFERENCES lkp_stemi_thrombolysis_location(id),
    thrombolytic_agent_id INT REFERENCES lkp_stemi_thrombolytic_agent(id),
    thrombolysis_start TIMESTAMP,
    thrombolysis_end TIMESTAMP,
    thrombolysis_outcome_id INT REFERENCES lkp_stemi_thrombolysis_outcome(id),

    treatment_strategy_id INT REFERENCES lkp_stemi_treatment_strategy(id),
    management_id varchar(200),
    killip_risk_score_id INT REFERENCES lkp_stemi_killip_risk_score(id),

    planned_cag BOOLEAN,
    cath_lab_arrival TIMESTAMP,
    balloon_inflation TIMESTAMP,
    stent_type_id INT REFERENCES lkp_stemi_stent_type(id),

    complications TEXT,
    transfer_location_id INT REFERENCES lkp_stemi_transfer_location(id),
	counselling_id varchar(200),
    symptom_to_fmc varchar(255),     
    fmc_to_ecg VARCHAR(255),
    door_to_needle VARCHAR(255),
    door_to_balloon varchar(255),
    total_ischemic_time INT,

    icu_admission BOOLEAN,
    hospital_stay_days INT,
    in_hospital_complication TEXT,
    coronory_angiography_id INT
);
ALTER TABLE public.stemi_treatment
ADD COLUMN thrombolysis_not_done_reason VARCHAR(255);
ALTER TABLE public.stemi_treatment
ADD COLUMN thrombolysis_date TIMESTAMP;
ALTER TABLE public.stemi_treatment
ADD COLUMN other_complications VARCHAR(255);
ALTER TABLE public.stemi_treatment
ADD COLUMN loading_dose_administration_date TIMESTAMP;


-- ALTER table public.stemi_treatment
-- Alter Column door_to_balloon TYPE varchar(255)

-- ============================================================
-- 5. Lookup Tables - Stemi Outcome
-- ============================================================

CREATE TABLE lkp_stemi_outcome_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_outcome_type (name) VALUES
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital');

CREATE TABLE lkp_stemi_death_timing (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_death_timing (name) VALUES
('Death Before Treatment Initiated'),
('Death after PPCI'),
('Death after Thrombolysis'),
('Death after Pharmaco-invasive PCI'),
('Death after Rescue PCI'),
('Death after Medical Management'),
('Others, please specify');

CREATE TABLE lkp_stemi_hospital_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_hospital_type (name) VALUES
('TAEI'),
('Non TAEI');

CREATE TABLE lkp_stemi_referral_reason (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_referral_reason (name) VALUES
('Specialist Care Needed'),
('Interventional Facility not available'),
('Others (specify)');

CREATE TABLE lkp_stemi_patient_condition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_patient_condition (name) VALUES
('Stable'),
('Critical'),
('Very Critical');

-- ============================================================
-- 6. Main Tables - Stemi Outcome
-- ============================================================

CREATE TABLE stemi_outcome (
    id SERIAL PRIMARY KEY,
    triage_id INT ,

    outcome_type_id INT REFERENCES lkp_stemi_outcome_type(id),
    discharge_datetime TIMESTAMP,
    absconded_datetime TIMESTAMP,
    death_datetime TIMESTAMP,

    death_timing_id INT REFERENCES lkp_stemi_death_timing(id),
    cause_of_death TEXT,

    hospital_type_id INT REFERENCES lkp_stemi_hospital_type(id),
    destination_hospital VARCHAR(255), -- could later be linked to a hospital master table
    referral_reason_id INT REFERENCES lkp_stemi_referral_reason(id),
    patient_condition_id INT REFERENCES lkp_stemi_patient_condition(id),

    referring_doctor VARCHAR(150),
    documented_in_taei_case_sheet BOOLEAN,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.stemi_outcome
ADD COLUMN other_death_timing VARCHAR(255);
-- ============================================================
-- 7. Lookup Tables - NStemi Treatment
-- ============================================================

CREATE TABLE lkp_stemi_nstemi_loading_dose_location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_nstemi_loading_dose_location (name) VALUES
('108 Ambulance'),
('By referring Hospital'),
('Inside Hospital'),
('Not given');

CREATE TABLE lkp_stemi_nstemi_loading_dose_drug (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_nstemi_loading_dose_drug (name) VALUES
('Chewable/Crushed aspirin - 300mg'),
('Clopidogrel - 300 mg'),
('Atrovastatin - 80 mg'),
('Rosuvastatin - 40 mg'),
('Clopidogrel - 600 mg'),
('Ticagrelor - 180 mg'),
('Prasugrel 60 mg');

CREATE TABLE lkp_stemi_timi_risk_score (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_timi_risk_score (name) VALUES
('TIMI Risk Score: 0-1 - 5% estimated mortality'),
('TIMI Risk Score: 2 - 8% estimated mortality'),
('TIMI Risk Score: 3 - 13% estimated mortality'),
('TIMI Risk Score: 4 - 19% estimated mortality'),
('TIMI Risk Score: 5 - 26% estimated mortality'),
('TIMI Risk Score: 6-7 - 41% estimated mortality');

CREATE TABLE lkp_stemi_nstemi_treatment_strategy (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_nstemi_treatment_strategy (name) VALUES
('Conservative Management'),
('Conservative Management & Coronary angiogram'),
('Conservative Management & Coronary angiogram & PCI'),
('Conservative Management & Coronary angiogram & CABG');

-- ============================================================
-- 8. Main Tables - NStemi Treatment
-- ============================================================

CREATE TABLE nstemi_treatment (
    id SERIAL PRIMARY KEY,
    triage_id INT ,

    nstemi_confirmed_at TIMESTAMP,

    loading_dose_location_id INT REFERENCES lkp_stemi_nstemi_loading_dose_location(id),
    loading_dose_drug_id INT REFERENCES lkp_stemi_nstemi_loading_dose_drug(id),
    loading_dose_time TIMESTAMP,

    timi_risk_score_id INT REFERENCES lkp_stemi_timi_risk_score(id),
    treatment_strategy_id INT REFERENCES lkp_stemi_nstemi_treatment_strategy(id),

    cath_lab_arrival TIMESTAMP,
    balloon_inflation TIMESTAMP,
    stent_type_id INT REFERENCES lkp_stemi_stent_type(id),

    complications TEXT,
    transfer_location_id INT REFERENCES lkp_stemi_transfer_location(id),

    symptom_to_fmc varchar(255),  
    fmc_to_ecg varchar(255),

    icu_admission BOOLEAN,
    hospital_stay_days INT,
    in_hospital_complications TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    management_id varchar(200),
    coronory_angiography_id integer REFERENCES lkp_stemi_conservative_management(id),
    counselling_id varchar(200)
);
ALTER TABLE public.nstemi_treatment
ADD COLUMN loading_dose_administration_date TIMESTAMP;
ALTER TABLE public.nstemi_treatment
ADD COLUMN other_complications VARCHAR(255);
ALTER TABLE public.nstemi_treatment
ADD COLUMN planned_cag boolean;
ALTER table public.nstemi_treatment
ADD Column door_to_balloon VARCHAR(255);
-- ============================================================
-- 9. Lookup Tables - NStemi Outcome
-- ============================================================
CREATE TABLE lkp_stemi_nstemi_outcome_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_nstemi_outcome_type (name) VALUES
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital');

CREATE TABLE lkp_stemi_nstemi_death_timing (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_nstemi_death_timing (name) VALUES
('Death Before Treatment Initiated'),
('Death after Medical Management'),
('Death after Coronary angiogram'),
('Death after PCI'),
('Death after CABG'),
('Others, please specify');


-- ============================================================
-- 10. Main Tables - NStemi Outcome
-- ============================================================
CREATE TABLE nstemi_outcome (
    id SERIAL PRIMARY KEY,
    triage_id INT,

    outcome_type_id INT REFERENCES lkp_stemi_nstemi_outcome_type(id),
    discharge_datetime TIMESTAMP,
    absconded_datetime TIMESTAMP,
    death_datetime TIMESTAMP,

    death_timing_id INT REFERENCES lkp_stemi_nstemi_death_timing(id),
    cause_of_death TEXT,

    hospital_type_id INT REFERENCES lkp_stemi_hospital_type(id),
    destination_hospital VARCHAR(255), 
    referral_reason_id INT REFERENCES lkp_stemi_referral_reason(id),
    patient_condition_id INT REFERENCES lkp_stemi_patient_condition(id),

    referring_doctor VARCHAR(150),
    documented_in_taei_case_sheet BOOLEAN,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.nstemi_outcome
ADD COLUMN other_death_timing VARCHAR(255);
-- ============================================================
-- 11. Lookup Tables - angina Tratment
-- ============================================================
CREATE TABLE unstableangina_treatment (
    id SERIAL PRIMARY KEY,
    triage_id INT,

    ua_confirmed_at TIMESTAMP,

    loading_dose_location_id INT REFERENCES lkp_stemi_nstemi_loading_dose_location(id),
    loading_dose_drug_id INT REFERENCES lkp_stemi_nstemi_loading_dose_drug(id),
    loading_dose_time TIMESTAMP,
    timi_risk_score_id INT REFERENCES lkp_stemi_timi_risk_score(id),
    management_id varchar(300),
	counselling_id varchar(300),
    icu_admission BOOLEAN,
    hospital_stay_days INT,  -- auto-calculated in app layer
    in_hospital_complications TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    symptom_to_fmc VARCHAR(255),
    fmc_to_ecg VARCHAR(255),
);
ALTER TABLE public.unstableangina_treatment
ADD COLUMN loading_dose_administration_date TIMESTAMP;
ALTER TABLE public.unstableangina_treatment
ADD COLUMN other_complications VARCHAR(255);
ALTER TABLE public.unstableangina_treatment
ADD COLUMN coronory_angiography_id INT;
ALTER table public.unstableangina_treatment
ADD Column door_to_balloon VARCHAR(255);
ALTER table public.unstableangina_treatment
ADD Column complications VARCHAR(255);


-- ============================================================
-- 12. Lookup Tables - angina Outcome
-- ============================================================

CREATE TABLE unstableangina_outcome (
    id SERIAL PRIMARY KEY,
    triage_id INT,

    outcome_type_id INT REFERENCES lkp_stemi_nstemi_outcome_type(id),
    discharge_datetime TIMESTAMP,
    absconded_datetime TIMESTAMP,
    death_datetime TIMESTAMP,

    death_timing_id INT REFERENCES lkp_stemi_nstemi_death_timing(id),
    cause_of_death TEXT,

    hospital_type_id INT REFERENCES lkp_stemi_hospital_type(id),
    destination_hospital VARCHAR(255), 
    referral_reason_id INT REFERENCES lkp_stemi_referral_reason(id),
    patient_condition_id INT REFERENCES lkp_stemi_patient_condition(id),

    referring_doctor VARCHAR(150),
    documented_in_taei_case_sheet BOOLEAN,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.unstableangina_outcome
ADD COLUMN other_death_timing VARCHAR(255);
-------------------------------------------------------------------------------------------------

CREATE TABLE lkp_stemi_diagnosis_master_op (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_diagnosis_master_op (name) VALUES
('Unstable Angina (No ST elevation, Troponin normal)'),
('NSTEMI (No ST elevation, Troponin raised)'),
('STEMI (ST elevation)'),
('Others Specify');

CREATE TABLE op_patient (
    patient_id SERIAL PRIMARY KEY,
    -- taei_id VARCHAR(20),
    date_time_of_triage TIMESTAMP,--y
    name_of_patient VARCHAR(256), --y
    --age INTEGER REFERENCES lkp_triage_age(id),
    age int,
    age_year INTEGER,
    age_month INTEGER,
    fathername VARCHAR(256),--y
    mothername VARCHAR(256),--y
    gender INTEGER REFERENCES lkp_triage_gender(id), --Y
    patient_op_number varchar(100), --y
    marital_status INTEGER REFERENCES lkp_triage_marital_status(id), --y
    patient_mobile_number VARCHAR(15), --y
    education INTEGER REFERENCES lkp_triage_education(id),--y
    employment_status INTEGER REFERENCES lkp_triage_employment_status(id), --y
    occupation INTEGER REFERENCES lkp_triage_occupation(id), --y
    income VARCHAR(10), --y
    patient_ehr_id BOOLEAN, --Yes/No ??
    cmchis_card VARCHAR(155), --y
    abha_card VARCHAR(155), --y
    phr_id VARCHAR(155), --y
    hmis_id VARCHAR(155), --y
    address_line VARCHAR(256), --y
    district INTEGER REFERENCES lkp_district(id), --y
    state INTEGER REFERENCES lkp_state(id), --y
    pincode VARCHAR(8), --y
    institution_id INTEGER
    patient_admitted varchar(10),
    name_of_dept varchar(200),
    date_time_admission TIMESTAMP,
    date_time_admitting_dep TIMESTAMP,
    date_time_symptom_onset TIMESTAMP,
    presenting_complaints varchar(200), --lkp_stemi_sign_symptom
    known_cardiovascular_risk varchar(200), --lkp_stemi_cv_risk_factor_master
    other_risk_factors varchar(255),
    ecg_datetime TIMESTAMP,
    ecg_performed_by INTEGER REFERENCES lkp_stemi_ecg_location_master(id),
    dignosis_id INTEGER REFERENCES lkp_stemi_diagnosis_master_op(id),
    other_dignosis varchar(255),
    is_discharged BOOLEAN
);
CREATE TABLE lkp_stemi_others_catlab_procedure (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);

INSERT INTO lkp_stemi_others_catlab_procedure (name) VALUES
('PPI'),
('TPI'),
('PTMC'),
('ASD'),
('Cath Study'),
('PDA'),
('EPS'),
('BPV'),
('PPI RE'),
('PPI Gen Re'),
('Pericardial Tapping'),
('ICD'),
('Others: Please Specify');
CREATE TABLE stemi_others_treatment (
    id SERIAL PRIMARY KEY,
    triage_id INT,
    patient_id INT,
    is_procedure_done BOOLEAN,
    cathlab_arrival_date TIMESTAMP,
    hospital_stay INTEGER,
    procedure_id INTEGER,
    other_procedure varchar(255),
    outcome_type_id INT REFERENCES lkp_stemi_nstemi_outcome_type(id),
    discharge_datetime TIMESTAMP,
    absconded_datetime TIMESTAMP,
    death_datetime TIMESTAMP,

    death_timing_id INT REFERENCES lkp_stemi_nstemi_death_timing(id),
    cause_of_death TEXT,

    hospital_type_id INT REFERENCES lkp_stemi_hospital_type(id),
    destination_hospital VARCHAR(255), 
    referral_reason_id INT REFERENCES lkp_stemi_referral_reason(id),
    patient_condition_id INT REFERENCES lkp_stemi_patient_condition(id),

    referring_doctor VARCHAR(150),
    documented_in_taei_case_sheet BOOLEAN,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.stemi_outcome
ADD COLUMN other_referral_reason varchar(255);

ALTER TABLE public.nstemi_outcome
ADD COLUMN other_referral_reason varchar(255);

ALTER TABLE public.stemi_others_treatment
ADD COLUMN other_referral_reason varchar(255);

ALTER TABLE public.unstableangina_outcome
ADD COLUMN other_referral_reason varchar(255);


DROP FUNCTION IF EXISTS get_stemi_op_patient(integer, integer, integer,timestamp without time zone,timestamp without time zone);

CREATE OR REPLACE FUNCTION get_stemi_op_patient(
    p_limit INT,
    p_offset INT,
    p_hospital_id INT,
    p_start_date timestamp without time zone,
	p_end_date timestamp without time zone
)
RETURNS TABLE (
    	patient_id integer,
		patient_op_number  character varying,
        name_of_patient  character varying,
        gender text,
		patient_mobile_number  character varying,
		fathername character varying,
		mothername  character varying,
		name_of_dept  character varying,
    total_count INT
) AS $$
BEGIN
    RETURN QUERY
SELECT 
        tr.patient_id AS patient_id,            
		tr.patient_op_number,
        tr.name_of_patient,            -- Patient Name
        case when tr.gender=1 then 'Male'
			when tr.gender=2 then 'Female'
			when tr.gender=3 then 'Transgender'
			 else '' END
		AS gender,
		tr.patient_mobile_number as patient_mobile_number,
		tr.fathername as fathername,
		tr.mothername as mothername,
		tr.name_of_dept as name_of_dept,
        COUNT(*) OVER()::INT AS total_count
    FROM op_patient tr
        
    WHERE tr.institution_id = p_hospital_id and  tr.date_time_of_triage::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp
        ORDER BY tr.patient_id 
		LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;