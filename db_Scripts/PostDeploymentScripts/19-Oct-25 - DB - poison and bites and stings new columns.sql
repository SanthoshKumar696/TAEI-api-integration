
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


ALTER TABLE poisons ALTER COLUMN supportive_care_provided SET DATA TYPE INT[] USING ARRAY[supportive_care_provided];

ALTER TABLE bites_stings ADD COLUMN oth_venomous_type VARCHAR(256)

ALTER TABLE bites_stings ADD COLUMN time_interval INTEGER REFERENCES lkp_bite_time_interval(id)
