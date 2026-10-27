-- Yes/No lookup
CREATE TABLE lkp_drw_yes_no (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10) UNIQUE NOT NULL
);

INSERT INTO lkp_drw_yes_no (name) VALUES ('Yes'), ('No');

-- Place of Incident
CREATE TABLE lkp_drw_place_of_incident (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_drw_place_of_incident (name) VALUES
('Ventilation'),
('Oxygen therapy'),
('Dialysis'),
('Temperature Management'),
('Others, please specify');

-- Type of Water
CREATE TABLE lkp_drw_type_of_water (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_drw_type_of_water (name) VALUES
('Freshwater'),
('Saltwater'),
('Stagnant'),
('Flowing'),
('Pool'),
('Tank'),
('Others, please specify');

-- Activity During Drowning
CREATE TABLE lkp_drw_activity_during_drowning (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_drw_activity_during_drowning (name) VALUES
('Bathing'),
('Swimming'),
('Fishing'),
('Boating'),
('Accidental Fall'),
('Suicide attempt'),
('Others, please specify');



-- Complication at Admission
CREATE TABLE lkp_drw_complication_at_admission (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);
INSERT INTO lkp_drw_complication_at_admission (name) VALUES
('ARDS'),
('Aspiration pneumonia'),
('Cerebral edema'),
('Metabolic acidosis'),
('Hypothermia'),
('Cardiac arrest'),
('Others');


-- Assessment
CREATE TABLE lkp_drw_assessment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
INSERT INTO lkp_drw_assessment (name) VALUES
('Mild'),
('Moderate'),
('Severe');
-- Interventions
CREATE TABLE lkp_drw_interventions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_drw_interventions (name) VALUES
('Intubation'),
('ICU care'),
('Others, please specify');
-- Supportive Care
CREATE TABLE lkp_drw_supportive_care (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
INSERT INTO lkp_drw_supportive_care (name) VALUES
('Ventilation'),
('Oxygen therapy'),
('Dialysis'),
('Temperature Management'),
('Others, please specify');
-- Complications Developed
CREATE TABLE lkp_drw_complications_developed (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);
INSERT INTO lkp_drw_complications_developed (name) VALUES
('ARDS'),
('Sepsis'), 
('MODS'),
('hypoxic encephalopathy'),
('Others, please specify');

CREATE TABLE lkp_drw_counselling_before_discharge (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);


--transaction table
CREATE TABLE drowning_cases (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER,
    -- Admission Details
    patient_admitted_id INT REFERENCES lkp_drw_yes_no(id),
    admitting_department VARCHAR(255),
    admission_datetime TIMESTAMP,

    -- Drowning Details
    place_of_incident_id INT REFERENCES lkp_drw_place_of_incident(id),
    type_of_water_id INT REFERENCES lkp_drw_type_of_water(id),
    activity_during_drowning_id INT REFERENCES lkp_drw_activity_during_drowning(id),

    -- Treatment & Management
    assessment_id INT REFERENCES lkp_drw_assessment(id),
    intervention_id INT REFERENCES lkp_drw_interventions(id),

    counselling_before_discharge_id INT REFERENCES lkp_drw_yes_no(id),
    discharge_datetime TIMESTAMP,

    duration_of_hospital_stay INTEGER,
    complications_admission varchar(255),
    supportive_care varchar(255),
    complications_developed varchar(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER table drowning_cases
ADD column date_time_entry TIMESTAMP

ALTER table drowning_cases
ADD column other_supportive_care varchar(255)

ALTER table drowning_cases
ADD column other_interventions varchar(255)

ALTER table drowning_cases
ADD column other_complications_developed varchar(255)

ALTER table drowning_cases
ADD column other_complication_admitted varchar(255)

ALTER table drowning_cases
ADD column other_activity varchar(255)

ALTER table drowning_cases
ADD column other_type_water varchar(255)

ALTER table drowning_cases
ADD column other_place varchar(255)


CREATE TABLE lkp_drowning_referral_reason (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL
);
INSERT INTO lkp_drowning_referral_reason (name) VALUES
('Specialist Care Needed'),
('Interventional Facility not available'),
('Others (specify)');
CREATE TABLE lkp_drowning_hospital_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);


INSERT INTO lkp_drowning_hospital_type (name) VALUES
('TAEI'),
('Non TAEI');

CREATE TABLE lkp_drowning_outcome_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO lkp_drowning_outcome_type (name) VALUES
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital');



CREATE TABLE lkp_drowning_patient_condition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO lkp_drowning_patient_condition (name) VALUES
('Stable'),
('Critical'),
('Very Critical');

CREATE TABLE drowning_outcome (
    id SERIAL PRIMARY KEY,
    triage_id INT,

    outcome_type_id INT REFERENCES lkp_drowning_outcome_type(id),
    is_discharged BOOLEAN,
    discharge_datetime TIMESTAMP,
    absconded_datetime TIMESTAMP,
    death_datetime TIMESTAMP,

    cause_of_death TEXT,

    hospital_type_id INT REFERENCES lkp_drowning_hospital_type(id),
    destination_hospital VARCHAR(255), 
    referral_reason_id INT REFERENCES lkp_drowning_referral_reason(id),
    patient_condition_id INT REFERENCES lkp_drowning_patient_condition(id),

    referring_doctor VARCHAR(150),
    documented_in_taei_case_sheet BOOLEAN,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER table drowning_outcome
ADD column other_reason_referral varchar(255);

