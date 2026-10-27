BEGIN;

-- ============================================================
-- Lookup Tables for Dropdown and Multiple Checkbox Fields
-- ============================================================

CREATE TABLE lkp_burns_type_of_burn (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_type_of_burn (name) VALUES
('Flame'),
-- ('Inhalation- Yes'),
-- ('Inhalation- No'),
('Scalds'),
('Electrical'),
('Chemical'),
('Acid Attack'),
('Cracker / Explosive'),
('Mixed'),
('Others - Specify');

CREATE TABLE lkp_burns_mode_of_injury (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_mode_of_injury (name) VALUES
('Accidental'),
('Suicidal'),
('Homicidal')
('Others - Specify');

CREATE TABLE lkp_burns_place_of_incident (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_place_of_incident (name) VALUES
('Home'),
('Work Place'),
('Religious'),
('Others - Specify');

CREATE TABLE lkp_burns_tbsa (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_tbsa (name) VALUES
('Head'),
('Neck'),
('Anterior Trunk'),
('Posterior Trunk'),
('Right Upper Limb'),
('Left Upper Limb'),
('Perineum'),
('Right Gluteal Region'),
('Left Gluteal Region'),
('Right Lower Limb'),
('Left Lower Limb');

CREATE TABLE lkp_burns_degree_of_burn (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_degree_of_burn (name) VALUES
('I'),
('II'),
('III'),
('IV'),
('Mixed');

CREATE TABLE lkp_burns_co_morbidities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_co_morbidities (name) VALUES
('DM'),
('HTN'),
('BA'),
('PTB'),
('EPILEPSY'),
('CAD'),
('CKD'),
('Others - Specify');

CREATE TABLE lkp_burns_wound_management (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_wound_management (name) VALUES
('Conservative'),
('Surgery - Emergency'),
('Surgery - Elective');

CREATE TABLE lkp_burns_conservative (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_conservative (name) VALUES
('SSD cream & closed dressing'),
('Collagen Dressing'),
('Other dressings');

CREATE TABLE lkp_burns_surgery_emergency (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_surgery_emergency (name) VALUES
('Fasciotomy'),
('Escharotomy'),
('Amputation'),
('Other Surgery');

CREATE TABLE lkp_burns_surgery_elective (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_surgery_elective (name) VALUES
('Collagen dressing'),
('Silver impregnated dressing'),
('Debridement / Escharectomy'),
('Allograft'),
('Early excision and SSG'),
('Auto graft'),
('Flap Cover'),
('Other Surgery');

CREATE TABLE lkp_burns_supportive_measures (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_supportive_measures (name) VALUES
('Psychological support'),
('Physiotherapy'),
('Splints');

CREATE TABLE lkp_burns_stay_complications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_stay_complications (name) VALUES
('Shock'),
('Sepsis'),
('Renal Failure'),
('Cardiac Complication'),
('Respiratory Complication'),
('Multiple Organ Dysfunction Syndrome'),
('Others');

CREATE TABLE lkp_burns_multidisciplinary_support (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_multidisciplinary_support (name) VALUES
('Anaesthesia'),
('Ophthalmology'),
('Cardiology'),
('OBG'),
('Paediatrics'),
('Psychiatry'),
('ENT'),
('Nephrology'),
('Neuro medicine'),
('Neurosurgery'),
('MGE'),
('General Medicine'),
('General Surgery'),
('Ortho'),
('Thoracic Medicine'),
('Dermatology'),
('SGE'),
('Vascular Surgery'),
('Others - Specify');

CREATE TABLE lkp_burns_no_of_hospital_stay (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_no_of_hospital_stay (name) VALUES
('OP'),
('IP');

CREATE TABLE lkp_burns_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_outcome (name) VALUES
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital'),
('Treated as OP');

CREATE TABLE lkp_burns_transferred_to (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_burns_transferred_to (name) VALUES
('WARD'),
('ICU'),
('No');

-- CREATE TABLE lkp_hospital_type (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256) NOT NULL UNIQUE,
--     is_enabled BOOLEAN DEFAULT TRUE
-- );

-- INSERT INTO lkp_hospital_type (name) VALUES
-- ('TAEI'),
-- ('Non TAEI');

-- CREATE TABLE lkp_destination_hospital (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256) NOT NULL UNIQUE,
--     is_enabled BOOLEAN DEFAULT TRUE
-- );

-- INSERT INTO lkp_destination_hospital (name) VALUES
-- ('Hospital listed should be viewed');

-- CREATE TABLE lkp_reason_for_referral (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256) NOT NULL UNIQUE,
--     is_enabled BOOLEAN DEFAULT TRUE
-- );

-- INSERT INTO lkp_reason_for_referral (name) VALUES
-- ('Specialist Care Needed'),
-- ('Interventional Facility not available'),
-- ('Others (specify)');

-- CREATE TABLE lkp_condition_of_patient (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256) NOT NULL UNIQUE,
--     is_enabled BOOLEAN DEFAULT TRUE
-- );

-- INSERT INTO lkp_condition_of_patient (name) VALUES
-- ('Stable'),
-- ('Critical'),
-- ('Very Critical');

-- ============================================================
-- Main Table: burns
-- ============================================================
CREATE TABLE burns (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    admitted BOOLEAN,
    admission_date TIMESTAMP,
    type_of_burn INT REFERENCES lkp_burns_type_of_burn(id),
    inhalation BOOLEAN,
    oth_type_of_burn VARCHAR(256),
    mode_of_injury INT REFERENCES lkp_burns_mode_of_injury(id),
    oth_mode_of_injury VARCHAR(256),
    place_of_incident INT REFERENCES lkp_burns_place_of_incident(id),
    oth_place_of_incident VARCHAR(256),
    tbsa INT[],-- REFERENCES lkp_burns_tbsa(id),
    tbsa_total_per VARCHAR(256),
    degree_of_burn INT REFERENCES lkp_burns_degree_of_burn(id),
    associated_injuries VARCHAR(256),
    co_morbidities INT[],-- REFERENCES lkp_burns_co_morbidities(id),
    is_pregnant BOOLEAN,
    is_fluid_resuscitation_given BOOLEAN, 
    is_mechanical_ventillation BOOLEAN,
    user_id INT, 
    inserted_date TIMESTAMP,
    ref_form_id INT, 
    ref_id INT
);

CREATE TABLE burns_tbsa (
    id SERIAL PRIMARY KEY,
    burns_id INT REFERENCES burns(id) ON DELETE CASCADE,
    head NUMERIC(5,2),
    neck NUMERIC(5,2),
    anterior_trunk NUMERIC(5,2),
    posterior_trunk NUMERIC(5,2),
    right_gluteal NUMERIC(5,2),
    left_gluteal NUMERIC(5,2),
    genital NUMERIC(5,2),
    right_arm NUMERIC(5,2),
    left_arm NUMERIC(5,2),
    right_forearm NUMERIC(5,2),
    left_forearm NUMERIC(5,2),
    right_hand NUMERIC(5,2),
    left_hand NUMERIC(5,2),
    right_thigh NUMERIC(5,2),
    left_thigh NUMERIC(5,2),
    right_leg NUMERIC(5,2),
    left_leg NUMERIC(5,2),
    right_foot NUMERIC(5,2),
    left_foot NUMERIC(5,2)
);

CREATE TABLE burns_surgery_elective (
    id SERIAL PRIMARY KEY,
    burns_id INT REFERENCES burns(id) ON DELETE CASCADE,
    surgery_elective INT REFERENCES lkp_burns_surgery_elective(id),
    oth_surgery_elective VARCHAR(256),
    surgery_elective_date TIMESTAMP
);

-- ============================================================
-- Main Table: burns_values (child of burns)
-- ============================================================
CREATE TABLE burns_values (
    id SERIAL PRIMARY KEY,
    burns_id INT REFERENCES burns(id) ON DELETE CASCADE,
    -- vital_signs_gcs DECIMAL(10,2),
    -- vital_signs_pulse DECIMAL(10,2),
    -- vital_signs_bp DECIMAL(10,2),
    -- vital_signs_spo2 DECIMAL(10,2),
    -- vital_signs_rr DECIMAL(10,2),
    -- vital_signs_temp DECIMAL(10,2),
    wound_management INT REFERENCES lkp_burns_wound_management(id),
    wound_management_conservative BOOLEAN,
    conservative INT REFERENCES lkp_burns_conservative(id), 
    hyper_baric BOOLEAN,
    hyper_baric_nos INT,
    oth_conservative VARCHAR(256),
    surgery_emergency INT REFERENCES lkp_burns_surgery_emergency(id),
    oth_surgery_emergency VARCHAR(256),
    is_surgery_emergency BOOLEAN,
    surgery_performed_date TIMESTAMP,
    is_surgery_elective_performed BOOLEAN,
    --surgery_elective INT REFERENCES lkp_burns_surgery_elective(id),
    --surgery_elective_date TIMESTAMP,
    supportive_measures INT[],-- REFERENCES lkp_burns_supportive_measures(id),
    complications_hospital_stay INT[], --REFERENCES lkp_burns_stay_complications(id),
    multidisciplinary_support INT[],-- REFERENCES lkp_burns_multidisciplinary_support(id),
    oth_multidisciplinary_support VARCHAR(256),
    skin_bank_available BOOLEAN,
    skin_bank_available_value VARCHAR(256)
);

-- ============================================================
-- Main Table: burns_outcome (child of burns)
-- ============================================================
CREATE TABLE burns_outcome (
    id SERIAL PRIMARY KEY,
    burns_id INT REFERENCES burns(id) ON DELETE CASCADE,
    outcome INT REFERENCES lkp_burns_outcome(id),
    is_discharged BOOLEAN,
    discharge_date TIMESTAMP,
    absconded_date TIMESTAMP,
    death_date TIMESTAMP,
    causeofdeath VARCHAR(256),
    transferred_to INT REFERENCES lkp_burns_transferred_to(id),
    ward_datetime TIMESTAMP,
    ward_name VARCHAR(256),
    icu_datetime TIMESTAMP,
    --icu_name VARCHAR(256),
    hospital_type INT REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INT REFERENCES lkp_reason_for_referral(id),
    condition_of_patient INT REFERENCES lkp_condition_of_patient(id),
    referring_doctor_name VARCHAR(256),
    documented_taei_sheet BOOLEAN,
    patient_exit_date TIMESTAMP
    -- referred VARCHAR(256),
    -- death BOOLEAN,
    -- date_of_death TIMESTAMP,
    -- dama VARCHAR(256)
);

COMMIT;
