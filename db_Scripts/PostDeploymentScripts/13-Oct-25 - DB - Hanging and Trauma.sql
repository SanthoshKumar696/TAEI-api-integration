--Hanging
ALTER TABLE hanging ADD COLUMN oth_supportive_care_provided VARCHAR(256)

--Trauma

update lkp_trauma_outcome set name = 'Transferred to ward' where id = 7;
update lkp_trauma_outcome set name = 'Transferred to ICU' where id = 8;
INSERT INTO lkp_trauma_outcome (name) VALUES ('Transferred to other hospital');


CREATE TABLE IF NOT EXISTS lkp_trauma_surgery_type (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(256) NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO lkp_trauma_surgery_type (name) VALUES
('Major'),
('Minor')
ON CONFLICT (name) DO NOTHING;

alter table trauma_final add column surgery_type INTEGER REFERENCES lkp_trauma_surgery_type(id);
alter table trauma_final add column surgery_name VARCHAR(256);
alter table trauma_final add column date_time TIMESTAMP;
alter table trauma_final add column surgery_takenup_from_incident_date INTEGER;
alter table trauma_final add column surgery_takenup_from_triage_date INTEGER;
alter table trauma_final add column name_of_surgery VARCHAR(256);

