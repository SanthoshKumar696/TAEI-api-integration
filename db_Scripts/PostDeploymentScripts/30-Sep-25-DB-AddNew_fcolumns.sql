--Triage
ALTER TABLE triage ADD column oth_place_of_incident VARCHAR(256);

--Trauma
ALTER TABLE Trauma ADD column oth_type_of_injury VARCHAR(256);

--Trauma_Values
ALTER TABLE trauma_values ADD column xray_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column efast_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column ct_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column mri_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column abg_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column blood_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column hcg_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column urine_date_time TIMESTAMP;
ALTER TABLE trauma_values ADD column oth_date_time TIMESTAMP;


--Note - before remove the FK reference speciality_opinion column

ALTER TABLE trauma_final ALTER COLUMN speciality_opinion SET DATA TYPE INT[] USING ARRAY[speciality_opinion];


--Stroke
ALTER TABLE stroke ADD column scene_ift INTEGER REFERENCES lkp_triage_scene_ift(id);
ALTER TABLE stroke ADD column admitted BOOLEAN;
ALTER TABLE stroke ADD column admitted_date_time TIMESTAMP;
ALTER TABLE stroke ADD column procedure_done BOOLEAN;

ALTER TABLE stroke ALTER COLUMN date_time_of_entry TYPE TIMESTAMP;
ALTER TABLE stroke ALTER COLUMN lysis_done_outside_date TYPE TIMESTAMP;
ALTER TABLE stroke ALTER COLUMN cbg_date TYPE TIMESTAMP;
ALTER TABLE stroke ALTER COLUMN ct_scan_date TYPE TIMESTAMP;
ALTER TABLE stroke ALTER COLUMN mri_scan_date TYPE TIMESTAMP;
ALTER TABLE stroke ALTER COLUMN cath_lab_procedure_date TYPE TIMESTAMP;
ALTER TABLE stroke ALTER COLUMN lysis_date TYPE TIMESTAMP;

