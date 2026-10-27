ALTER TABLE triage
ALTER COLUMN patient_ehr_id
TYPE INTEGER
USING patient_ehr_id::integer;
