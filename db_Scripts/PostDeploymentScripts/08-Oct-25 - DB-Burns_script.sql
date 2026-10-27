---Burns Update
ALTER TABLE public.burns ADD COLUMN admitted BOOLEAN;


SELECT * FROM lkp_burns_transferred_to
--Update the transferred_to lookup data
UPDATE lkp_burns_transferred_to SET NAME = 'WARD' WHERE ID = 1;
UPDATE lkp_burns_transferred_to SET NAME = 'ICU' WHERE ID = 2;

select * from lkp_burns_surgery_elective
Update lkp_burns_surgery_elective set name = 'Debridement / Escharectomy' where id = 3

---Stroke update

ALTER TABLE stroke_outcome ADD COLUMN discharge_static_date TIMESTAMP;
ALTER TABLE stroke_outcome ADD COLUMN dama_date TIMESTAMP;
ALTER TABLE stroke_outcome ADD COLUMN transferred_ward_date TIMESTAMP;
ALTER TABLE stroke_outcome ADD COLUMN transferred_icu_date TIMESTAMP;

SELECT * FROM stroke_outcome

ALTER TABLE stroke ADD COLUMN drug_prescribed VARCHAR(256)
SELECT * FROM stroke

UPDATE lkp_stroke_outcome SET NAME = 'Discharged Improved' WHERE ID = 1;
UPDATE lkp_stroke_outcome SET NAME = 'Discharged Static' WHERE ID = 2;
UPDATE lkp_stroke_outcome SET NAME = 'DAMA' WHERE ID = 3;
UPDATE lkp_stroke_outcome SET NAME = 'Abscond' WHERE ID = 4;
UPDATE lkp_stroke_outcome SET NAME = 'Death' WHERE ID = 5;
UPDATE lkp_stroke_outcome SET NAME = 'Transferred to ward' WHERE ID = 6;

INSERT INTO lkp_stroke_outcome (name) VALUES
('Transferred to ICU'),
('Transferred To other hospital');

--triage 108 
alter table triage_by_108 alter column vehicle_assigned_date_time TYPE TIMESTAMP USING vehicle_assigned_date_time::timestamp;
