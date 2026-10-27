SELECT id, username, email, password, security_question, security_answer, role_id, directorate_id, hospital_id, created_at, updated_at
	FROM public.auth_users;


select * from auth_roles 
	-- Seed roles
INSERT INTO auth_roles (name) VALUES ('state admin');

select * from lkp_burns_mode_of_injury 
INSERT INTO lkp_burns_mode_of_injury (name) VALUES('Others - Specify');

select * from lkp_burns_surgery_emergency
INSERT INTO lkp_burns_surgery_emergency (name) VALUES ('Other Surgery');

select * from lkp_burns_surgery_elective
INSERT INTO lkp_burns_surgery_elective (name) VALUES('Other Surgery');

alter table burns add column oth_mode_of_injury VARCHAR(256);
alter table burns_surgery_elective add column oth_surgery_elective VARCHAR(256);
alter table burns_values add column wound_management_conservative BOOLEAN;
alter table burns_values add column oth_surgery_emergency VARCHAR(256);
alter table burns_values add column is_surgery_elective_performed BOOLEAN;

select * from lkp_burns_stay_complications --Multiple Organ Dysfunction Syndrome

UPDATE lkp_burns_stay_complications SET NAME = 'Multiple Organ Dysfunction Syndrome' WHERE ID = 6

