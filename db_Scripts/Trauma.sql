BEGIN;

-- ============================================================
-- Lookup Tables
-- ============================================================

-- 1) trauma lookups

CREATE TABLE IF NOT EXISTS lkp_trauma_mechanism_of_injury (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_mechanism_of_injury (name) VALUES
('Isolated'),
('Polytrauma')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_type_of_injury (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_type_of_injury (name) VALUES
('Road Traffic injury'),
('Train Traffic Injury'),
('Fall from height'),
('Fall - slipped & fell on floor'),
('Assault'),
('Self-inflicted injury'),
('Accidental injury'),
('Fire Arm'),
('Sport'),
('Fall of object on the patients (includes Wall collapse & tree fallen)'),
('Workspot injury'),
('Agricultural machinery injury'),
('Others')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_rta (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_rta (name) VALUES
('Two-wheeler'),
('Four-Wheeler'),
('No Vehicle')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_assault (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_assault (name) VALUES
('Known'),
('Unknown'),
('Domestic Violence')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_workspot_injury (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_workspot_injury (name) VALUES
('Organised sector (ESI Card)'),
('Non-organized sector - Tamil Nadu'),
('Other state')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_injuries_identified (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_injuries_identified (name) VALUES
('Contusion'),
('Abrasion'),
('Laceration'),
('Hematoma'),
('Stab Injury'),
('Puncture wound'),
('Bull Gore Injury'),
('Fracture'),
('Dislocation'),
('Nerve Damage'),
('Vascular Injury'),
('Degloving injury'),
('Dental'),
('others (specify)')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_part_of_the_body_injured (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_part_of_the_body_injured (name) VALUES
('Head'),
('Face'),
('Right Eye'),
('Left Eye'),
('Both Eyes'),
('ENT Right'),
('ENT Left'),
('ENT(B/L)'),
('Neck'),
('Chest Back'),
('Chest Front'),
('Abdomen Back'),
('Abdomen Front'),
('Perineum & Genitalia'),
('Upper Limb Right'),
('Upper Limb Left'),
('Both Upper Limbs'),
('Lower Limb Right'),
('Lower Limb Left'),
('Both Lower Limb'),
('Both Upper and Lower Limbs'),
('Spine'),
('Pelvis'),
('Upper limb(Unilateral)'),
('Upper Limb (Bilateral)'),
('Lower limb (Unilateral)'),
('Lower Limb (Bilateral)'),
('Right Shoulder'),
('Left Shoulder'),
('Both Shoulders'),
('Buttock Injury’s'),
('Hip'),
('Knee'),
('Left Ear'),
('Right Ear'),
('Feet'),
('Not Applicable'),
('Others')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_gcs_eye (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_gcs_eye (name) VALUES
('No response'),
('Response to pain'),
('Response to voice or speech'),
('Spontaneous response')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_gcs_verbal (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_gcs_verbal (name) VALUES
('No response'),
('Incomprehensible words - cries - moans to pain'),
('Inappropriate words - cries to pain'),
('Confused-Irritable, cries'),
('Oriented-coos, babbles')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_gcs_motor (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_gcs_motor (name) VALUES
('No response'),
('Extension to pain-Decerebrate posturing to pain'),
('Flexion to pain-Decorticate posturing to pain'),
('Withdraws to pain'),
('Localises painful stimulus-withdraws to touch'),
('Obeys Commands-Moves spontaneously')
ON CONFLICT (name) DO NOTHING;

-- 2) trauma_values lookups

CREATE TABLE IF NOT EXISTS lkp_trauma_flag (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_flag (name) VALUES
('Red'),
('Yellow'),
('Green')
ON CONFLICT (name) DO NOTHING;

-- 3) trauma_final lookups

CREATE TABLE IF NOT EXISTS lkp_trauma_speciality_opinion (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_speciality_opinion (name) VALUES
('Neuro-surgery (NS)'),
('Cardiothoracic surgery (CTS)'),
('Vascular surgery'),
('Surgical Gastroenterology (SGE)'),
('Urology'),
('Cardiology'),
('Nephrology'),
('Anaesthesiologist'),
('General Surgeon'),
('General Physician'),
('Orthopaedic surgeon'),
('ENT surgeon'),
('Plastic surgeon'),
('Ophthalmologist'),
('OFMS')
ON CONFLICT (name) DO NOTHING;


CREATE TABLE IF NOT EXISTS lkp_trauma_cpr (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_cpr (name) VALUES
('On Arrival'),
('During Hospital Stay')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_mech_intubation_dtls (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_mech_intubation_dtls (name) VALUES
('CPAP'),
('ET Intubation')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_oth_procedure_done (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_oth_procedure_done (name) VALUES
('Cervical Collar'),
('Defibrillation'),
('Tracheostomy'),
('Cricothyroidotomy'),
('Needle Thoracostomy'),
('Finger Thoracostomy'),
('ICD'),
('Peripheral Venous Access'),
('Central Venous Access'),
('Intraosseous Access'),
('Venous Cut down'),
('Antishock garment'),
('Pelvic Binder'),
('Splinting'),
('POP'),
('Wound Suturing'),
('Wound Dressing'),
('Others Specify')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_management (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_management (name) VALUES
('Conservative Management'),
('Surgical Management')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_type_of_surgery (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_type_of_surgery (name) VALUES
('Elective'),
('Emergency')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_surgery_done_under (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS lkp_trauma_surgery_type (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_surgery_type (name) VALUES
('Major'),
('Minor')
ON CONFLICT (name) DO NOTHING;

INSERT INTO lkp_trauma_surgery_done_under (name) VALUES
('Local Anesthesia'),
('General Anesthesia'),
('No Anesthesia')
ON CONFLICT (name) DO NOTHING;

-- 4) transferred_to lookups

CREATE TABLE IF NOT EXISTS lkp_trauma_outcome (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_outcome (name) VALUES
('Treated as OP'),
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital')
ON CONFLICT (name) DO NOTHING;

-- CREATE TABLE IF NOT EXISTS lkp_trauma_transferred_to (
--     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     name VARCHAR(256) NOT NULL UNIQUE,
--     is_enabled BOOLEAN DEFAULT TRUE
-- );

-- INSERT INTO lkp_trauma_transferred_to (name) VALUES
-- ('WARD'),
-- ('ICU'),
-- ('OT'),
-- ('OTHER HOSPITAL')
-- ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_hospital_type (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_hospital_type (name) VALUES
('TAEI'),
('Non TAEI')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_destination_hospital (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_destination_hospital (name) VALUES
('Hospital listed should be viewed - ask Anbu to get the data')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_reason_for_referral (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_reason_for_referral (name) VALUES
('Specialist Care Needed'),
('Interventional Facility not available'),
('Others (specify)')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS lkp_trauma_condition_of_patient (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_condition_of_patient (name) VALUES
('Stable'),
('Critical'),
('Very Critical')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Main Tables
-- ============================================================

-- 1) TRAUMA
CREATE TABLE IF NOT EXISTS trauma (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    patient_admitted BOOLEAN,
    name_of_dept VARCHAR(256),
    date_time_of_entry TIMESTAMP,
    mechanism_of_injury INTEGER REFERENCES lkp_trauma_mechanism_of_injury(id),
    type_of_injury INTEGER REFERENCES lkp_trauma_type_of_injury(id),
    oth_type_of_injury VARCHAR(256),
    rta INTEGER REFERENCES lkp_trauma_rta(id),
    rta_helmet BOOLEAN,
    rta_seatbelt BOOLEAN,
    ikt_availed BOOLEAN,
    assault INTEGER REFERENCES lkp_trauma_assault(id),
    workspot_injury INTEGER REFERENCES lkp_trauma_workspot_injury(id),
    injuries_identified INT[],--INTEGER REFERENCES lkp_trauma_injuries_identified(id),
    oth_injuries_identified VARCHAR(256),
    part_of_the_body_injured INT[],--INTEGER REFERENCES lkp_trauma_part_of_the_body_injured(id),
    oth_body_injured VARCHAR(256),
    gcs_eye INTEGER REFERENCES lkp_trauma_gcs_eye(id),
    gcs_verbal INTEGER REFERENCES lkp_trauma_gcs_verbal(id),
    gcs_motor INTEGER REFERENCES lkp_trauma_gcs_motor(id),
    gcs_total VARCHAR(256),
    user_id INT, 
    inserted_date TIMESTAMP
);

-- 2) TRAUMA_VALUES (child of trauma)
CREATE TABLE IF NOT EXISTS trauma_values (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trauma_id INTEGER NOT NULL REFERENCES trauma(id) ON DELETE CASCADE,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    rr DECIMAL(10,2),
    rts_autogenerate DECIMAL(10,2),
    trauma_flag INTEGER REFERENCES lkp_trauma_flag(id),
    admitted BOOLEAN,
    ecg BOOLEAN,
    ecgfindings VARCHAR(256),
    xray BOOLEAN,
    xray_date_time TIMESTAMP,
    xrayfindings VARCHAR(256),
    efast BOOLEAN,
    efast_date_time TIMESTAMP,
    efastfindings VARCHAR(256),
    ct BOOLEAN,
    ct_date_time TIMESTAMP,
    ctfindings VARCHAR(256),
    mri BOOLEAN,
    mri_date_time TIMESTAMP,
    mrifindings VARCHAR(256),
    abg BOOLEAN,
    abg_date_time TIMESTAMP,
    abgfindings VARCHAR(256),
    blood_investigation BOOLEAN,
    blood_date_time TIMESTAMP,
    hcg BOOLEAN,
    hcg_date_time TIMESTAMP,
    urine_test BOOLEAN,
    urine_date_time TIMESTAMP,
    oth_specify VARCHAR(256),
    oth_date_time TIMESTAMP
);

-- 3) TRAUMA_FINAL (child of trauma)
CREATE TABLE IF NOT EXISTS trauma_final (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trauma_id INTEGER NOT NULL REFERENCES trauma(id) ON DELETE CASCADE,
    speciality_opinion INT[],--INTEGER REFERENCES lkp_trauma_speciality_opinion(id),
    iscpr BOOLEAN,
    cpr_done INTEGER REFERENCES lkp_trauma_cpr(id),
    blood_transfusion_done BOOLEAN,
    on_arrival_nerve_blocks BOOLEAN,
    mech_intubation BOOLEAN,
    mech_intubation_dtls INTEGER REFERENCES lkp_trauma_mech_intubation_dtls(id),
    first_pass_intubation BOOLEAN,
    other_procedure_done INTEGER REFERENCES lkp_trauma_oth_procedure_done(id),
    oth_procedure_done VARCHAR(256),
    final_diagnosis VARCHAR(256),
    management INTEGER REFERENCES lkp_trauma_management(id),
    type_of_surgery INTEGER REFERENCES lkp_trauma_type_of_surgery(id),
    surgery_type INTEGER REFERENCES lkp_trauma_surgery_type(id),
    surgery_name VARCHAR(256),
	date_time TIMESTAMP,
	surgery_takenup_from_incident_date INTEGER,
	surgery_takenup_from_triage_date INTEGER,
	name_of_surgery VARCHAR(256),
    surgery_done_by VARCHAR(256),
    --TODO:- one more field clarification requested
    surgery_done_under INTEGER REFERENCES lkp_trauma_surgery_done_under(id),
    rehabilitation_required BOOLEAN
);

-- 4) TRANSFERRED_TO (child of trauma)
CREATE TABLE IF NOT EXISTS trauma_outcome (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trauma_id INTEGER NOT NULL REFERENCES trauma(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_trauma_outcome(id),    
    is_discharged BOOLEAN,
    -- transferred_to INTEGER REFERENCES lkp_trauma_transferred_to(id),
    discharge_datetime TIMESTAMP,
    discharge_details VARCHAR(256),
    hospital_type INTEGER REFERENCES lkp_trauma_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_trauma_reason_for_referral(id),
    condition_of_patient INTEGER REFERENCES lkp_trauma_condition_of_patient(id),
    referring_doctor_name VARCHAR(256),
    taei_case_documented BOOLEAN,
    name_of_doctor VARCHAR(256),
    stayed_duration INTEGER
);

COMMIT;
