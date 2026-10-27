-- ============================================================
-- 1. Lookup Tables
-- ============================================================

CREATE TABLE lkp_poison_type_of_poisoning (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_type_of_poisoning (name) VALUES
('Accidental'),
('Intentional (Self Harm)'),
('Homicidal'),
('Occupational'),
('Unknown');

CREATE TABLE lkp_poison_route_of_exposure (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_route_of_exposure (name) VALUES
('Ingestion'),
('Inhalation'),
('Dermal/skin contact'),
('Injection');

CREATE TABLE lkp_poison_substance_involved (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_substance_involved (name) VALUES
('Insecticide Poisoning'),
('Plant Poisoning'),
('Weed Killer Poisoning'),
('Herbicide Poisoning'),
('Corrosive Poisoning'),
('Copper Sulphate Poisoning'),
('Cell Oil Poisoning'),
('Artificial Cow Dung Powder Poisoning'),
('Hair Dye Poisoning'),
('Rodenticide Poisoning'),
('Tablet Overdose'),
('Substance abuse'),
('Toxic gases'),
('Kerosene'),
('Mosquito Repellent'),
('Camphor');

CREATE TABLE lkp_poison_substance_involved_sub (
    id SERIAL PRIMARY KEY,
    substance_involved_id INTEGER REFERENCES lkp_poison_substance_involved(id),
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_poison_substance_involved_sub (substance_involved_id, name) VALUES
(1, 'Organophosphates Poisoning'),
(1, 'Organocarbamate Poisoning'),
(1, 'Pyrethroid'),
(1, 'Crane Killer Poisoning'),
(1, 'Organochloride Poisoning'),
(1, 'Other (specify)'),
(2, 'Oleander Seed Poisoning (Yellow)'),
(2, 'Oduvanthalai Poisoning'),
(2, 'Datura Poisoning'),
(2, 'Abrus Precatareous Poisoning'),
(2, 'Kanuli Kaelangu Poisoning'),
(2, 'Other (specify)'),
(3, 'Paraquat Poisoning'),
(3, 'Other (specify)'),
(4, 'Other (specify)'),
(5, 'Acid'),
(5, 'Alkali'),
(5, 'Other (specify)'),
(10, 'Cake'),
(10, 'Powder'),
(10, 'Paste'),
(11, 'Tricyclic Antidepressants Overdose'),
(11, 'Antipsychotic Drugs Overdose'),
(11, 'Anticonvulsants Overdose'),
(11, 'Benzodiazepines Overdose'),
(11, 'Beta Channel Blockers Overdose'),
(11, 'Calcium Channel Blockers Overdose'),
(11, 'Oral Antidiabetic Drug Overdose'),
(11, 'Paracetamol poisoning'),
(11, 'Other (specify)'),
(12, 'Alcohol'),
(12, 'Cannabis sativa (marijuana)'),
(12, 'Other (specify)');

CREATE TABLE lkp_poison_source_of_substance (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_source_of_substance (name) VALUES
('Home'),
('Workplace'),
('Market'),
('Online');

CREATE TABLE lkp_poison_symptoms_presentation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_symptoms_presentation (name) VALUES
('Nausea, vomiting, abdominal pain'),
('Diarrhea'),
('Drowsiness or unconsciousness'),
('Confusion or agitation'),
('Difficulty breathing or slow breathing'),
('Seizures'),
('Burns or redness around the mouth/lips (from corrosive substances)'),
('Chemical smell on breath'),
('Abnormal pupil size (constricted or dilated)'),
('Bluish skin (cyanosis) or pallor'),
('Irregular heartbeat or low/high blood pressure'),
('Others, please specify');

CREATE TABLE lkp_poison_severity_of_poisoning (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_severity_of_poisoning (name) VALUES
('Mild'),
('Moderate'),
('Severe');

CREATE TABLE lkp_poison_decontamination (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_decontamination (name) VALUES
('No Decontamination Required'),
('Eye Irrigation'),
('Gastric lavage'),
('Activated Charcoal - Single Dose'),
('Activated Charcoal - Multiple Dose'),
('Whole Bowel Irrigation'),
('Skin Decontamination');

CREATE TABLE lkp_poison_supportive_care_provided (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_supportive_care_provided (name) VALUES
('Ventilation'),
('Fluids'),
('Dialysis'),
('PLEX'),
('Any other please specify');

CREATE TABLE lkp_poison_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_poison_outcome (name) VALUES
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital'),
('Treated as OP');

-- CREATE TABLE lkp_poison_transferred_to (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256) NOT NULL,
--     is_enabled BOOLEAN DEFAULT TRUE
-- );
-- INSERT INTO lkp_poison_transferred_to (name) VALUES
-- ('Ward'),
-- ('Other Hospital'),
-- ('Others, please specify');


-- ============================================================
-- 1. Main Table: poisons
-- ============================================================

CREATE TABLE poisons (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    date_time_of_entry TIMESTAMP,
    patient_admitted BOOLEAN,
    name_of_dept VARCHAR(256),
    date_of_admit TIMESTAMP,
    type_of_poisoning INTEGER REFERENCES lkp_poison_type_of_poisoning(id),
    route_of_exposure INTEGER REFERENCES lkp_poison_route_of_exposure(id),
    substance_involved INTEGER REFERENCES lkp_poison_substance_involved(id),
    substance_involved_sub INTEGER REFERENCES lkp_poison_substance_involved_sub(id),
	oth_substance_involved VARCHAR(256),
    brand_or_product_name VARCHAR(256),
    quantity VARCHAR(256),
    source_of_substance INTEGER REFERENCES lkp_poison_source_of_substance(id),
    symptoms_at_presentation INT[],--INTEGER REFERENCES lkp_poison_symptoms_presentation(id)
    time_of_onset_of_symptoms TIMESTAMP,
    time_elapsed_exposure_symptom VARCHAR(256),
    investigations_performed VARCHAR(256),
    severity_of_poisoning INTEGER REFERENCES lkp_poison_severity_of_poisoning(id),
    --skin_decontamination BOOLEAN,-- REFERENCES lkp_poison_skin_decontamination(id),
    decontamination INT[],--INTEGER REFERENCES lkp_poison_decontamination(id),
    antidote_administered_name VARCHAR(256),
    antidote_administered_dosage VARCHAR(256),
    antidote_administered_timing TIMESTAMP,
    supportive_care_provided INT[],--INTEGER REFERENCES lkp_poison_supportive_care_provided(id),
    no_of_cycles_performed INTEGER,
    counselling_provided BOOLEAN,
    duration_of_hospital_stay INTEGER,
    user_id INT, 
    inserted_date TIMESTAMP,
    ref_form_id INT, 
    ref_id INT
);

-- ============================================================
-- 2. Child Table: poisons_outcome
-- ============================================================

CREATE TABLE poisons_outcome (
    id SERIAL PRIMARY KEY,
    poison_id INTEGER NOT NULL REFERENCES poisons(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_poison_outcome(id),
    is_discharged BOOLEAN,
    discharge_date TIMESTAMP,
    absconded_date TIMESTAMP,
    death_date TIMESTAMP,
    cause_of_death VARCHAR(256),
    --transferred_to INTEGER REFERENCES lkp_poison_transferred_to(id),
    -- ward_datetime TIMESTAMP,
    -- ward_name VARCHAR(256),
    -- icu_datetime TIMESTAMP,
    -- icu_name VARCHAR(256),
    hospital_type INTEGER REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_reason_for_referral(id),
    oth_reason_for_referral VARCHAR(256),
    condition_of_patient INTEGER REFERENCES lkp_condition_of_patient(id),
    referring_doctor VARCHAR(256),
    documented_taei_sheet BOOLEAN,
    patient_exit_date TIMESTAMP
);
