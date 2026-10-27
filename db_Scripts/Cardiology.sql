CREATE TABLE lkp_cardio_presenting_complaints (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);

INSERT INTO lkp_cardio_presenting_complaints (name) VALUES
('Chest pain / Discomfort'),
('Back / Epigastric Pain'),
('Lightheadedness'),
('Nausea/Vomiting'),
('Diaphoresis (Sweating)'),
('Palpitations'),
('Dyspnea'),
('Shortness of breath'),
('Syncope or Dizziness'),
('Others');

CREATE TABLE lkp_cardio_cath_lab_procedure (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO lkp_cardio_cath_lab_procedure (name) VALUES
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
('Others');


CREATE TABLE cath_lab (
    id SERIAL PRIMARY KEY,
    triage_id int,
    -- Admission info
    patient_admitted BOOLEAN NOT NULL,
    admitting_department VARCHAR(150),
    admission_datetime TIMESTAMP,

    -- Diagnosis
    diagnosis TEXT,
    presenting_complaints number[],
    -- Cath Lab details
    cath_arrival_datetime TIMESTAMP,
    procedure_id INT REFERENCES lkp_cardio_cath_lab_procedure(id),
    procedure_other TEXT,   -- only if "Others" chosen

    -- Discharge info
    discharge_datetime TIMESTAMP,

    -- Auto-calculated duration
    hospital_stay_days INT 
);