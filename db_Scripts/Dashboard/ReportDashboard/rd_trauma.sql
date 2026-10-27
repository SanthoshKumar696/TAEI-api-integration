-- Uses trauma + triage schema you uploaded. See: Trauma.sql and triage files. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}

CREATE OR REPLACE FUNCTION get_state_report_dashboard_trauma(
    p_from TIMESTAMP,
    p_to   TIMESTAMP
)
RETURNS TABLE (
    total_trauma BIGINT,
    trauma_per_100_ed_admissions NUMERIC,

    red_cases BIGINT,
    yellow_cases BIGINT,
    green_cases BIGINT,
    black_cases BIGINT,

    rta_rider_red BIGINT,
    rta_rider_yellow BIGINT,
    rta_rider_green BIGINT,
    rta_rider_black BIGINT,
    rta_rider_ikt_availed BIGINT,

    rta_pillion_red BIGINT,
    rta_pillion_yellow BIGINT,
    rta_pillion_green BIGINT,
    rta_pillion_black BIGINT,
    rta_pillion_ikt_availed BIGINT,

    fall_from_height BIGINT,
    fall_slip_floor BIGINT,
    assault_cases BIGINT,
    self_inflicted BIGINT,
    accidental_injury BIGINT,
    firearm_injury BIGINT,
    sport_injury BIGINT,
    fall_of_object BIGINT,
    workspot_organised_esi BIGINT,
    workspot_unorganised_tn BIGINT,
    workspot_other_states BIGINT,
    agricultural_machinery BIGINT,
    train_traffic_injury BIGINT,

    head_with_helmet BIGINT,
    head_without_helmet BIGINT,

    -- procedures / resus counts
    total_any_procedure_done BIGINT,
    cpr_attempts BIGINT,
    successful_cpr BIGINT,
    cpr_per_100_trauma NUMERIC,
    successful_cpr_rate_pct NUMERIC,

    blood_transfusion_cases BIGINT,
    on_arrival_nerve_blocks BIGINT,

    mech_intubation_count BIGINT,
    first_pass_intubation_count BIGINT,
    first_pass_intubation_rate_pct NUMERIC,

    -- surgery
    major_surgeries BIGINT,
    minor_surgeries BIGINT,
    total_ga_surgeries BIGINT,
    total_local_surgeries BIGINT,
    major_ga_within_6hrs BIGINT,
    major_ga_6_to_24hrs BIGINT,
    -- specialty-wise (General / Neuro / Ortho / Other) within time windows
    major_ga_within_6hrs_general BIGINT,
    major_ga_within_6hrs_neuro BIGINT,
    major_ga_within_6hrs_ortho BIGINT,
    major_ga_within_6hrs_other BIGINT,
    major_ga_6_to_24hrs_general BIGINT,
    major_ga_6_to_24hrs_neuro BIGINT,
    major_ga_6_to_24hrs_ortho BIGINT,
    major_ga_6_to_24hrs_other BIGINT,

    -- outcomes
    admitted_to_ward BIGINT,
    admitted_to_icu BIGINT,
    deaths BIGINT,
    death_rate_pct NUMERIC,
    discharged_cases BIGINT,
    dama_cases BIGINT,
    dama_rate_pct NUMERIC,
    absconded_cases BIGINT,
    abscond_rate_pct NUMERIC,
    referred_in_cases BIGINT,           -- based on outcome (Referred / Transferred)
    taei_documented BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH ed_counts AS (
        SELECT COUNT(*)::BIGINT AS total_ed
        FROM triage tr
        WHERE tr.date_time_of_triage BETWEEN p_from AND p_to
    ),
    tbase AS (
        SELECT
            t.id AS trauma_id,
            t.triage_id,
            t.type_of_injury,
            t.rta,
            t.rta_helmet,
            t.ikt_availed,
            t.workspot_injury,
            tv.trauma_flag,
            tf.iscpr,
            tf.cpr_done,
            tf.blood_transfusion_done,
            tf.on_arrival_nerve_blocks,
            tf.mech_intubation,
            tf.first_pass_intubation,
            tf.other_procedure_done,
            tf.surgery_type,
            tf.surgery_done_under,
            -- NOTE: surgery_speciality is a placeholder name. If your schema uses another column name, replace below.
            tf.surgery_name,
            tf.date_time AS surgery_datetime,
            to2.outcome,
            tr.date_time_of_triage,
            trd.rta_rider_type,
            trd.brought_dead,
			t.part_of_the_body_injured
        FROM trauma t
        LEFT JOIN trauma_values tv ON tv.trauma_id = t.id
        LEFT JOIN trauma_final tf ON tf.trauma_id = t.id
        LEFT JOIN trauma_outcome to2 ON to2.trauma_id = t.id
        LEFT JOIN triage tr ON tr.id = t.triage_id
        LEFT JOIN triage_dtls trd ON trd.triage_id = tr.id
        WHERE tr.date_time_of_triage BETWEEN p_from AND p_to
    ),
    agg AS (
        SELECT
            COUNT(*)::BIGINT AS total_trauma,

            -- colors
            COUNT(*) FILTER (WHERE COALESCE(tbase.trauma_flag, tv.trauma_flag) = 1) AS red_cases,
            COUNT(*) FILTER (WHERE COALESCE(tbase.trauma_flag, tv.trauma_flag) = 2) AS yellow_cases,
            COUNT(*) FILTER (WHERE COALESCE(tbase.trauma_flag, tv.trauma_flag) = 3) AS green_cases,
            COUNT(*) FILTER (WHERE tbase.brought_dead = TRUE) AS black_cases,

            -- RTA Rider (assumes lkp values exist - matching by name is resilient)
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Rider' LIMIT 1)
                  AND COALESCE(tbase.trauma_flag, tv.trauma_flag) = 1
            ) AS rta_rider_red,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Rider' LIMIT 1)
                  AND COALESCE(tbase.trauma_flag, tv.trauma_flag) = 2
            ) AS rta_rider_yellow,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Rider' LIMIT 1)
                  AND COALESCE(tbase.trauma_flag, tv.trauma_flag) = 3
            ) AS rta_rider_green,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Rider' LIMIT 1)
                  AND tbase.brought_dead = TRUE
            ) AS rta_rider_black,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Rider' LIMIT 1)
                  AND tbase.ikt_availed = TRUE
            ) AS rta_rider_ikt_availed,

            -- RTA Pillion
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Pillion' LIMIT 1)
                  AND COALESCE(tbase.trauma_flag, tv.trauma_flag) = 1
            ) AS rta_pillion_red,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Pillion' LIMIT 1)
                  AND COALESCE(tbase.trauma_flag, tv.trauma_flag) = 2
            ) AS rta_pillion_yellow,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Pillion' LIMIT 1)
                  AND COALESCE(tbase.trauma_flag, tv.trauma_flag) = 3
            ) AS rta_pillion_green,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Pillion' LIMIT 1)
                  AND tbase.brought_dead = TRUE
            ) AS rta_pillion_black,
            COUNT(*) FILTER (
                WHERE tbase.rta IS NOT NULL
                  AND tbase.rta = (SELECT id FROM lkp_trauma_rta WHERE name ILIKE 'Two-wheeler' LIMIT 1)
                  AND tbase.rta_rider_type = (SELECT id FROM lkp_triage_dtls_rta_rider_type WHERE name ILIKE 'Pillion' LIMIT 1)
                  AND tbase.ikt_availed = TRUE
            ) AS rta_pillion_ikt_availed,

            -- Injury types
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Fall from height' LIMIT 1)) AS fall_from_height,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Fall - slipped & fell on floor' LIMIT 1)) AS fall_slip_floor,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Assault' LIMIT 1)) AS assault_cases,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Self-inflicted injury' LIMIT 1)) AS self_inflicted,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Accidental injury' LIMIT 1)) AS accidental_injury,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Fire Arm' LIMIT 1)) AS firearm_injury,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Sport' LIMIT 1)) AS sport_injury,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Fall of object' LIMIT 1)) AS fall_of_object,
            COUNT(*) FILTER (WHERE tbase.workspot_injury = (SELECT id FROM lkp_trauma_workspot_injury WHERE name ILIKE 'Organised sector (ESI Card)' LIMIT 1)) AS workspot_organised_esi,
            COUNT(*) FILTER (WHERE tbase.workspot_injury = (SELECT id FROM lkp_trauma_workspot_injury WHERE name ILIKE 'Non-organized sector - Tamil Nadu' LIMIT 1)) AS workspot_unorganised_tn,
            COUNT(*) FILTER (WHERE tbase.workspot_injury = (SELECT id FROM lkp_trauma_workspot_injury WHERE name ILIKE 'Other state' LIMIT 1)) AS workspot_other_states,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Agricultural Machinery Injury' LIMIT 1)) AS agricultural_machinery,
            COUNT(*) FILTER (WHERE tbase.type_of_injury = (SELECT id FROM lkp_trauma_type_of_injury WHERE name ILIKE 'Train Traffic Injury' LIMIT 1)) AS train_traffic_injury,

            -- Head injury by helmet (uses part_of_the_body_injured array if available; adjust if stored elsewhere)
            COUNT(*) FILTER (
                WHERE (
                    tbase.rta_helmet IS NOT NULL
                    AND EXISTS (
                        SELECT 1 FROM unnest(tbase.part_of_the_body_injured) AS x(id)
                        JOIN lkp_trauma_part_of_the_body_injured p ON p.id = x.id
                        WHERE p.name ILIKE 'Head'
                    )
                )
                AND tbase.rta_helmet = TRUE
            ) AS head_with_helmet,
            COUNT(*) FILTER (
                WHERE (
                    tbase.part_of_the_body_injured IS NOT NULL
                    AND EXISTS (
                        SELECT 1 FROM unnest(tbase.part_of_the_body_injured) AS x(id)
                        JOIN lkp_trauma_part_of_the_body_injured p ON p.id = x.id
                        WHERE p.name ILIKE 'Head'
                    )
                )
                AND (tbase.rta_helmet = FALSE OR tbase.rta_helmet IS NULL)
            ) AS head_without_helmet,

            -- procedures/resus
            COUNT(*) FILTER (WHERE tf.other_procedure_done IS NOT NULL OR tf.mech_intubation = TRUE OR tf.iscpr = TRUE OR tf.blood_transfusion_done = TRUE OR tf.on_arrival_nerve_blocks = TRUE) AS total_any_procedure_done,
            COUNT(*) FILTER (WHERE tf.iscpr = TRUE OR tf.cpr_done IS NOT NULL) AS cpr_attempts,
            COUNT(*) FILTER (WHERE (tf.iscpr = TRUE OR tf.cpr_done IS NOT NULL) AND (to2.outcome IS NULL OR to2.outcome NOT IN (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE '%death%' OR name ILIKE '%death in ed%' LIMIT 100))) AS successful_cpr,
            COUNT(*) FILTER (WHERE tf.blood_transfusion_done = TRUE) AS blood_transfusion_cases,
            COUNT(*) FILTER (WHERE tf.on_arrival_nerve_blocks = TRUE) AS on_arrival_nerve_blocks,
            COUNT(*) FILTER (WHERE tf.mech_intubation = TRUE) AS mech_intubation_count,
            COUNT(*) FILTER (WHERE tf.first_pass_intubation = TRUE) AS first_pass_intubation_count,

            -- surgery totals and GA/Local
            COUNT(*) FILTER (WHERE tf.surgery_type = 1) AS major_surgeries,
            COUNT(*) FILTER (WHERE tf.surgery_type = 2) AS minor_surgeries,
            COUNT(*) FILTER (WHERE tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)) AS total_ga_surgeries,
            COUNT(*) FILTER (WHERE tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'Local Anesthesia' LIMIT 1)) AS total_local_surgeries,

            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 6
            ) AS major_ga_within_6hrs,

            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 > 6
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 24
            ) AS major_ga_6_to_24hrs,

            -- specialty breakdowns (ASSUMPTION: tf.surgery_speciality stores a string or id; update mapping if different)
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 6
                  AND (tf.surgery_name ILIKE 'General' OR tf.surgery_name::text ILIKE '%general%')
            ) AS major_ga_within_6hrs_general,
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 6
                  AND (tf.surgery_name ILIKE 'Neuro' OR tf.surgery_name::text ILIKE '%neuro%')
            ) AS major_ga_within_6hrs_neuro,
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 6
                  AND (tf.surgery_name ILIKE 'Ortho' OR tf.surgery_name::text ILIKE '%ortho%')
            ) AS major_ga_within_6hrs_ortho,
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 6
                  AND (tf.surgery_name IS NULL OR (tf.surgery_name::text NOT ILIKE '%general%' AND tf.surgery_name::text NOT ILIKE '%neuro%' AND tf.surgery_name::text NOT ILIKE '%ortho%'))
            ) AS major_ga_within_6hrs_other,

            -- 6-24 hrs specialty
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 > 6
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 24
                  AND (tf.surgery_name ILIKE 'General' OR tf.surgery_name::text ILIKE '%general%')
            ) AS major_ga_6_to_24hrs_general,
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 > 6
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 24
                  AND (tf.surgery_name ILIKE 'Neuro' OR tf.surgery_name::text ILIKE '%neuro%')
            ) AS major_ga_6_to_24hrs_neuro,
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 > 6
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 24
                  AND (tf.surgery_name ILIKE 'Ortho' OR tf.surgery_name::text ILIKE '%ortho%')
            ) AS major_ga_6_to_24hrs_ortho,
            COUNT(*) FILTER (
                WHERE tf.surgery_type = 1
                  AND tf.surgery_done_under = (SELECT id FROM lkp_trauma_surgery_done_under WHERE name ILIKE 'General Anesthesia' LIMIT 1)
                  AND tf.date_time IS NOT NULL
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 > 6
                  AND EXTRACT(EPOCH FROM (tf.date_time - tbase.date_time_of_triage))/3600 <= 24
                  AND (tf.surgery_name IS NULL OR (tf.surgery_name::text NOT ILIKE '%general%' AND tf.surgery_name::text NOT ILIKE '%neuro%' AND tf.surgery_name::text NOT ILIKE '%ortho%'))
            ) AS major_ga_6_to_24hrs_other,

            -- outcomes
            COUNT(*) FILTER (WHERE to2.outcome = (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE 'Transferred to ward' LIMIT 1)) AS admitted_to_ward,
            COUNT(*) FILTER (WHERE to2.outcome = (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE 'Transferred to ICU' LIMIT 1)) AS admitted_to_icu,
            COUNT(*) FILTER (WHERE to2.outcome IN (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE '%death%' OR name ILIKE '%brought dead%' LIMIT 100)) AS deaths,
            COUNT(*) FILTER (WHERE to2.outcome = (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE 'Discharged' LIMIT 1)) AS discharged_cases,
            COUNT(*) FILTER (WHERE to2.outcome = (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE 'DAMA' LIMIT 1)) AS dama_cases,
            COUNT(*) FILTER (WHERE to2.outcome = (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE 'Absconded' LIMIT 1)) AS absconded_cases,

            -- referred in based on outcome (your instruction)
            COUNT(*) FILTER (WHERE to2.outcome IN (SELECT id FROM lkp_trauma_outcome WHERE name ILIKE '%refer%' OR name ILIKE '%transfer%' LIMIT 100)) AS referred_in_cases,

            COUNT(*) FILTER (WHERE to2.taei_case_documented = TRUE) AS taei_documented

        FROM tbase
        LEFT JOIN trauma_values tv ON tv.trauma_id = tbase.trauma_id
        LEFT JOIN trauma_final tf ON tf.trauma_id = tbase.trauma_id
        LEFT JOIN trauma_outcome to2 ON to2.trauma_id = tbase.trauma_id
    )

    SELECT
        agg.total_trauma,
        CASE WHEN ec.total_ed = 0 THEN 0 ELSE ROUND((agg.total_trauma::NUMERIC * 100.0) / ec.total_ed::NUMERIC, 2) END AS trauma_per_100_ed_admissions,

        -- colors
        agg.red_cases,
        agg.yellow_cases,
        agg.green_cases,
        agg.black_cases,

        -- rider
        agg.rta_rider_red,
        agg.rta_rider_yellow,
        agg.rta_rider_green,
        agg.rta_rider_black,
        agg.rta_rider_ikt_availed,

        -- pillion
        agg.rta_pillion_red,
        agg.rta_pillion_yellow,
        agg.rta_pillion_green,
        agg.rta_pillion_black,
        agg.rta_pillion_ikt_availed,

        -- injury types
        agg.fall_from_height,
        agg.fall_slip_floor,
        agg.assault_cases,
        agg.self_inflicted,
        agg.accidental_injury,
        agg.firearm_injury,
        agg.sport_injury,
        agg.fall_of_object,
        agg.workspot_organised_esi,
        agg.workspot_unorganised_tn,
        agg.workspot_other_states,
        agg.agricultural_machinery,
        agg.train_traffic_injury,

        -- head injury
        agg.head_with_helmet,
        agg.head_without_helmet,

        -- procedures & resus
        agg.total_any_procedure_done,
        agg.cpr_attempts,
        agg.successful_cpr,
        CASE WHEN agg.total_trauma = 0 THEN 0 ELSE ROUND((agg.cpr_attempts::NUMERIC * 100.0) / agg.total_trauma::NUMERIC, 2) END AS cpr_per_100_trauma,
        CASE WHEN agg.cpr_attempts = 0 THEN 0 ELSE ROUND((agg.successful_cpr::NUMERIC * 100.0) / NULLIF(agg.cpr_attempts,0)::NUMERIC, 2) END AS successful_cpr_rate_pct,

        agg.blood_transfusion_cases,
        agg.on_arrival_nerve_blocks,
        agg.mech_intubation_count,
        agg.first_pass_intubation_count,
        CASE WHEN agg.mech_intubation_count = 0 THEN 0 ELSE ROUND((agg.first_pass_intubation_count::NUMERIC * 100.0) / NULLIF(agg.mech_intubation_count,0)::NUMERIC, 2) END AS first_pass_intubation_rate_pct,

        -- surgery
        agg.major_surgeries,
        agg.minor_surgeries,
        agg.total_ga_surgeries,
        agg.total_local_surgeries,
        agg.major_ga_within_6hrs,
        agg.major_ga_6_to_24hrs,

        agg.major_ga_within_6hrs_general,
        agg.major_ga_within_6hrs_neuro,
        agg.major_ga_within_6hrs_ortho,
        agg.major_ga_within_6hrs_other,
        agg.major_ga_6_to_24hrs_general,
        agg.major_ga_6_to_24hrs_neuro,
        agg.major_ga_6_to_24hrs_ortho,
        agg.major_ga_6_to_24hrs_other,

        -- outcomes & rates
        agg.admitted_to_ward,
        agg.admitted_to_icu,
        agg.deaths,
        CASE WHEN agg.total_trauma = 0 THEN 0 ELSE ROUND((agg.deaths::NUMERIC * 100.0) / agg.total_trauma::NUMERIC, 2) END AS death_rate_pct,
        agg.discharged_cases,
        agg.dama_cases,
        CASE WHEN agg.total_trauma = 0 THEN 0 ELSE ROUND((agg.dama_cases::NUMERIC * 100.0) / agg.total_trauma::NUMERIC, 2) END AS dama_rate_pct,
        agg.absconded_cases,
        CASE WHEN agg.total_trauma = 0 THEN 0 ELSE ROUND((agg.absconded_cases::NUMERIC * 100.0) / agg.total_trauma::NUMERIC, 2) END AS abscond_rate_pct,
        agg.referred_in_cases,
        agg.taei_documented
    FROM agg
    CROSS JOIN ed_counts ec;
END;
$$;
