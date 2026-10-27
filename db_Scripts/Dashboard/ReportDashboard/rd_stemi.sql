CREATE OR REPLACE FUNCTION get_state_report_dashboard_stemi(
    p_from TIMESTAMP,
    p_to   TIMESTAMP
)
RETURNS TABLE(
    -- Admissions
    admitted_acs_total BIGINT,
    admitted_stemi BIGINT,
    admitted_nstemi BIGINT,
    admitted_ua BIGINT,

    -- Loading dose locations (aggregated across ST / NSTEMI / UA)
    loading_dose_by_referring BIGINT,
    loading_dose_108 BIGINT,
    loading_dose_inside BIGINT,

    -- Thrombolysis (STEMI-only)
    thrombolysis_outside BIGINT,
    thrombolysis_inside BIGINT,
    thrombolysis_not_done_planned_ppci BIGINT,
    successful_thrombolysis BIGINT,
    failed_thrombolysis BIGINT,
    rescue_pci BIGINT,

    -- PPCI / PCI / interventions (all ACS where applicable)
    ppci_total BIGINT,

    -- Management
    medical_management_total BIGINT,
    referred_for_cabg_total BIGINT,

    -- Absconded across ACS
    absconded_total BIGINT,

    -- Deaths totals and breakdown (all ACS)
    total_deaths BIGINT,
    death_before_treatment BIGINT,
    death_after_ppci BIGINT,
    death_after_thrombolysis BIGINT,
    death_after_pharmaco_invasive BIGINT,
    death_after_rescue_pci BIGINT,
    death_after_medical_management BIGINT,
    death_others BIGINT

)
AS $$
BEGIN
RETURN QUERY
WITH
-- source rows within window
st AS (
  SELECT * FROM stemi_treatment
  WHERE stemi_confirmed_at BETWEEN p_from AND p_to
),
sa AS (
  SELECT * FROM stemi_admission
  WHERE date_time_admission BETWEEN p_from AND p_to
),
nt AS (
  SELECT * FROM nstemi_treatment
  WHERE nstemi_confirmed_at BETWEEN p_from AND p_to
),
ut AS (
  SELECT * FROM unstableangina_treatment
  WHERE ua_confirmed_at BETWEEN p_from AND p_to
),
so AS (
  SELECT * FROM stemi_outcome
  WHERE (death_datetime BETWEEN p_from AND p_to)
     OR (discharge_datetime BETWEEN p_from AND p_to)
     OR (absconded_datetime BETWEEN p_from AND p_to)
),
no AS (
  SELECT * FROM nstemi_outcome
  WHERE (death_datetime BETWEEN p_from AND p_to)
     OR (discharge_datetime BETWEEN p_from AND p_to)
     OR (absconded_datetime BETWEEN p_from AND p_to)
),
uo AS (
  SELECT * FROM unstableangina_outcome
  WHERE (death_datetime BETWEEN p_from AND p_to)
     OR (discharge_datetime BETWEEN p_from AND p_to)
     OR (absconded_datetime BETWEEN p_from AND p_to)
)

SELECT
    /* Admitted ACS = STEMI + NSTEMI + UA */
(
  /* STEMI */
  COALESCE((SELECT COUNT(*) FROM sa WHERE is_admitted = TRUE), 0)
  +
  /* NSTEMI */
  COALESCE((
      SELECT COUNT(*) FROM nt 
      WHERE icu_admission = TRUE
         OR hospital_stay_days IS NOT NULL
         OR cath_lab_arrival IS NOT NULL
         OR balloon_inflation IS NOT NULL
  ), 0)
  +
  /* Unstable Angina */
  COALESCE((
      SELECT COUNT(*) FROM ut 
      WHERE icu_admission = TRUE
         OR hospital_stay_days IS NOT NULL
  ), 0)
) AS admitted_acs_total,


    COALESCE((SELECT COUNT(*) FROM sa WHERE is_admitted = TRUE),0) AS admitted_stemi,

COALESCE((
    SELECT COUNT(*) FROM nt 
    WHERE icu_admission = TRUE
       OR hospital_stay_days IS NOT NULL
       OR cath_lab_arrival IS NOT NULL
       OR balloon_inflation IS NOT NULL
),0) AS admitted_nstemi,

COALESCE((
    SELECT COUNT(*) FROM ut 
    WHERE icu_admission = TRUE
       OR hospital_stay_days IS NOT NULL
),0) AS admitted_ua,

    /* Loading dose locations aggregated across st / nstemi / ua (match by text) */
    (
      COALESCE((SELECT COUNT(*) FROM st WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_loading_dose_location WHERE name ILIKE 'By referring Hospital' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM nt WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_nstemi_loading_dose_location WHERE name ILIKE 'By referring Hospital' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM ut WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_nstemi_loading_dose_location WHERE name ILIKE 'By referring Hospital' LIMIT 1)
      ),0)
    ) AS loading_dose_by_referring,

    (
      COALESCE((SELECT COUNT(*) FROM st WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_loading_dose_location WHERE name ILIKE '108 Ambulance' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM nt WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_nstemi_loading_dose_location WHERE name ILIKE '108 Ambulance' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM ut WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_nstemi_loading_dose_location WHERE name ILIKE '108 Ambulance' LIMIT 1)
      ),0)
    ) AS loading_dose_108,

    (
      COALESCE((SELECT COUNT(*) FROM st WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_loading_dose_location WHERE name ILIKE 'Inside Hospital' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM nt WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_nstemi_loading_dose_location WHERE name ILIKE 'Inside Hospital' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM ut WHERE loading_dose_location_id =
         (SELECT id FROM lkp_stemi_nstemi_loading_dose_location WHERE name ILIKE 'Inside Hospital' LIMIT 1)
      ),0)
    ) AS loading_dose_inside,

    /* Thrombolysis (STEMI only) */
    COALESCE((SELECT COUNT(*) FROM st WHERE thrombolysis_location_id =
        (SELECT id FROM lkp_stemi_thrombolysis_location WHERE name ILIKE 'By referring Hospital' LIMIT 1)
        AND thrombolytic_agent_id IS NOT NULL
    ),0) AS thrombolysis_outside,

    COALESCE((SELECT COUNT(*) FROM st WHERE thrombolysis_location_id =
        (SELECT id FROM lkp_stemi_thrombolysis_location WHERE name ILIKE 'Inside Hospital' LIMIT 1)
        AND thrombolytic_agent_id IS NOT NULL
    ),0) AS thrombolysis_inside,

    COALESCE((SELECT COUNT(*) FROM st WHERE thrombolysis_location_id =
        (SELECT id FROM lkp_stemi_thrombolysis_location WHERE name ILIKE 'Not done, planned PPCI' LIMIT 1)
    ),0) AS thrombolysis_not_done_planned_ppci,

    COALESCE((SELECT COUNT(*) FROM st WHERE thrombolysis_outcome_id =
        (SELECT id FROM lkp_stemi_thrombolysis_outcome WHERE name ILIKE 'Successful Thrombolysis%' LIMIT 1)
    ),0) AS successful_thrombolysis,

    COALESCE((SELECT COUNT(*) FROM st WHERE thrombolysis_outcome_id =
        (SELECT id FROM lkp_stemi_thrombolysis_outcome WHERE name ILIKE 'Failed Thrombolysis%' LIMIT 1)
    ),0) AS failed_thrombolysis,

    COALESCE((SELECT COUNT(*) FROM st WHERE thrombolysis_outcome_id =
        (SELECT id FROM lkp_stemi_thrombolysis_outcome WHERE name ILIKE 'Failed Thrombolysis%' LIMIT 1)
        AND cath_lab_arrival IS NOT NULL
    ),0) AS rescue_pci,

    /* PPCI / PCI: count evidence of PCI across ST/NSTEMI/UA (balloon_inflation or stent) */
(
    /* STEMI PCI (balloon_inflation timestamp) */
    COALESCE((SELECT COUNT(*) FROM st WHERE st.balloon_inflation IS NOT NULL),0)
    +
    /* NSTEMI PCI (balloon_inflation timestamp) */
    COALESCE((SELECT COUNT(*) FROM nt WHERE nt.balloon_inflation IS NOT NULL),0)
    +
    /* UA PCI (door_to_balloon varchar) */
    COALESCE((SELECT COUNT(*) FROM ut 
              WHERE ut.door_to_balloon IS NOT NULL 
                AND ut.door_to_balloon <> ''),0)
) AS ppci_total,


    /* Medical management across all three (match conservative strategy names) */
    (
      COALESCE((SELECT COUNT(*) FROM st WHERE treatment_strategy_id =
         (SELECT id FROM lkp_stemi_treatment_strategy WHERE name ILIKE '%Conservative%' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM nt WHERE treatment_strategy_id =
         (SELECT id FROM lkp_stemi_nstemi_treatment_strategy WHERE name ILIKE '%Conservative%' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM ut WHERE management_id ILIKE '%Conservative%' OR (SELECT 0) = 1),0)
    ) AS medical_management_total,

    /* Referred for CABG across all three (match 'CABG' in treatment strategy) */
    (
      COALESCE((SELECT COUNT(*) FROM st WHERE treatment_strategy_id =
         (SELECT id FROM lkp_stemi_treatment_strategy WHERE name ILIKE '%CABG%' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM nt WHERE treatment_strategy_id =
         (SELECT id FROM lkp_stemi_nstemi_treatment_strategy WHERE name ILIKE '%CABG%' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM ut WHERE management_id ILIKE '%CABG%' ),0)
    ) AS referred_for_cabg_total,

    /* Abscond across outcome tables */
    (
      COALESCE((SELECT COUNT(*) FROM so WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_outcome_type WHERE name ILIKE 'Absconded' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM no WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_nstemi_outcome_type WHERE name ILIKE 'Absconded' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM uo WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_nstemi_outcome_type WHERE name ILIKE 'Absconded' LIMIT 1)
      ),0)
    ) AS absconded_total,

    /* Total Deaths across ACS */
    (
      COALESCE((SELECT COUNT(*) FROM so WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_outcome_type WHERE name ILIKE 'Death' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM no WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_nstemi_outcome_type WHERE name ILIKE 'Death' LIMIT 1)
      ),0)
    +
      COALESCE((SELECT COUNT(*) FROM uo WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_nstemi_outcome_type WHERE name ILIKE 'Death' LIMIT 1)
      ),0)
    ) AS total_deaths,

    /* Death breakdowns: match timings by name patterns in respective death timing lookups */
    (
      COALESCE(
        (SELECT COUNT(*) FROM so WHERE death_timing_id =
           (SELECT id FROM lkp_stemi_death_timing WHERE name ILIKE 'Death Before Treatment Initiated' LIMIT 1)
        ),0
      )
    +
      COALESCE(
        (SELECT COUNT(*) FROM no WHERE death_timing_id =
           (SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE 'Death Before Treatment Initiated' LIMIT 1)
        ),0
      )
    +
      COALESCE(
        (SELECT COUNT(*) FROM uo WHERE death_timing_id =
           (SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE 'Death Before Treatment Initiated' LIMIT 1)
        ),0
      )
    ) AS death_before_treatment,

    /* death after PCI / PPCI – match any timing name containing 'PCI' or 'PPCI' (stemi uses lkp_stemi_death_timing; nstemi/ua use nstemi death timing) */
    (
      COALESCE((SELECT COUNT(*) FROM so WHERE death_timing_id IN (
            SELECT id FROM lkp_stemi_death_timing WHERE name ILIKE '%PPCI%' OR name ILIKE '%PCI%'
      )),0)
    +
      COALESCE((SELECT COUNT(*) FROM no WHERE death_timing_id IN (
            SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE '%PCI%'
      )),0)
    +
      COALESCE((SELECT COUNT(*) FROM uo WHERE death_timing_id IN (
            SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE '%PCI%'
      )),0)
    ) AS death_after_ppci,

    /* death after Thrombolysis (STEMI only) */
    COALESCE((SELECT COUNT(*) FROM so WHERE death_timing_id =
      (SELECT id FROM lkp_stemi_death_timing WHERE name ILIKE '%Thrombolysis%' LIMIT 1)
    ),0) AS death_after_thrombolysis,

    /* death after pharmaco-invasive PCI (stemi lookup) */
    COALESCE((SELECT COUNT(*) FROM so WHERE death_timing_id =
      (SELECT id FROM lkp_stemi_death_timing WHERE name ILIKE '%Pharmaco-invasive%' LIMIT 1)
    ),0) AS death_after_pharmaco_invasive,

    /* death after Rescue PCI (stemi lookup) */
    COALESCE((SELECT COUNT(*) FROM so WHERE death_timing_id =
      (SELECT id FROM lkp_stemi_death_timing WHERE name ILIKE '%Rescue PCI%' LIMIT 1)
    ),0) AS death_after_rescue_pci,

    /* death after medical management (any table that has timing matching 'Medical') */
    (
      COALESCE((SELECT COUNT(*) FROM so WHERE death_timing_id IN (
            SELECT id FROM lkp_stemi_death_timing WHERE name ILIKE '%Medical%'
      )),0)
    +
      COALESCE((SELECT COUNT(*) FROM no WHERE death_timing_id IN (
            SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE '%Medical%'
      )),0)
    +
      COALESCE((SELECT COUNT(*) FROM uo WHERE death_timing_id IN (
            SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE '%Medical%'
      )),0)
    ) AS death_after_medical_management,

    /* Others = deaths that are of type Death but do not match above timing patterns (fallback) */
    (
      (COALESCE((SELECT COUNT(*) FROM so WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_outcome_type WHERE name ILIKE 'Death' LIMIT 1)
         AND (
            (death_timing_id IS NULL)
            OR (death_timing_id NOT IN (
                SELECT id FROM lkp_stemi_death_timing WHERE name ILIKE '%Before Treatment Initiated%' 
                 OR name ILIKE '%PPCI%' OR name ILIKE '%PCI%' OR name ILIKE '%Thrombolysis%'
                 OR name ILIKE '%Pharmaco-invasive%' OR name ILIKE '%Rescue%' OR name ILIKE '%Medical%'
            ))
         )
      ),0))
    +
      (COALESCE((SELECT COUNT(*) FROM no WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_nstemi_outcome_type WHERE name ILIKE 'Death' LIMIT 1)
         AND (
            (death_timing_id IS NULL)
            OR (death_timing_id NOT IN (
               SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE '%Before Treatment Initiated%' 
                 OR name ILIKE '%PCI%' OR name ILIKE '%Medical%'
            ))
         )
      ),0))
    +
      (COALESCE((SELECT COUNT(*) FROM uo WHERE outcome_type_id =
         (SELECT id FROM lkp_stemi_nstemi_outcome_type WHERE name ILIKE 'Death' LIMIT 1)
         AND (
            (death_timing_id IS NULL)
            OR (death_timing_id NOT IN (
               SELECT id FROM lkp_stemi_nstemi_death_timing WHERE name ILIKE '%Before Treatment Initiated%' 
                 OR name ILIKE '%PCI%' OR name ILIKE '%Medical%'
            ))
         )
      ),0))
    ) AS death_others
;
END;
$$ LANGUAGE plpgsql;
