-- ============================================================
-- 1. Lookup Tables
-- ============================================================

CREATE TABLE lkp_bite_type_of_bite_sting (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_type_of_bite_sting (name) VALUES
('Snake bite'),
('Scorpion sting'),
('Insect bite/sting'),
('Animal bite');

CREATE TABLE lkp_bite_type_of_organism (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    type_of_bite_sting_id INTEGER REFERENCES lkp_bite_type_of_bite_sting(id),
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_type_of_organism (type_of_bite_sting_id, name) VALUES
(1, 'Cobra (e.g., Indian Cobra, King Cobra)'),
(1, 'Viper (e.g., Russell''s Viper, Saw-scaled Viper)'),
(1, 'Krait (e.g., Common Krait, Banded Krait)'),
(1, 'Sea snake'),
(1, 'Pit viper'),
(1, 'Non-venomous snakes (e.g., Rat Snake, Python - for identification)'),
(2, 'Red scorpion (Hottentotta tamulus) - highly venomous'),
(2, 'Black scorpion (Palamnaeus spp.) - less venomous'),
(2, 'Other local/non-venomous scorpion species'),
(3, 'Bee'),
(3, 'Wasp'),
(3, 'Hornet'),
(3, 'Ant (e.g., Fire ant)'),
(3, 'Mosquito'),
(3, 'Tick'),
(3, 'Flea'),
(3, 'Bed bug'),
(3, 'Sandfly'),
(3, 'Other biting flies (e.g., horsefly, deer fly)'),
(4, 'Dog'),
(4, 'Cat'),
(4, 'Monkey'),
(4, 'Rat or rodent'),
(4, 'Bat'),
(4, 'Pig'),
(4, 'Cow or buffalo'),
(4, 'Horse or donkey'),
(4, 'Wild animals');

CREATE TABLE lkp_bite_venomous_type (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_venomous_type (name) VALUES
('Neurotoxic'),
('Hemotoxic'),
('Myotoxic'),
('Cytotoxic'),
('Unknown'),
('Other (specify)');

CREATE TABLE lkp_bite_site_of_bite_sting (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_site_of_bite_sting (name) VALUES
('Upper Extremity'),
('Lower Extremity'),
('Trunk'),
('Neck'),
('Face');

CREATE TABLE lkp_bite_symptoms_presentation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_symptoms_presentation (name) VALUES
('Fang marks at the site'),
('Visible puncture wounds or lacerations'),
('Bleeding'),
('Swelling and pain'),
('Bruising or blistering around the bite'),
('Itching'),
('Hives or widespread rash'),
('Numbness or tingling'),
('Nausea or vomiting'),
('Difficulty breathing'),
('Vision problems or drooping eyelids');

CREATE TABLE lkp_bite_time_interval (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_time_interval (name) VALUES
('< 1 hour'),
('1-3 hours'),
('3-6 hours'),
('6-12 hours'),
('> 12 hours'),
('Unknown');

CREATE TABLE lkp_bite_supportive_care_provided (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_supportive_care_provided (name) VALUES
('Ventilation'),
('Fluids'),
('Dialysis'),
('Any other please specify');

CREATE TABLE lkp_bite_outcome (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO lkp_bite_outcome (name) VALUES
('Discharged'),
('Discharge at request'),
('DAMA'),
('Absconded'),
('Death'),
('Transferred to other hospital'),
('Treated as OP');


-- ============================================================
-- 2. Main Table: bites
-- ============================================================

CREATE TABLE bites_stings (
    id SERIAL PRIMARY KEY,
    triage_id INTEGER REFERENCES triage(id),
    date_time_of_entry TIMESTAMP NOT NULL,
    patient_admitted BOOLEAN,
    name_of_dept VARCHAR(256),
    date_of_admit TIMESTAMP,
    type_of_bite_sting INTEGER REFERENCES lkp_bite_type_of_bite_sting(id),
    type_of_organism INTEGER REFERENCES lkp_bite_type_of_organism(id),
    venomous_type INTEGER REFERENCES lkp_bite_venomous_type(id),
    oth_venomous_type VARCHAR(256),
    site_of_bite_sting INTEGER REFERENCES lkp_bite_site_of_bite_sting(id),
    symptoms_at_presentation INT[],--INTEGER REFERENCES lkp_bite_symptoms_presentation(id)
    time_to_reach_after_bite_sting VARCHAR(50),
    time_interval INTEGER REFERENCES lkp_bite_time_interval(id),
    signs_of_envenomation_allergic_reaction VARCHAR(256),
    investigations_performed VARCHAR(256),
    first_aid_given INTEGER,
    anti_venom_or_allergy_treatment_name VARCHAR(256),
    anti_venom_or_allergy_treatment_dosage VARCHAR(256),
    anti_venom_or_allergy_treatment_timing VARCHAR(256),
    supportive_care_provided INTEGER REFERENCES lkp_bite_supportive_care_provided(id),
    counselling_provided_before_discharge INTEGER,
    duration_of_hospital_stay INTEGER,
    user_id INT, 
    inserted_date TIMESTAMP,
    ref_form_id INT, 
    ref_id INT
);

-- ============================================================
-- Main Table: bites_stings_outcome (child of bites_stings)
-- ============================================================

CREATE TABLE bites_stings_outcome (
    id SERIAL PRIMARY KEY,
    bites_stings_id INTEGER NOT NULL REFERENCES bites_stings(id) ON DELETE CASCADE,
    outcome INTEGER REFERENCES lkp_bite_outcome(id),
    is_discharged BOOLEAN,
    discharge_date TIMESTAMP,
    absconded_date TIMESTAMP,
    death_date TIMESTAMP,
    cause_of_death VARCHAR(256),
    -- datetime_discharge TIMESTAMP,
    -- discharge_complications VARCHAR(256),
    -- datetime_of_death TIMESTAMP,
    -- cause_of_death VARCHAR(256),
    -- transferred_to INTEGER REFERENCES lkp_poison_transferred_to(id),
    -- ward_datetime TIMESTAMP,
    -- ward_name VARCHAR(256),
    -- icu_datetime TIMESTAMP,
    -- icu_name VARCHAR(256),
    hospital_type INTEGER REFERENCES lkp_hospital_type(id),
    destination_hospital VARCHAR(256),
    destination_taei_hospital INTEGER REFERENCES lkp_hospitals(hospitalid),
    reason_for_referral INTEGER REFERENCES lkp_reason_for_referral(id),
    condition_of_patient INTEGER REFERENCES lkp_condition_of_patient(id),
    referring_doctor VARCHAR(256),
    documented_taei_sheet BOOLEAN,
    patient_exit_date TIMESTAMP
);