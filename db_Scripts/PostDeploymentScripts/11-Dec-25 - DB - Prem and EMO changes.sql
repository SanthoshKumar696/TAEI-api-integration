--Add new colunn to track if patient was shifted to PICU
alter table prem_outcome add column shifted_to_picu boolean


---Outcome lookup data change/add

alter table lkp_emo_outcome add column show_pillar Boolean DEFAULT(false);

