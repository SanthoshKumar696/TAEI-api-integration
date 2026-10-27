
--Lookup Create table
-- =========================
-- LOOKUP TABLES
-- =========================
-- CREATE TABLE lkp_prem_breathlessness_with_alc (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
-- CREATE TABLE lkp_prem_unresponsive (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
-- CREATE TABLE lkp_prem_foreign_body (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
-- CREATE TABLE lkp_prem_snake_bite (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
-- CREATE TABLE lkp_prem_scorpion_bite (id SERIAL PRIMARY KEY, name VARCHAR(200), is_enabled BOOLEAN DEFAULT TRUE);
-- CREATE TABLE lkp_prem_insect_bite (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_presenting_complaints (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_airway (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_breathing (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_circulation_hr (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_perfusion (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_liver_span (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_systolic_bp (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_map (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_disability (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_tone_posture (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_eye_position_movements (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_pupils (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_development (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_diagnosis (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_diagnosis_ref (id SERIAL PRIMARY KEY, name VARCHAR(255), diagnosis_id INT REFERENCES lkp_prem_diagnosis(id), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_triage_flag (id SERIAL PRIMARY KEY, name VARCHAR(50), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_procedures_done (id SERIAL PRIMARY KEY, name VARCHAR(255), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_outcome (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE lkp_prem_stabilised_referral (id SERIAL PRIMARY KEY, name VARCHAR(100), is_enabled BOOLEAN DEFAULT TRUE);

--Lookup Insert 
-- INSERT INTO lkp_prem_breathlessness_with_alc (name) VALUES ('Hours'), ('Days'), ('Episodic'), ('Chronic');
-- INSERT INTO lkp_prem_unresponsive (name) VALUES ('Convulsions'), ('Posturing'), ('Upward gaze');
-- INSERT INTO lkp_prem_foreign_body (name) VALUES ('Throat'), ('Nose'), ('Ear');
-- INSERT INTO lkp_prem_snake_bite (name) VALUES ('Asymptomatic'), ('Signs of envenomation'), ('Respiratory arrest'), ('Bleeding with shock');
-- INSERT INTO lkp_prem_scorpion_bite (name) VALUES
-- ('Scorpion with autonomic storm'),
-- ('Scorpion sting with normotensive cardiogenic shock'),
-- ('Scorpion sting with hypotensive cardiogenic shock');
-- INSERT INTO lkp_prem_insect_bite (name) VALUES ('Angioedema'), ('Anaphylactic shock');

INSERT INTO lkp_prem_presenting_complaints (name) VALUES 
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

INSERT INTO lkp_prem_airway (name) VALUES ('Stable'), ('Unstable'), ('Obstructed'), ('ET');
INSERT INTO lkp_prem_breathing (name) VALUES ('Normal'), ('Respiratory distress'), ('Impending respiratory failure'), ('Apnea');
INSERT INTO lkp_prem_circulation_hr (name) VALUES ('HR Normal'), ('Tachycardia'), ('Relative bradycardia'), ('Bradycardia');
INSERT INTO lkp_prem_perfusion (name) VALUES ('Normal'), ('Warm shock'), ('Cool shock');
INSERT INTO lkp_prem_liver_span (name) VALUES ('Normal'), ('Hepatomegaly');
INSERT INTO lkp_prem_systolic_bp (name) VALUES ('Normal'), ('High'), ('Low');
INSERT INTO lkp_prem_map (name) VALUES ('Normal'), ('High'), ('Low');
INSERT INTO lkp_prem_disability (name) VALUES ('Alert'), ('Voice'), ('Pain'), ('Unresponsive');
INSERT INTO lkp_prem_tone_posture (name) VALUES ('Normal'), ('Abnormal');
INSERT INTO lkp_prem_eye_position_movements (name) VALUES ('Mid position'), ('Conjugate deviation'), ('Nystagmus'), ('Lid twitch');
INSERT INTO lkp_prem_pupils (name) VALUES ('Equal reacting to light'), ('Unequal'), ('Pin point'), ('Dilated not reacting');
INSERT INTO lkp_prem_development (name) VALUES ('Normal'), ('Delayed');
INSERT INTO lkp_prem_diagnosis (name) VALUES ('Croup/Epiglotitis/RP Abscess/Parapharyngeal abscess/Foreign Body'),('Dengue shock'),('Septic cardiogenic shock'),('Pneumonia'),
('Bronchiolitis'),('Asthma'),('Congenital Heart Disease'),('Acute Diarrheal disorder'),('Status Epilepticus'),('Meningoencephalitis'),('Anaphylaxis/AEFI'),
('Trauma'),('Poisoning'),('Envenomation / Bites & Sting'),('Drowning'),('Burns'),('Nephrotic Syndrome'),('Malignancy'),('Blood disorders'),('Others');

INSERT INTO lkp_prem_diagnosis_ref (diagnosis_id, name) VALUES
(1, 'UAO without hypoxia requiring etiology management'),
(1, 'UAO with hypoxia requiring CPAP with JR, management of etiology'),
(1, 'UAO with hypoxia & vasodilatory shock requiring fluids/ inotrope'),
(1, 'UAO requiring BVM, fluid bolus, Epinephrine bolus, management of etiology'),
(2, 'Dengue without shock'),
(2, 'Dengue shock responsive to oxygen via JR & fluids'),
(2, 'Dengue shock requiring O2 via JR, fluids and inotrope/Epinephrine, whole blood'),

(3, 'Fluid responsive'),
(3, 'Fluid refractory Dopamine responsive'),
(3, 'Fluid refractory, Dopamine refractory, Nor-Adrenaline responsive'),
(3, 'Fluid refractory, Adrenaline responsive septic cardiogenic shock'),

(4, 'Pneumonia without hypoxia'),
(4, 'Pneumonia with hypoxia requiring O2 via JR'),
(4, 'Pneumonia with hypoxia & vasodilatory shock requiring fluid bolus , inotrope'),
(4, 'Pneumonia requiring oxygen via NIV,Intubation, fluid boluses, dopamine , catecholamine infusion'),

(5, 'Bronchiolitis without hypoxia'),
(5, 'Bronchiolitis with hypoxia requiring O2 via JR'),
(5, 'Bronchiolitis with hypoxia & vasodilatory shock requiring fluid bolus , inotrope'),
(5, 'Bronchiolitis requiring oxygen via NIV/Intubation, fluid boluses, dopamine , catecholamine infusion'),

(6, 'Salbutamol responsive acute severe asthma'),
(6, 'Salbutamol+ Ipravent + Magnesium Sulphate responsive life threatening asthma'),
(6, 'Salbutamol+ Ipravent + Magnesium Sulphate refractory, SQ Epinehrine + Aminophylline requiring near fatal asthma'),

(7, 'CHD with CCF'),
(7, 'CHD with cardiogenic shock requiring O2 via JR, fluid bolus, inotrope infusion'),

(8, 'Fluid responsive hypovolemic shock'),
(8, 'Fluid and epinephrine requiring hypotensive hypovolemic shock'),

(9, 'Bag valve mask or Jackson Rees responsive & Fluid responsive shock (small volume) with Benzodiazepine responsive status epilepticus'),
(9, 'BVM or Jackson Rees or intubation responsive & Fluid responsive (small volume) and inotrope responsive shock with Benzodiazepine and Leviteracetam refractory / Sodium Valproate refractory Midazolam responsive status epilepticus'),

(10, 'Bag valve mask or Jackson Rees responsive & Fluid responsive shock (large volume) with Benzodiazepine responsive status epilepticus'),
(10, 'BVM or Jackson Rees or intubation responsive & Fluid responsive (large volume) and inotrope responsive shock with Benzodiazepine and Leviteracetam refractory / Sodium Valproate refractory Midazolam responsive status epilepticus'),

(11, 'Anaphylactic shock requiring oxygen via BVM/ JR, Fluid bolus therapy, epinephrine infusion'),

(15, 'Envenomation without hypoxia, shock requiring ASV and wound care'),
(15, 'Envenomation with hypoxia and shock requiring BVM, fluid bolus (small volume), catecholamine, ASV and wound care, blood products'),

(13, 'Trauma requiring injury care'),
(13, 'Trauma requiring BVM/ ET, fluid bolus, inotrope, ICP care'),

(14, 'Poisoning with normal physiological status requiring decontamination, elimination, antidote, monitoring'),
(14, 'Poisoning requiring BVM, shock resuscitation, decontamination, elimination, antidote, monitoring');

INSERT INTO lkp_prem_triage_flag (name) VALUES ('Red'), ('Yellow'), ('Green'), ('Black');
INSERT INTO lkp_prem_procedures_done (name) VALUES
('Oxygen through NRBM'),
('Oxygen through JR'),
('Oxygen through BVM'),
('Oxygen through ET'),
('Oxygen through CPAP'),
('MDI with Spacer'),
('Nebulisation'),
('Airway maneuvers: Head tilt, chin lift, Oro-pharyngeal suction, Nasogastric decompression'),
('IV access/ Intra-osseous access'),
('Fluid bolus'),
('Dopamine infusion'),
('IV Epinephrine bolus/ Infusion/ SQ Epinephrine'),
('CPR Chest compressions 15:2'),
('Anticonvulsant: BDP/ Leviteracetam/ Sodium Valproate/ MDZ/ Phenobarbitone'),
('Catheterization'),
('Under monitoring using PREM Case record'),
('T. Prazosin for Scorpion'),
('Anti-snake venom infusion');

INSERT INTO lkp_prem_outcome (name) VALUES 
('Treated as OP'),
('Discharged'),
('Discharged at request'),
('Death'),
('DAMA'),
('Absconded'),
('Transferred To other Hospital');

INSERT INTO lkp_prem_stabilised_referral (name) VALUES 
('Stabilised'),
('Not stabilised');

-- ==============================
-- Main Table
-- ==============================
CREATE TABLE prem (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    date_time_of_entry TIMESTAMP NOT NULL,
    patient_admitted BOOLEAN,
    name_of_dept VARCHAR(256),
    date_of_admit TIMESTAMP,
    is_prem_casesheet_used BOOLEAN,
    presenting_complaints_prem INT[],--INTEGER REFERENCES lkp_prem_presenting_complaints(id),
    oth_presenting_complaints_prem VARCHAR(256),
    temperature NUMERIC(5,2),
	approx_weight NUMERIC(5,2),
	cbg NUMERIC(6,2),
    development INT REFERENCES lkp_prem_development(id),
    co_morbid_conditions BOOLEAN,
    triage_flag INT REFERENCES lkp_prem_triage_flag(id),
    user_id INT, 
    inserted_date TIMESTAMP,
    ref_form_id INT, 
    ref_id INT
  );

-- prem_vitals
CREATE TABLE prem_vitals (
    id SERIAL PRIMARY KEY,
    prem_id INT REFERENCES prem(id) ON DELETE CASCADE,   
    airway INT REFERENCES lkp_prem_airway(id),
    breathing INT REFERENCES lkp_prem_breathing(id),
    circulation_hr INT REFERENCES lkp_prem_circulation_hr(id),
    perfusion INT REFERENCES lkp_prem_perfusion(id),
    liver_span INT REFERENCES lkp_prem_liver_span(id),
    systolic_bp INT REFERENCES lkp_prem_systolic_bp(id),
    map INT REFERENCES lkp_prem_map(id),
    disability INT REFERENCES lkp_prem_disability(id),
    tone_posture INT REFERENCES lkp_prem_tone_posture(id),
    eye_position_movements INT REFERENCES lkp_prem_eye_position_movements(id),
    pupils INT REFERENCES lkp_prem_pupils(id),    
    diagnosis INT REFERENCES lkp_prem_diagnosis(id),
    diagnosis_refvalue INT REFERENCES lkp_prem_diagnosis_ref(id),
    procedures_done INT[],-- REFERENCES lkp_prem_procedures_done,
    treatment_given VARCHAR(256)
);


-- ============================================================
-- Main Table: prem_outcome (child of prem)
-- ============================================================
  
CREATE TABLE prem_outcome (
    id SERIAL PRIMARY KEY,
    prem_id INTEGER NOT NULL REFERENCES prem(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_prem_outcome(id),
    shifted_to_picu BOOLEAN,
    is_discharged BOOLEAN,
    discharge_date TIMESTAMP,
    absconded_date TIMESTAMP,
    death_date TIMESTAMP,
    cause_of_death VARCHAR(256),
    patient_exit_date TIMESTAMP,
    hospital_type INTEGER REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_reason_for_referral(id),
    condition_of_patient INTEGER REFERENCES lkp_condition_of_patient(id),
    referring_doctor VARCHAR(256),
    patient_stabilised_referral INTEGER REFERENCES lkp_prem_stabilised_referral(id)
);