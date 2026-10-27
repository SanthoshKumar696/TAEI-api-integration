CREATE OR REPLACE FUNCTION get_state_report_dashboard_burns(
    p_from TIMESTAMP,
    p_to   TIMESTAMP
)
RETURNS TABLE (

    -- GROUP 1 — Admissions & Critical Cases
    total_admissions BIGINT,
    adult_admissions BIGINT,
    pediatric_admissions BIGINT,
    near_death_cases BIGINT,
    acid_attack_cases BIGINT,
    acid_attack_deaths BIGINT,
    brought_dead_cases BIGINT,

    -- GROUP 2 — TBSA Severity Split
    tbsa_0_20 BIGINT,
    tbsa_20_40 BIGINT,
    tbsa_40_60 BIGINT,
    tbsa_gt_60 BIGINT,

    tbsa_0_20_adult BIGINT,
    tbsa_20_40_adult BIGINT,
    tbsa_40_60_adult BIGINT,
    tbsa_gt_60_adult BIGINT,

    tbsa_0_20_ped BIGINT,
    tbsa_20_40_ped BIGINT,
    tbsa_40_60_ped BIGINT,
    tbsa_gt_60_ped BIGINT,

    tbsa_referred_in BIGINT,
    tbsa_referred_out BIGINT,
    tbsa_deaths BIGINT,
    tbsa_survival BIGINT,

    -- GROUP 3 — Treatment Outcomes
    outcome_discharged BIGINT,
    outcome_under_treatment BIGINT,
    outcome_death BIGINT,
    outcome_referred_out BIGINT,
    outcome_dama BIGINT,
    outcome_abscond BIGINT,

    -- GROUP 4 — Surgical Interventions
    surgery_skin_graft BIGINT,
    surgery_early_excision BIGINT,
    surgery_debridement BIGINT,
    surgery_other BIGINT

)
AS $$
BEGIN
RETURN QUERY
WITH base AS (
    SELECT
        b.id AS burns_id,
        b.triage_id,
        b.admitted,
        b.mode_of_injury,
        btb.head + btb.neck + btb.anterior_trunk + btb.posterior_trunk +
        btb.right_gluteal + btb.left_gluteal + btb.genital +
        btb.right_arm + btb.left_arm + btb.right_forearm + btb.left_forearm +
        btb.right_hand + btb.left_hand + btb.right_thigh + btb.left_thigh +
        btb.right_leg + btb.left_leg + btb.right_foot + btb.left_foot AS tbsa_total,
        bo.outcome,
        tr.age_year,
        trd.brought_dead,
        bv.surgery_emergency,
        bse.surgery_elective
    FROM burns b
    LEFT JOIN burns_tbsa btb ON btb.burns_id = b.id
    LEFT JOIN burns_outcome bo ON bo.burns_id = b.id
    LEFT JOIN burns_values bv ON bv.burns_id = b.id
    LEFT JOIN burns_surgery_elective bse ON bse.burns_id = b.id
    LEFT JOIN triage tr ON tr.id = b.triage_id
    LEFT JOIN triage_dtls trd ON trd.triage_id = tr.id
    WHERE b.inserted_date BETWEEN p_from AND p_to
),
tbsa_bucket AS (
    SELECT *,
        CASE
            WHEN tbsa_total <= 20 THEN '0_20'
            WHEN tbsa_total <= 40 THEN '20_40'
            WHEN tbsa_total <= 60 THEN '40_60'
            ELSE 'gt_60'
        END AS tbsa_grp
    FROM base
)
SELECT
    COUNT(*) FILTER (WHERE tbsa_bucket.admitted = TRUE) AS total_admissions,
    COUNT(*) FILTER (WHERE tbsa_bucket.admitted = TRUE AND tbsa_bucket.age_year >= 18) AS adult_admissions,
    COUNT(*) FILTER (WHERE tbsa_bucket.admitted = TRUE AND tbsa_bucket.age_year < 18) AS pediatric_admissions,

    COUNT(*) FILTER (
        WHERE tbsa_bucket.surgery_elective IS NOT NULL
    ) AS near_death_cases,

    COUNT(*) FILTER (
        WHERE tbsa_bucket.mode_of_injury =
            (SELECT id FROM lkp_burns_mode_of_injury WHERE name ILIKE 'Acid Attack')
    ) AS acid_attack_cases,

    COUNT(*) FILTER (
        WHERE tbsa_bucket.mode_of_injury =
              (SELECT id FROM lkp_burns_mode_of_injury WHERE name ILIKE 'Acid Attack')
          AND tbsa_bucket.outcome =
              (SELECT id FROM lkp_burns_outcome WHERE name ILIKE 'Death')
    ) AS acid_attack_deaths,

    COUNT(*) FILTER (WHERE tbsa_bucket.brought_dead = TRUE) AS brought_dead_cases,

    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp = '0_20') AS tbsa_0_20,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp = '20_40') AS tbsa_20_40,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp = '40_60') AS tbsa_40_60,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp = 'gt_60') AS tbsa_gt_60,

    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='0_20' AND tbsa_bucket.age_year>=18) AS tbsa_0_20_adult,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='20_40' AND tbsa_bucket.age_year>=18) AS tbsa_20_40_adult,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='40_60' AND tbsa_bucket.age_year>=18) AS tbsa_40_60_adult,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='gt_60' AND tbsa_bucket.age_year>=18) AS tbsa_gt_60_adult,

    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='0_20' AND tbsa_bucket.age_year<18) AS tbsa_0_20_ped,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='20_40' AND tbsa_bucket.age_year<18) AS tbsa_20_40_ped,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='40_60' AND tbsa_bucket.age_year<18) AS tbsa_40_60_ped,
    COUNT(*) FILTER (WHERE tbsa_bucket.tbsa_grp='gt_60' AND tbsa_bucket.age_year<18) AS tbsa_gt_60_ped,

    COUNT(*) FILTER (WHERE tbsa_bucket.admitted = TRUE AND tbsa_bucket.outcome IS NULL) AS tbsa_referred_in,
    COUNT(*) FILTER (WHERE tbsa_bucket.outcome =
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE '%Transferred%')) AS tbsa_referred_out,

    COUNT(*) FILTER (WHERE tbsa_bucket.outcome =
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE 'Death')) AS tbsa_deaths,
    COUNT(*) FILTER (WHERE tbsa_bucket.outcome IS NULL OR tbsa_bucket.outcome !=
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE 'Death')) AS tbsa_survival,

    COUNT(*) FILTER (WHERE tbsa_bucket.outcome =
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE 'Discharged')) AS outcome_discharged,
    COUNT(*) FILTER (WHERE tbsa_bucket.outcome IS NULL) AS outcome_under_treatment,
    COUNT(*) FILTER (WHERE tbsa_bucket.outcome =
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE 'Death')) AS outcome_death,
    COUNT(*) FILTER (WHERE tbsa_bucket.outcome =
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE '%Transferred%')) AS outcome_referred_out,
    COUNT(*) FILTER (WHERE tbsa_bucket.outcome =
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE 'DAMA')) AS outcome_dama,
    COUNT(*) FILTER (WHERE tbsa_bucket.outcome =
        (SELECT id FROM lkp_burns_outcome WHERE name ILIKE 'Absconded')) AS outcome_abscond,

    COUNT(*) FILTER (
        WHERE tbsa_bucket.surgery_elective IN (
            SELECT id FROM lkp_burns_surgery_elective WHERE name ILIKE '%graft%'
        )
    ) AS surgery_skin_graft,

    COUNT(*) FILTER (
        WHERE tbsa_bucket.surgery_elective IN (
            SELECT id FROM lkp_burns_surgery_elective WHERE name ILIKE '%early excision%'
        )
    ) AS surgery_early_excision,

    COUNT(*) FILTER (
        WHERE tbsa_bucket.surgery_elective IN (
            SELECT id FROM lkp_burns_surgery_elective WHERE name ILIKE '%Debridement%'
        )
    ) AS surgery_debridement,

    COUNT(*) FILTER (
        WHERE tbsa_bucket.surgery_elective IS NOT NULL
          AND tbsa_bucket.surgery_elective NOT IN (
               SELECT id FROM lkp_burns_surgery_elective WHERE name ILIKE '%graft%'
           UNION
               SELECT id FROM lkp_burns_surgery_elective WHERE name ILIKE '%Debridement%'
           UNION
               SELECT id FROM lkp_burns_surgery_elective WHERE name ILIKE '%early excision%'
          )
    ) AS surgery_other

FROM tbsa_bucket;

END;
$$ LANGUAGE plpgsql;
