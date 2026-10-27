
--Add columns
ALTER TABLE triage_dtls ADD COLUMN work_spot_injury INTEGER REFERENCES lkp_triage_dtls_work_spot_injury(id);
ALTER TABLE triage_dtls ADD COLUMN rta INTEGER REFERENCES lkp_triage_dtls_rta(id);
ALTER TABLE triage_dtls ADD COLUMN rta_helmet BOOLEAN;
ALTER TABLE triage_dtls ADD COLUMN rta_rider_type REFERENCES lkp_triage_dtls_rta_rider_type(id);

---
UPDATE lkp_triage_dtls_pc_medical_emergency SET NAME = 'Breathlessness' WHERE ID = 14;
INSERT INTO lkp_triage_dtls_pc_medical_emergency (name, is_enabled) VALUES ('Others (Specify)', TRUE);

SELECT * FROM lkp_triage_dtls_pc_medical_emergency ORDER BY ID


UPDATE lkp_triage_dtls_pc_surgical_emergency SET NAME = 'Foregin body' WHERE ID = 13;
UPDATE lkp_triage_dtls_pc_surgical_emergency SET NAME = 'Electrocution' WHERE ID = 14;
INSERT INTO lkp_triage_dtls_pc_surgical_emergency (name, is_enabled) VALUES ('Others (Specify)', TRUE);

SELECT * FROM lkp_triage_dtls_pc_surgical_emergency