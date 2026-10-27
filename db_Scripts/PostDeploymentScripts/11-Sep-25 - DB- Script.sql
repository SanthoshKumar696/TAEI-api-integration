

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
    temperature DECIMAL(4, 2),    
    brought_dead BOOLEAN,
    triage_flag INTEGER REFERENCES lkp_triage_dtls_triage_flag(id),
    if_red_team_call_out BOOLEAN,
    is_patient_triaged_queue BOOLEAN,
    prem_op_ticket_docs BOOLEAN,
    triage_done_by VARCHAR(256)
);