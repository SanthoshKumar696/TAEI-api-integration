-- CREATE TABLE lkp_triage_age (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(256),
--     is_enabled BOOLEAN DEFAULT TRUE
-- );

-- INSERT INTO lkp_triage_age (name, is_enabled) VALUES ('<1', TRUE);
-- INSERT INTO lkp_triage_age (name, is_enabled) VALUES ('1-18', TRUE);
-- INSERT INTO lkp_triage_age (name, is_enabled) VALUES ('19-120', TRUE);
-- INSERT INTO lkp_triage_age (name, is_enabled) VALUES ('120 & above', TRUE);

CREATE TABLE lkp_triage_gender (
    id SERIAL PRIMARY KEY,
    name VARCHAR(12),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_gender (name, is_enabled) VALUES ('Male', TRUE);
INSERT INTO lkp_triage_gender (name, is_enabled) VALUES ('Female', TRUE);
INSERT INTO lkp_triage_gender (name, is_enabled) VALUES ('Transgender', TRUE);

CREATE TABLE lkp_triage_marital_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_marital_status (name, is_enabled) VALUES ('Single', TRUE);
INSERT INTO lkp_triage_marital_status (name, is_enabled) VALUES ('Married', TRUE);
INSERT INTO lkp_triage_marital_status (name, is_enabled) VALUES ('NA', TRUE);

CREATE TABLE lkp_triage_education (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('Illiterate', TRUE);
INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('Primary (1-5)', TRUE);
INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('Upper Primary (6-8) Secondary (9-10)', TRUE);
INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('Higher Secondary (11-12)', TRUE);
INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('Graduate', TRUE);
INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('Post Graduate & Above', TRUE),
INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('Student', TRUE),
INSERT INTO lkp_triage_education (name, is_enabled) VALUES ('NA', TRUE);

CREATE TABLE lkp_triage_employment_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_employment_status (name, is_enabled) VALUES ('Employed', TRUE);
INSERT INTO lkp_triage_employment_status (name, is_enabled) VALUES ('Unemployed', TRUE);
INSERT INTO lkp_triage_employment_status (name, is_enabled) VALUES ('Dependent', TRUE);
INSERT INTO lkp_triage_employment_status (name, is_enabled) VALUES ('Retired', TRUE);
INSERT INTO lkp_triage_employment_status (name, is_enabled) VALUES ('Student', TRUE);
INSERT INTO lkp_triage_employment_status (name, is_enabled) VALUES ('Homemaker', TRUE);
INSERT INTO lkp_triage_employment_status (name, is_enabled) VALUES ('NA', TRUE);

CREATE TABLE lkp_triage_occupation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_occupation (name, is_enabled) VALUES ('Skilled', TRUE);
INSERT INTO lkp_triage_occupation (name, is_enabled) VALUES ('Semi skilled', TRUE);
INSERT INTO lkp_triage_occupation (name, is_enabled) VALUES ('Unskilled', TRUE);
INSERT INTO lkp_triage_occupation (name, is_enabled) VALUES ('ESI card Holder', TRUE);
INSERT INTO lkp_triage_occupation (name, is_enabled) VALUES ('Unorganised sector', TRUE);
INSERT INTO lkp_triage_occupation (name, is_enabled) VALUES ('Nil', TRUE);
INSERT INTO lkp_triage_occupation (name, is_enabled) VALUES ('NA', TRUE);

CREATE TABLE lkp_triage_patienr_recieved_from (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_patienr_recieved_from (name) VALUES
('Home'),
('Health Care Facility Govt'),
('Health Care Facility Private'),
('OPD'),
('others (specify)');

CREATE TABLE lkp_triage_mode_of_arrival (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_mode_of_arrival (name) VALUES
('108'),
('Pvt Ambulance'),
('Public Transport'),
('Car'),
('Taxi'),
('Auto'),
('Self'),
('Twowheler'),
('Others');

CREATE TABLE lkp_triage_source_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_source_type (name) VALUES
('Private'),
('TAEI Centre'),
('Non TAEI GH'),
('Govt hospital'),
('PHC');

CREATE TABLE lkp_triage_scene_ift (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_triage_scene_ift (name)  VALUES
('scene'),
('IFT');

CREATE TABLE lkp_triage_reason_for_referral (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_reason_for_referral (name, is_enabled) VALUES ('Specialist Care Needed', TRUE);
INSERT INTO lkp_triage_reason_for_referral (name, is_enabled) VALUES ('Interventional Facility not available', TRUE);
INSERT INTO lkp_triage_reason_for_referral (name, is_enabled) VALUES ('Others (specify)', TRUE);

CREATE TABLE lkp_triage_condition_of_patient (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_condition_of_patient (name, is_enabled) VALUES ('Stable', TRUE);
INSERT INTO lkp_triage_condition_of_patient (name, is_enabled) VALUES ('Critical', TRUE);
INSERT INTO lkp_triage_condition_of_patient (name, is_enabled) VALUES ('Very Critical', TRUE);
INSERT INTO lkp_triage_condition_of_patient (name, is_enabled) VALUES ('death', TRUE);

CREATE TABLE lkp_triage_patient_stable (
    id SERIAL PRIMARY KEY,
    name VARCHAR(15),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_triage_patient_stable (name)  VALUES
('Stablized'),
('Not Stablized');

CREATE TABLE lkp_triage_place_of_incident (
    id SERIAL PRIMARY KEY,
    name VARCHAR(15),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_place_of_incident (name, is_enabled) VALUES ('Home', TRUE);
INSERT INTO lkp_triage_place_of_incident (name, is_enabled) VALUES ('Public', TRUE);
INSERT INTO lkp_triage_place_of_incident (name, is_enabled) VALUES ('Work', TRUE);
INSERT INTO lkp_triage_place_of_incident (name, is_enabled) VALUES ('School', TRUE);
INSERT INTO lkp_triage_place_of_incident (name, is_enabled) VALUES ('Farm', TRUE);
INSERT INTO lkp_triage_place_of_incident (name, is_enabled) VALUES ('Field', TRUE);
INSERT INTO lkp_triage_place_of_incident (name, is_enabled) VALUES ('Other', TRUE);

CREATE TABLE lkp_triage_dtls_accompanied_by (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_accompanied_by (name, is_enabled) VALUES ('Family Member', TRUE);
INSERT INTO lkp_triage_dtls_accompanied_by (name, is_enabled) VALUES ('Police', TRUE);
INSERT INTO lkp_triage_dtls_accompanied_by (name, is_enabled) VALUES ('Unknown Person', TRUE);
INSERT INTO lkp_triage_dtls_accompanied_by (name, is_enabled) VALUES ('Self', TRUE);
INSERT INTO lkp_triage_dtls_accompanied_by (name, is_enabled) VALUES ('Relatative', TRUE);
INSERT INTO lkp_triage_dtls_accompanied_by (name, is_enabled) VALUES ('others', TRUE);

CREATE TABLE lkp_triage_dtls_burns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_burns (name, is_enabled) VALUES ('Pain Score', TRUE);
INSERT INTO lkp_triage_dtls_burns (name, is_enabled) VALUES ('Redness', TRUE);
INSERT INTO lkp_triage_dtls_burns (name, is_enabled) VALUES ('Swelling', TRUE);
INSERT INTO lkp_triage_dtls_burns (name, is_enabled) VALUES ('Blisters', TRUE);
INSERT INTO lkp_triage_dtls_burns (name, is_enabled) VALUES ('Breathing difficulty', TRUE);

CREATE TABLE lkp_triage_dtls_poisoning_bites_stings_hanging (
    id SERIAL PRIMARY KEY,
    name VARCHAR(75),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Nausea or vomiting', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Abdominal pain', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Diarrhea', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Drowsiness or unconsciousness', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Confusion or agitation', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Difficulty breathing', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Seizures', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Burns or redness aroundthe mouth', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('lips (from corrosive substances)', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Chemical smell on breath', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Abnormal pupil size (constricted or dilated)', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Bluish skin (cyanosis) or pallor', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Irregular heartbeat', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Altered mental status', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Fang marks at the site', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Bruising or blistering around the bite', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Numbness or tingling', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Vision problems ordrooping eyelids (neurotoxic bites)', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Visible puncture wounds or lacerations', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Bleeding', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Swelling and redness', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Itching', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Swelling of face, lips, or throat', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Hives or widespread rash', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Ligature mark around the neck', TRUE);
INSERT INTO lkp_triage_dtls_poisoning_bites_stings_hanging (name, is_enabled) VALUES ('Swollen tongue or neck', TRUE);

CREATE TABLE lkp_triage_dtls_script (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_script (name, is_enabled) VALUES ('Giddiness or Numbness', TRUE);
INSERT INTO lkp_triage_dtls_script (name, is_enabled) VALUES ('Seizure', TRUE);
INSERT INTO lkp_triage_dtls_script (name, is_enabled) VALUES ('Balance problem', TRUE);
INSERT INTO lkp_triage_dtls_script (name, is_enabled) VALUES ('Eye signs', TRUE);
INSERT INTO lkp_triage_dtls_script (name, is_enabled) VALUES ('Face deviation', TRUE);
INSERT INTO lkp_triage_dtls_script (name, is_enabled) VALUES ('Arm weakness', TRUE);
INSERT INTO lkp_triage_dtls_script (name, is_enabled) VALUES ('Speech disturbance', TRUE);

CREATE TABLE lkp_triage_dtls_mi_acs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Chest pain or Discomfort', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Back or Epigastric Pain', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Lightheadedness', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Nausea or Vomiting', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Diaphoresis (Sweating)', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Palpitations', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Dyspnea', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Shortness of breath', TRUE);
INSERT INTO lkp_triage_dtls_mi_acs (name, is_enabled) VALUES ('Syncope or Dizziness', TRUE);

CREATE TABLE lkp_triage_dtls_pc_medical_emergency (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Altered Sensorium', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Chest Pain', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Limb Weakness', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Seizure', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Giddiness', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Abdominal Pain', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Acute Gastroenteritis', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Bites', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Stings', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Hanging', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Drowning', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Electrocution', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Poisoning', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Breathlessness', TRUE);
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Others (specify)', TRUE);

CREATE TABLE lkp_triage_dtls_pc_surgical_emergency (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('RTA', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('TTA', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Assault', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Self Fall', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Fall of object on the patients (includes Wall collapse & tree fallen)', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Self-inflicted injury', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Accidental Injury', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Workspot Injury', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Agricultural Machinery Injury', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Fall from Height', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Burns', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Abdominal Pain', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Foregin body', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Electrocution', TRUE);
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Others (Specify)', TRUE);

CREATE TABLE lkp_triage_dtls_presenting_complaints (
    id SERIAL PRIMARY KEY,
    name VARCHAR(155),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_triage_dtls_presenting_complaints (name)  VALUES
('Fever'),
('Focus'),
('Cough'),
('Cold'),
('Acute Watery Diarrhoes'),
('Vomiting'),
('Altered level of consciousness (Lethargy/incessant cry/not as usual/excessive sleepiness)'),
('Noisy breathing (Stridor)'),
('Breathlessness'),
('Unresponsive'),
('Regained baseline consciousness'),
('Foreign Body ingestion'),
('Snake bite'),
('Scorpion Sting'),
('Insect bite'),
('Dog bite'),
('Bleed'),
('Rash'),
('Acute Abdomen'),
('Trauma'),
('Burns'),
('Poison'),
('Submersion'),
('Seizures'),
('Others (specify)');

CREATE TABLE lkp_triage_dtls_cause (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_triage_dtls_cause (name)  VALUES
('Vehicular Collission'),
('Building Collapse'),
('Fire Accident'),
('Poisonous Gas inhalation'),
('Food Poisoning'),
('Others');

CREATE TABLE lkp_triage_dtls_avpu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_avpu (name, is_enabled) VALUES ('A-Alert', TRUE);
INSERT INTO lkp_triage_dtls_avpu (name, is_enabled) VALUES ('V- Verbal', TRUE);
INSERT INTO lkp_triage_dtls_avpu (name, is_enabled) VALUES ('P- Pain', TRUE);
INSERT INTO lkp_triage_dtls_avpu (name, is_enabled) VALUES ('U-Unresponsiveness', TRUE);

CREATE TABLE lkp_triage_dtls_breathing_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_breathing_status (name, is_enabled) VALUES ('normal', TRUE);
INSERT INTO lkp_triage_dtls_breathing_status (name, is_enabled) VALUES ('no breathing', TRUE);
INSERT INTO lkp_triage_dtls_breathing_status (name, is_enabled) VALUES ('Assisted Ventilation', TRUE);
INSERT INTO lkp_triage_dtls_breathing_status (name, is_enabled) VALUES ('Nasal flaring', TRUE);
INSERT INTO lkp_triage_dtls_breathing_status (name, is_enabled) VALUES ('Grunting', TRUE);
INSERT INTO lkp_triage_dtls_breathing_status (name, is_enabled) VALUES ('Use of accessory muscles', TRUE);
INSERT INTO lkp_triage_dtls_breathing_status (name, is_enabled) VALUES ('Noisy Breathing', TRUE);

CREATE TABLE lkp_triage_dtls_triage_flag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_triage_flag (name, is_enabled) VALUES ('Red', TRUE);
INSERT INTO lkp_triage_dtls_triage_flag (name, is_enabled) VALUES ('Yellow', TRUE);
INSERT INTO lkp_triage_dtls_triage_flag (name, is_enabled) VALUES ('Green', TRUE);
INSERT INTO lkp_triage_dtls_triage_flag (name, is_enabled) VALUES ('Black', TRUE);


CREATE TABLE lkp_triage_dtls_work_spot_injury (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_work_spot_injury (name, is_enabled) VALUES ('Organised sector (ESI Card)', TRUE);
INSERT INTO lkp_triage_dtls_work_spot_injury (name, is_enabled) VALUES ('Non-organized sector - Tamil Nadu', TRUE);
INSERT INTO lkp_triage_dtls_work_spot_injury (name, is_enabled) VALUES ('Other state', TRUE);


CREATE TABLE lkp_triage_dtls_rta (
    id SERIAL PRIMARY KEY,
    name VARCHAR(15),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_rta (name, is_enabled) VALUES ('Two-wheeler', TRUE);
INSERT INTO lkp_triage_dtls_rta (name, is_enabled) VALUES ('Four-Wheeler', TRUE);
INSERT INTO lkp_triage_dtls_rta (name, is_enabled) VALUES ('No Vehicle', TRUE);


CREATE TABLE lkp_triage_dtls_rta_rider_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(10),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_triage_dtls_rta_rider_type (name, is_enabled) VALUES ('Rider', TRUE);
INSERT INTO lkp_triage_dtls_rta_rider_type (name, is_enabled) VALUES ('Pillion', TRUE);

--------------------------------------------------------------------------------------------------------------

CREATE TABLE triage (
    id SERIAL PRIMARY KEY,
    -- taei_id VARCHAR(20),
    date_time_of_triage TIMESTAMP,
    type_of_patient BOOLEAN,
    name_of_patient VARCHAR(256),
    --age INTEGER REFERENCES lkp_triage_age(id),
    age_year INTEGER,
    age_month INTEGER,
    fathername VARCHAR(256),
    mothername VARCHAR(256),
    gender INTEGER REFERENCES lkp_triage_gender(id),
    marital_status INTEGER REFERENCES lkp_triage_marital_status(id),
    patient_mobile_number VARCHAR(15),
    education INTEGER REFERENCES lkp_triage_education(id),
    employment_status INTEGER REFERENCES lkp_triage_employment_status(id),
    occupation INTEGER REFERENCES lkp_triage_occupation(id),
    income VARCHAR(10),
    patient_ehr_id INTEGER, --Yes/No ??
    cmchis_card VARCHAR(155),
    abha_card VARCHAR(155),
    phr_id VARCHAR(155),
    hmis_id VARCHAR(155),
    esi_card VARCHAR(155),
    address_line VARCHAR(256),  
    district INTEGER REFERENCES lkp_district(id),
    state INTEGER REFERENCES lkp_state(id),
    pincode VARCHAR(8),
    patienr_recieved_from INTEGER REFERENCES lkp_triage_patienr_recieved_from(id),
    oth_patienr_recieved_from VARCHAR(155),
    mode_of_arrival INTEGER REFERENCES lkp_triage_mode_of_arrival(id),
    scene_ift INTEGER REFERENCES lkp_triage_scene_ift(id),
    source_type INTEGER REFERENCES lkp_triage_source_type(id),
    source_hospital VARCHAR(256),
    destination_hospital VARCHAR(256),
    reason_for_referral INTEGER REFERENCES lkp_triage_reason_for_referral(id),
    oth_reason_for_referral VARCHAR(256),
    referral_doctor_name VARCHAR(155),
    condition_of_patient INTEGER REFERENCES lkp_triage_condition_of_patient(id),
    is_patient_stable_ift  INTEGER REFERENCES lkp_triage_patient_stable(id),
    --date_and_time_of_pai_received VARCHAR(256),
    --pai_given_by VARCHAR(256),
    --pai_received_by_name_of_nurse VARCHAR(256),
    date_and_time_of_incident TIMESTAMP,
    place_of_incident INTEGER REFERENCES lkp_triage_place_of_incident(id),
    oth_place_of_incident VARCHAR(256),
    institution_id INTEGER,
    user_id INT, 
    inserted_date TIMESTAMP
);

CREATE TABLE triage_by_108 (
    id SERIAL PRIMARY KEY,
	triage_id INTEGER REFERENCES triage(id),
    call_id VARCHAR(256),
    district_name VARCHAR(256),
    taluk VARCHAR(256),
    city_name VARCHAR(256),
    base_location VARCHAR(256),
    vehicle_number VARCHAR(256),
    vehicle_assigned_date_time TIMESTAMP,
    chief_complaint VARCHAR(256),
    emergency_type VARCHAR(256),
    emergency_sub_type VARCHAR(256),
    temperature VARCHAR(256),   
    pulse VARCHAR(256),
    rr VARCHAR(256),
    bp_sbp VARCHAR(256),
    bp_dbp VARCHAR(256),
    pupil_right VARCHAR(256),
    pupil_left VARCHAR(256),
    loc VARCHAR(256),
    condition_of_patient VARCHAR(256),
    is_out_ar_mlc_number BOOLEAN,
    out_ar_mlc_number_tx VARCHAR(256)
);

CREATE TABLE triage_dtls (
    id SERIAL PRIMARY KEY,
	triage_id INTEGER REFERENCES triage(id),
    accompanied_by INTEGER REFERENCES lkp_triage_dtls_accompanied_by(id),
    pc_medical_emergency INT[], --INTEGER REFERENCES lkp_triage_dtls_pc_medical_emergency(id),
    oth_pc_medical_emergency VARCHAR(256),
    pc_surgical_emergency INTEGER REFERENCES lkp_triage_dtls_pc_surgical_emergency(id),
    oth_pc_surgical_emergency VARCHAR(256),
    presenting_complaints_prem INT[],--INTEGER REFERENCES lkp_triage_dtls_presenting_complaints(id),
    mass_casuality BOOLEAN,
    mass_casuality_tx INTEGER,
    cause INTEGER REFERENCES  lkp_triage_dtls_cause(id),
    avpu INTEGER REFERENCES lkp_triage_dtls_avpu(id),
    pulse INTEGER,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    spo2 INTEGER,
    temperature DECIMAL(5, 2),    
    brought_dead BOOLEAN,
    triage_flag INTEGER REFERENCES lkp_triage_dtls_triage_flag(id),
    if_red_team_call_out BOOLEAN,
    is_patient_triaged_queue BOOLEAN,
    prem_op_ticket_docs BOOLEAN,
    triage_done_by VARCHAR(256),
    work_spot_injury INTEGER REFERENCES lkp_triage_dtls_work_spot_injury(id),
    rta INTEGER REFERENCES lkp_triage_dtls_rta(id),
    rta_helmet BOOLEAN,
    rta_rider_type INTEGER REFERENCES lkp_triage_dtls_rta_rider_type(id)
);