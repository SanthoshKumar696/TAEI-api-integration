--Triage

ALTER TABLE triage ADD COLUMN esi_card VARCHAR(155)

--EMO
CREATE TABLE lkp_emo_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_emo_outcome(name) VALUES
('Treated as OP'),
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death in ED'),
('Transferred to ward'),
('Transferred to ICU'),
('Sent To'),
('Transferred to other hospital');


CREATE TABLE IF NOT EXISTS emo_triage_outcome (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emo_id INTEGER NOT NULL REFERENCES emo_triage(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_emo_outcome(id),
    outcome_datetime TIMESTAMP,
    sent_to VARCHAR(256),
    hospital_type INTEGER REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_reason_for_referral(id),   
    condition_of_patient INTEGER REFERENCES lkp_condition_of_patient(id),
    referring_doctor_name VARCHAR(256)
);

--Trauma

ALTER TABLE trauma ADD COLUMN rta_seatbelt BOOLEAN;

--Trauma_outcome    
ALTER TABLE trauma_outcome ALTER COLUMN destination_hospital TYPE VARCHAR(256); --Need to delete FK
ALTER TABLE trauma_outcome ADD COLUMN destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid);

--Burns_outcome
ALTER TABLE burns_outcome ALTER COLUMN destination_hospital TYPE VARCHAR(256); --Need to delete FK
ALTER TABLE burns_outcome ADD COLUMN destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid);

----Stroke
ALTER TABLE stroke ADD COLUMN history_of_anticoagulant BOOLEAN;
ALTER TABLE stroke ADD COLUMN bp_sbp VARCHAR(10);
ALTER TABLE stroke ADD COLUMN bp_dbp VARCHAR(10);
ALTER TABLE stroke ADD COLUMN aspect_score VARCHAR(155);

--stroke_outcome
ALTER TABLE stroke_outcome ALTER COLUMN destination_hospital TYPE VARCHAR(256); --Need to delete FK
ALTER TABLE stroke_outcome ADD COLUMN destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid);

--prem_outcome
ALTER TABLE prem_outcome ALTER COLUMN destination_hospital TYPE VARCHAR(256); --Need to delete FK
ALTER TABLE prem_outcome ADD COLUMN destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid);

--poisons_outcome
ALTER TABLE poisons_outcome ALTER COLUMN destination_hospital TYPE VARCHAR(256); --Need to delete FK
ALTER TABLE poisons_outcome ADD COLUMN destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid);

--bites_stings_outcome
ALTER TABLE bites_stings_outcome ALTER COLUMN destination_hospital TYPE VARCHAR(256); --Need to delete FK
ALTER TABLE bites_stings_outcome ADD COLUMN destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid);

--hanging_outcome
ALTER TABLE hanging_outcome ALTER COLUMN destination_hospital TYPE VARCHAR(256); --Need to delete FK
ALTER TABLE hanging_outcome ADD COLUMN destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid);

