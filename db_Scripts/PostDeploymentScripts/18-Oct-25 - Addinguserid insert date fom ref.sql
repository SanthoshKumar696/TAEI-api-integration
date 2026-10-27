
ALTER TABLE triage ADD COLUMN user_id INT;
ALTER TABLE triage ADD COLUMN inserted_date TIMESTAMP;

ALTER TABLE emo_triage ADD COLUMN user_id INT;
ALTER TABLE emo_triage ADD COLUMN inserted_date TIMESTAMP;

ALTER TABLE trauma ADD COLUMN user_id INT;
ALTER TABLE trauma ADD COLUMN inserted_date TIMESTAMP;

ALTER TABLE stroke ADD COLUMN user_id INT;
ALTER TABLE stroke ADD COLUMN inserted_date TIMESTAMP;
ALTER TABLE stroke ADD COLUMN ref_form_id INT;
ALTER TABLE stroke ADD COLUMN ref_id INT;

ALTER TABLE prem ADD COLUMN user_id INT;
ALTER TABLE prem ADD COLUMN inserted_date TIMESTAMP;
ALTER TABLE prem ADD COLUMN ref_form_id INT;
ALTER TABLE prem ADD COLUMN ref_id INT;

ALTER TABLE poisons ADD COLUMN user_id INT;
ALTER TABLE poisons ADD COLUMN inserted_date TIMESTAMP;
ALTER TABLE poisons ADD COLUMN ref_form_id INT;
ALTER TABLE poisons ADD COLUMN ref_id INT;

ALTER TABLE hanging ADD COLUMN user_id INT;
ALTER TABLE hanging ADD COLUMN inserted_date TIMESTAMP;
ALTER TABLE hanging ADD COLUMN ref_form_id INT;
ALTER TABLE hanging ADD COLUMN ref_id INT;

ALTER TABLE burns ADD COLUMN user_id INT;
ALTER TABLE burns ADD COLUMN inserted_date TIMESTAMP;
ALTER TABLE burns ADD COLUMN ref_form_id INT;
ALTER TABLE burns ADD COLUMN ref_id INT;

ALTER TABLE bites_stings ADD COLUMN user_id INT;
ALTER TABLE bites_stings ADD COLUMN inserted_date TIMESTAMP;
ALTER TABLE bites_stings ADD COLUMN ref_form_id INT;
ALTER TABLE bites_stings ADD COLUMN ref_id INT;