
select * from lkp_stroke_reason_for_delay
'Delay in Transporation'

ALTER TABLE stroke ADD COLUMN oth_reason_for_delay VARCHAR(256);

select * from lkp_stroke_symptoms
update lkp_stroke_symptoms set name ='Visual Distubances' where id = 2


--Error in live - Id 7  exists in table
select * from public.lkp_stroke_outcome
select * from stroke_outcome where outcome = 7
Update lkp_stroke_outcome set name = 'Transferred To other hospital' where id =6 --8-6
delete from lkp_stroke_outcome where id in (7, 8)


--to be added to live

ALTER TABLE stroke RENAME COLUMN absolute_contraindication TO risk_factors;
ALTER TABLE stroke RENAME COLUMN oth_absolute_contraindication TO oth_risk_factors;

ALTER TABLE stroke ADD COLUMN pre_morbit_scroe VARCHAR(256);

ALTER TABLE stroke ADD COLUMN is_absolute_contraindication boolean;
ALTER TABLE stroke ADD COLUMN oth_absolute_contraindication VARCHAR(256);
ALTER TABLE stroke ADD COLUMN cbg_txt VARCHAR(256);
ALTER TABLE stroke ADD COLUMN ct_scan_findings VARCHAR(256);

ALTER TABLE stroke ADD COLUMN mri_scan_eligility_status boolean;
ALTER TABLE stroke ADD COLUMN cath_lab_findings VARCHAR(256);
ALTER TABLE stroke ADD COLUMN hemorrhagic_specify VARCHAR(256);

select * from stroke_outcome

ALTER TABLE stroke_outcome ADD COLUMN drug_prescribed VARCHAR(256);



