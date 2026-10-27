
----PREM
alter table prem add column presenting_complaints_prem INT[];
alter table prem add column oth_presenting_complaints_prem VARCHAR(256);

---EMO
--Working for Emergency Category DD
alter table lkp_emo_emergency_category add column is_adult BOOLEAN DEFAULT FALSE;
update lkp_emo_emergency_category set is_adult = 1 where id in(2,4,6,7,8)


--Prem

select * from lkp_prem_diagnosis

update lkp_prem_diagnosis set name = 'Bites & Sting' where id = 15;
update lkp_prem_diagnosis set name = 'Drowning' where id = 16;
update lkp_prem_diagnosis set name = 'Burns' where id = 17;
update lkp_prem_diagnosis set name = 'Nephrotic Syndrome' where id = 18;

INSERT INTO lkp_prem_diagnosis (name) VALUES ('Malignancy'),('Blood disorders'),('Others');

--------