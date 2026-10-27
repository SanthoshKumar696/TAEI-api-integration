-- Lookup Table for Past History
CREATE TABLE lkp_emo_past_history (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('DM', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('HTN', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('Durg allergy', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('Drug abuse', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('alcohol abuse', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('seizures', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('Smoker', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('obesity', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('cancer', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('cardiac disease', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('psychiatric illness', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('Respiratory illness', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('h/o', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('Previous Surgeries', TRUE);
INSERT INTO lkp_emo_past_history (name, is_enabled) VALUES ('others.', TRUE);

-- Lookup Table for Emergency Category
CREATE TABLE lkp_emo_emergency_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    is_adult BOOLEAN,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_emergency_category (name, is_enabled, is_adult) VALUES
('TRAUMA',	true,	false),
('PREM -Trauma',	true,	true),
('BURNS',	true,	false),
('PREM Burns',	true,	true),
('POISONING',	true,	false),
('Bites & sting',	true, null),
('Hanging',	true, null	),
('Drowning',	true,	null),
('PREM',	true,	true),
('SCRIPT',	true,	false),
('MI /ACS',	true,	false),
('Others (specify)',	true,	false);

CREATE TABLE lkp_emo_trauma_treatment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_trauma_treatment (name) VALUES
('DAS'),
('DAOS'),
('DANS');

-- -- Lookup Table for ED DISPOSITION
-- CREATE TABLE lkp_emo_ed_disposition (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(50),
--     is_enabled BOOLEAN DEFAULT TRUE
-- );
-- INSERT INTO lkp_emo_ed_disposition (name, is_enabled) VALUES ('Treated as OP', TRUE);
-- INSERT INTO lkp_emo_ed_disposition (name, is_enabled) VALUES ('Sent to other Departments (Specify)', TRUE);
-- INSERT INTO lkp_emo_ed_disposition (name, is_enabled) VALUES ('Discharged', TRUE);
-- INSERT INTO lkp_emo_ed_disposition (name, is_enabled) VALUES ('AMA', TRUE);
-- INSERT INTO lkp_emo_ed_disposition (name, is_enabled) VALUES ('Absconded', TRUE);
-- INSERT INTO lkp_emo_ed_disposition (name, is_enabled) VALUES ('Transferred to Other Hospitals', TRUE);
-- INSERT INTO lkp_emo_ed_disposition (name, is_enabled) VALUES ('Death', TRUE);

CREATE TABLE lkp_emo_recall_info (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_recall_info (name) VALUES
('Normal'),
('Imapried');

CREATE TABLE lkp_emo_speech (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_speech (name) VALUES
('Normal'),
('Thick & Slurred'),
('Incoherent');

CREATE TABLE lkp_emo_gen_disposition (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_gen_disposition (name) VALUES
('Calm'), 
('Talkative'),
('Abbusive'),
('Aggressive');

CREATE TABLE lkp_emo_clothing (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_clothing (name) VALUES
('Decently Dressed'),
('Disorderd'),
('Soiled'),
('Torn');

CREATE TABLE lkp_emo_orientation_time (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_emo_orientation_time (name) VALUES
('Normal'),
('Delayed');

CREATE TABLE lkp_emo_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE,
    show_pillar Boolean DEFAULT(false)
);

INSERT INTO lkp_emo_outcome(name, show_pillar) VALUES
('Treated as OP', false),
('Sent to other Departments (Specify)', false),
('Discharged', false),
('Discharge at request',false),
('DAMA',false),
('Absconded',false),
('Death in ED',false),
('Transferred to ward',true),
('Transferred to ICU',true),
('Send to Pillars',true),
('Transferred to other hospital',true),
('Brought Dead',false);

-- Main Table
CREATE TABLE emo_triage (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    past_history INT[],--INTEGER REFERENCES lkp_emo_past_history(id),
    diagnosis VARCHAR(256),
    emergency_category INTEGER REFERENCES lkp_emo_emergency_category(id),
    oth_emergency_category VARCHAR(256),
    is_patient_smells_alcohol BOOLEAN,
    is_alcohol_consumption BOOLEAN,
    is_drunken_drive_history BOOLEAN,
    time_of_examination TIMESTAMP,
    memory INTEGER REFERENCES lkp_emo_recall_info(id),
    self_control INTEGER REFERENCES lkp_emo_recall_info(id),
    is_smell_in_breath BOOLEAN,
    is_urine_alchol_concentration BOOLEAN,
    speech INTEGER REFERENCES lkp_emo_speech(id),
    general_disposition INTEGER REFERENCES lkp_emo_gen_disposition(id),
    clothing INTEGER REFERENCES lkp_emo_clothing(id),
    reaction_time INTEGER REFERENCES lkp_emo_recall_info(id),
    orientation_time INTEGER REFERENCES lkp_emo_orientation_time(id),
    is_drug_abuse BOOLEAN,
    is_mlc BOOLEAN,
    ar_number VARCHAR(256),
    mlc_date DATE,
    mlc_time TIME,
    --ed_disposition INTEGER REFERENCES lkp_emo_ed_disposition(id),
    pain_scale VARCHAR(155),
    pain_score VARCHAR(25),
    treatment_given VARCHAR(256), 
    emo_trauma_treatment INTEGER REFERENCES lkp_emo_trauma_treatment(id),--If TRAUMA or PREM Trauma Further Treatment Handed over to 
    name_of_the_emo VARCHAR(256),
    user_id INT, 
    inserted_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emo_triage_outcome (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emo_id INTEGER NOT NULL REFERENCES emo_triage(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_emo_outcome(id),
    outcome_datetime TIMESTAMP,
    is_discharged BOOLEAN,
    -- treated_op_datetime TIMESTAMP,
    -- discharged_datetime TIMESTAMP,    
    -- dama_datetime TIMESTAMP,
    -- absconded_datetime TIMESTAMP,
    -- death_datetime TIMESTAMP,
    -- transferred_ward_datetime TIMESTAMP,
    -- transferred_ICU_datetime TIMESTAMP,
    -- sent_to_datetime TIMESTAMP,
    -- transferred_other_datetime TIMESTAMP,
    sent_to VARCHAR(256),
    hospital_type INTEGER REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_reason_for_referral(id),   
    condition_of_patient INTEGER REFERENCES lkp_condition_of_patient(id),
    referring_doctor_name VARCHAR(256)
);
