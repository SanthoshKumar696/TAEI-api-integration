-- ============================================================
-- 1. Lookup Tables
-- ============================================================

CREATE TABLE lkp_hanging_nature_of_incident (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_hanging_nature_of_incident (name) VALUES
('Accidental'),
('Homicidal'),
('Suicidal');

CREATE TABLE lkp_hanging_suspension_of_body (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_hanging_suspension_of_body (name) VALUES
('Complete Hanging'),
('Partial Hanging');

CREATE TABLE lkp_hanging_materials_used (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_hanging_materials_used (name) VALUES
('Ropes (Nylon/Jute/Coir)'),
('Soft Materials (Lungies, Sarees, Shawls, Bed Sheets, Dupattas)'),
('Other Materials (Electric wires and machine belts)');

CREATE TABLE lkp_hanging_symptoms_presentation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_hanging_symptoms_presentation (name) VALUES
('Unconsciousness or altered mental status'),
('Ligature mark around the neck'),
('Cyanosis (bluish skin)'),
('Petechiae (small red/purple spots on face/eyes)'),
('Swollen tongue or neck'),
('Respiratory distress or apnea'),
('Low pulse rate (bradycardia)'),
('Possible spinal injury');

CREATE TABLE lkp_hanging_interventions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_hanging_interventions (name) VALUES
('Intubation'),
('ICU care'),
('Others');

CREATE TABLE lkp_hanging_supportive_care_provided (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_hanging_supportive_care_provided (name) VALUES
('Ventilation'),
('Fluids'),
('Dialysis'),
('Any other please specify');

CREATE TABLE lkp_hanging_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(155) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_hanging_outcome (name) VALUES
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital');

-- ============================================================
-- 2. Main Table: hanging
-- ============================================================

CREATE TABLE hanging (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    date_time_of_entry TIMESTAMP NOT NULL,
    patient_admitted BOOLEAN,
    name_of_dept VARCHAR(256),
    date_of_admit TIMESTAMP,
    nature_of_incident INTEGER REFERENCES lkp_hanging_nature_of_incident(id),
    suspension_of_body INTEGER REFERENCES lkp_hanging_suspension_of_body(id),
    materials_used_for_hanging INTEGER REFERENCES lkp_hanging_materials_used(id),
    symptoms_at_presentation INT[],--INTEGER REFERENCES lkp_hanging_symptoms_presentation(id)
    interventions INTEGER REFERENCES lkp_hanging_interventions(id),
    oth_interventions VARCHAR(256),
    supportive_care_provided INTEGER REFERENCES lkp_hanging_supportive_care_provided(id),
    oth_supportive_care_provided VARCHAR(256),
    is_counselling_provided BOOLEAN,
    duration_of_hospital_stay INTEGER,
    user_id INT, 
    inserted_date TIMESTAMP,
    ref_form_id INT, 
    ref_id INT
);

-- ============================================================
-- Main Table: hanging_outcome (child of bites_stings)
-- ============================================================

CREATE TABLE hanging_outcome (
    id SERIAL PRIMARY KEY,
    hanging_id INTEGER NOT NULL REFERENCES hanging(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_hanging_outcome(id),
    is_discharged BOOLEAN,
    discharge_date TIMESTAMP,
    absconded_date TIMESTAMP,
    death_date TIMESTAMP,
    cause_of_death VARCHAR(256),
    hospital_type INTEGER REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_reason_for_referral(id),
    condition_of_patient INTEGER REFERENCES lkp_condition_of_patient(id),
    referring_doctor VARCHAR(256),
    documented_taei_sheet BOOLEAN
);