CREATE OR REPLACE FUNCTION get_trauma__kpi_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    inst_id INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_cases_108 INT;
    v_total_ed_cases INT;
    v_trauma_108 INT;
    v_total_trauma INT;
    v_avg_transport_time NUMERIC(10,2);
    v_trauma_admitted INT;
    v_trauma_discharged INT;
    v_red_admitted INT;
    v_red_discharged INT;
    v_total_trauma_flags INT;
    v_total_death INT;
    v_total_cases INT;
    v_trauma_referred_out INT;
BEGIN
    -- 1.1 Total 108 Cases
    SELECT COUNT(*) INTO v_total_cases_108
    FROM triage t
    WHERE mode_of_arrival = 1
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 1.2 Total ER Cases
    SELECT COUNT(*) INTO v_total_ed_cases
    FROM triage t
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 2.1 Trauma by 108
    SELECT COUNT(*) INTO v_trauma_108
    FROM triage t 
    INNER JOIN emo_triage te ON t.id = te.triage_id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND emergency_category = 1
      AND mode_of_arrival = 1
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 2.2 Total Trauma
    SELECT COUNT(*) INTO v_total_trauma
    FROM triage t 
    INNER JOIN emo_triage te ON t.id = te.triage_id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND emergency_category = 1
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 3. Avg transportation time (minutes)
    SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (date_time_of_triage - date_and_time_of_incident)) / 60), 2), 0)
    INTO v_avg_transport_time
    FROM triage t 
    INNER JOIN emo_triage te ON t.id = te.triage_id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND emergency_category = 1
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 4.1 Trauma Admitted
    SELECT COUNT(*) INTO v_trauma_admitted
    FROM triage t 
    INNER JOIN trauma te ON t.id = te.triage_id
    WHERE patient_admitted IS TRUE
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 4.2 Trauma Discharged
    SELECT COUNT(*) INTO v_trauma_discharged
    FROM triage t 
    INNER JOIN trauma te ON t.id = te.triage_id
    INNER JOIN trauma_outcome tro ON tro.trauma_id = te.id
    WHERE patient_admitted IS TRUE
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND tro.outcome = 2
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 5.1 Red Flag Admitted
    SELECT COUNT(*) INTO v_red_admitted
    FROM triage t 
    INNER JOIN triage_dtls td ON td.triage_id = t.id 
    INNER JOIN trauma te ON t.id = te.triage_id
    WHERE patient_admitted IS TRUE
      AND triage_flag = 1
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 5.2 Red Flag Discharged
    SELECT COUNT(*) INTO v_red_discharged
    FROM triage t 
    INNER JOIN trauma te ON t.id = te.triage_id
    INNER JOIN trauma_outcome tro ON tro.trauma_id = te.id
    INNER JOIN triage_dtls td ON td.triage_id = t.id 
    WHERE patient_admitted IS TRUE
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND tro.outcome = 2
      AND triage_flag = 1
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 6.1 Total ER Red/Yellow/Green
    SELECT COUNT(*) INTO v_total_trauma_flags
    FROM triage t 
    INNER JOIN trauma te ON t.id = te.triage_id
    INNER JOIN triage_dtls td ON td.triage_id = t.id 
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND triage_flag IN (1,2,3)
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 6.2 Death Count
    SELECT COUNT(*) INTO v_total_death
    FROM triage t 
    INNER JOIN trauma te ON t.id = te.triage_id
    INNER JOIN trauma_outcome tro ON tro.trauma_id = te.id
    INNER JOIN triage_dtls td ON td.triage_id = t.id 
    WHERE patient_admitted IS TRUE
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND tro.outcome = 6
      AND triage_flag IN (1,2,3)
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 8.1 Total ED Cases
    SELECT COUNT(*) INTO v_total_cases
    FROM triage t
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 9.2 Referred Out
    SELECT COUNT(*) INTO v_trauma_referred_out
    FROM triage t 
    INNER JOIN trauma te ON t.id = te.triage_id
    INNER JOIN trauma_outcome tro ON tro.trauma_id = te.id
    WHERE patient_admitted IS TRUE
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND tro.outcome = 9
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- ✅ Return combined JSON
    RETURN json_build_object(
        'total_cases_108', v_total_cases_108,
        'total_ed_cases', v_total_ed_cases,
        'trauma_by_108', v_trauma_108,
        'total_trauma', v_total_trauma,
        'avg_transport_time', v_avg_transport_time,
        'trauma_admitted', v_trauma_admitted,
        'trauma_discharged', v_trauma_discharged,
        'red_admitted', v_red_admitted,
        'red_discharged', v_red_discharged,
        'total_trauma_flags', v_total_trauma_flags,
        'total_death', v_total_death,
        'total_cases', v_total_cases,
        'trauma_referred_out', v_trauma_referred_out
    );
END;
$$;


CREATE OR REPLACE FUNCTION get_burns_kpi_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    p_inst_id INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_dashboard JSON;
    v_referral JSON;
    v_result JSON;
BEGIN
    -- 1️⃣ Build Main Dashboard KPIs
    SELECT json_build_object(
        'pct_fluid_resuscitation_within_1hr',
        ROUND(
            100.0 * SUM(CASE WHEN b.is_fluid_resuscitation_given = TRUE THEN 1 ELSE 0 END)
            / NULLIF(SUM(CASE WHEN b.admitted = TRUE THEN 1 ELSE 0 END), 0),
            2
        ),
        'pct_wound_sepsis',
        ROUND(
            100.0 * COUNT(DISTINCT bv.burns_id) FILTER (WHERE 4 = ANY(bv.complications_hospital_stay))
            / NULLIF(COUNT(DISTINCT b.id) FILTER (WHERE b.admitted = TRUE), 0),
            2
        ),
        'pct_survived_tbsa_over_40',
        ROUND(
    100.0 * COUNT(*) FILTER (
        WHERE CAST(REGEXP_REPLACE(b.tbsa_total_per, '[^0-9\.]', '', 'g') AS NUMERIC) >= 40
          AND bro.outcome IN (1, 2, 3)
    )
    / NULLIF(
        COUNT(*) FILTER (
            WHERE CAST(REGEXP_REPLACE(b.tbsa_total_per, '[^0-9\.]', '', 'g') AS NUMERIC) >= 40
        ),
        0
    ),
    2
),
        'in_hospital_mortality_rate',
        ROUND(
            100.0 * COUNT(*) FILTER (WHERE bro.outcome = 5)
            / NULLIF(COUNT(*) FILTER (WHERE b.admitted = TRUE), 0),
            2
        ),
        'pct_referred_out',
        ROUND(
            100.0 * COUNT(*) FILTER (WHERE bro.outcome = 6)
            / NULLIF(COUNT(*) FILTER (WHERE b.admitted = TRUE), 0),
            2
        ),
        'surgical_intervention_rate',
        ROUND(
            100.0 * COUNT(DISTINCT b.id) FILTER (
                WHERE bv.is_surgery_emergency = TRUE
                   OR bse.id IS NOT NULL
            )
            / NULLIF(
                COUNT(*) FILTER (WHERE b.admitted = TRUE),
                0
            ),
            2
        ),
        'avg_length_of_stay',
        ROUND(
            AVG(EXTRACT(DAY FROM (bro.discharge_date - b.admission_date))),
            2
        )
    )
    INTO v_dashboard
    FROM burns b
    LEFT JOIN burns_values bv ON b.id = bv.burns_id
    LEFT JOIN burns_outcome bro ON bro.burns_id = b.id
    LEFT JOIN burns_surgery_elective bse ON b.id = bse.burns_id
    WHERE DATE(b.inserted_date) BETWEEN p_from_date AND p_to_date
      AND (p_inst_id = 0 OR b.user_id = p_inst_id);

    -- 2️⃣ Build Referral Reason Summary
    SELECT json_agg(row_to_json(x)) 
    INTO v_referral
    FROM (SELECT 
        COALESCE(l.name, 'Not Specified') AS reason_for_referral,
        COUNT(*) AS total_cases FROM burns_outcome bro
    LEFT JOIN lkp_reason_for_referral l ON l.id = bro.reason_for_referral
    LEFT JOIN burns b ON b.id = bro.burns_id
    WHERE DATE(b.inserted_date) BETWEEN p_from_date AND p_to_date
    AND (p_inst_id = 0 OR b.user_id = p_inst_id)
    GROUP BY COALESCE(l.name, 'Not Specified')) x;

    -- 3️⃣ Combine both parts into one JSON
    v_result := json_build_object(
        'burns_dashboard', v_dashboard,
        'referral_summary', COALESCE(v_referral, '[]'::json)
    );

    RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION get_prem_kpi_dashboard(
    p_from_date DATE,
    p_to_date   DATE,
    p_inst_id   INT  DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_dashboard   JSON;
  v_top10_pc    JSON;
  v_monthly     JSON;
  v_result      JSON;
BEGIN
  /*
    Helpers:
      - We treat "triaged in queue" as having a non-null triage_flag on PREM (best proxy with available schema).
      - PICU admission: patient_admitted = TRUE and name_of_dept ILIKE '%picu%'.
      - Death = outcome = 4 in lkp_prem_outcome.
      - “Resuscitation” = any of the listed procedures present in prem_vitals.procedures_done.
  */

  -- 1) Main KPI block
  SELECT json_build_object(
    -- Percentage of pediatric patients triaged in Queue (proxy: triage_flag present)
    'pct_triaged_in_queue',
    ROUND(
      100.0 * COUNT(*) FILTER (WHERE pr.triage_flag IS NOT NULL)
      / NULLIF(COUNT(*), 0),
      2
    ),

    -- Time to first medical contact (min): admission - triage entry
    'avg_time_to_first_medical_contact_min',
    ROUND(AVG(EXTRACT(EPOCH FROM (pr.date_of_admit - pr.date_time_of_entry)) / 60), 2),

    -- Percentage of pediatric RED cases receiving any intervention (proxy)
    -- (If you add a procedure timestamp, replace with within-15-min calculation)
    'pct_red_any_intervention',
    ROUND(
      100.0
      * COUNT(DISTINCT pr.id) FILTER (
          WHERE pr.triage_flag = 1
            AND EXISTS (
              SELECT 1
              FROM prem_vitals pv
              WHERE pv.prem_id = pr.id
                AND pv.procedures_done IS NOT NULL
                AND CARDINALITY(pv.procedures_done) > 0
            )
        )
      / NULLIF(COUNT(*) FILTER (WHERE pr.triage_flag = 1), 0),
      2
    ),

    -- TODO (when procedure timestamp exists, e.g. pv.procedure_time):
    -- 'pct_red_intervened_within_15_min',
    -- ROUND(
    --   100.0 * COUNT(DISTINCT pr.id) FILTER (
    --     WHERE pr.triage_flag = 1
    --       AND EXISTS (
    --         SELECT 1 FROM prem_vitals pv
    --         WHERE pv.prem_id = pr.id
    --           AND pv.procedure_time IS NOT NULL
    --           AND EXTRACT(EPOCH FROM (pv.procedure_time - pr.date_time_of_entry)) <= 15*60
    --       )
    --   )
    --   / NULLIF(COUNT(*) FILTER (WHERE pr.triage_flag = 1), 0),
    --   2
    -- ),

    -- Percentage stabilized and admitted to PICU
    'pct_stabilized_and_admitted_to_picu',
    ROUND(
      100.0
      * COUNT(*) FILTER (
          WHERE pr.patient_admitted = TRUE
            AND pr.name_of_dept ILIKE '%picu%'
            AND EXISTS (
              SELECT 1
              FROM prem_outcome po
              WHERE po.prem_id = pr.id
                AND po.patient_stabilised_referral = 1  -- 'Stabilised'
            )
        )
      / NULLIF(COUNT(*) FILTER (WHERE pr.patient_admitted = TRUE), 0),
      2
    ),

    -- Case fatality rate among pediatric emergency admissions
    'case_fatality_rate',
    ROUND(
      100.0
      * COUNT(*) FILTER (
          WHERE pr.patient_admitted = TRUE
            AND EXISTS (
              SELECT 1 FROM prem_outcome po
              WHERE po.prem_id = pr.id AND po.outcome = 4  -- Death
            )
        )
      / NULLIF(COUNT(*) FILTER (WHERE pr.patient_admitted = TRUE), 0),
      2
    ),

    -- Percentage requiring & receiving resuscitation (any of listed procedures) / Total admitted
    'pct_resuscitation_among_admitted',
    (
      WITH resus_ids AS (
        SELECT ARRAY_AGG(id) AS ids
        FROM lkp_prem_procedures_done
        WHERE name IN (
          'Oxygen through JR',
          'Oxygen through BVM',
          'Oxygen through ET',
          'MDI with Spacer',
          'Nebulisation',
          'Airway maneuvers: Head tilt, chin lift, Oro-pharyngeal suction, Nasogastric decompression',
          'IV access/ Intra-osseous access',
          'Fluid bolus',
          'Dopamine infusion',
          'IV Epinephrine bolus/ Infusion/ SQ Epinephrine',
          'CPR Chest compressions 15:2',
          'Anticonvulsant: BDP/ Leviteracetam/ Sodium Valproate/ MDZ/ Phenobarbitone'
        )
      )
      SELECT ROUND(
        100.0
        * COUNT(DISTINCT pr2.id) FILTER (
            WHERE pr2.patient_admitted = TRUE
              AND EXISTS (
                SELECT 1
                FROM prem_vitals pv2, resus_ids r
                WHERE pv2.prem_id = pr2.id
                  AND pv2.procedures_done && r.ids
              )
          )
        / NULLIF(COUNT(*) FILTER (WHERE pr2.patient_admitted = TRUE), 0),
        2
      )
      FROM prem pr2
      WHERE DATE(pr2.inserted_date) BETWEEN p_from_date AND p_to_date
        AND (p_inst_id = 0 OR pr2.user_id = p_inst_id)
    ),

    -- Pediatric cases registered per month (JSON array returned separately below)
    'total_registered', COUNT(*),

    -- Average length of stay (in days): exit/discharge/death - admission
    'avg_length_of_stay_days',
    ROUND(AVG(
      EXTRACT(DAY FROM (
        COALESCE(po.patient_exit_date, po.discharge_date, po.death_date) - pr.date_of_admit
      ))
    ), 2)

  )
  INTO v_dashboard
  FROM prem pr
  LEFT JOIN prem_outcome po ON po.prem_id = pr.id
  WHERE DATE(pr.inserted_date) BETWEEN p_from_date AND p_to_date
    AND (p_inst_id = 0 OR pr.user_id = p_inst_id);

  -- 2) Top 10 presenting complaints (JSON array)
  SELECT json_agg(
           json_build_object('presenting_complaint', name, 'total_cases', total_cases)
           ORDER BY total_cases DESC
         )
  INTO v_top10_pc
  FROM (
    SELECT l.name, COUNT(*) AS total_cases
    FROM prem pr
    JOIN LATERAL unnest(pr.presenting_complaints_prem) pc_id ON TRUE
    JOIN lkp_prem_presenting_complaints l ON l.id = pc_id
    WHERE DATE(pr.inserted_date) BETWEEN p_from_date AND p_to_date
      AND (p_inst_id = 0 OR pr.user_id = p_inst_id)
    GROUP BY l.name
    ORDER BY COUNT(*) DESC
    LIMIT 10
  ) x;

  -- 3) Monthly registrations (JSON array: {month: 'YYYY-MM', count: N})
  SELECT json_agg(
           json_build_object('month', to_char(month_start, 'YYYY-MM'), 'count', cnt)
           ORDER BY month_start
         )
  INTO v_monthly
  FROM (
    SELECT date_trunc('month', pr.inserted_date)::date AS month_start,
           COUNT(*) AS cnt
    FROM prem pr
    WHERE DATE(pr.inserted_date) BETWEEN p_from_date AND p_to_date
      AND (p_inst_id = 0 OR pr.user_id = p_inst_id)
    GROUP BY 1
    ORDER BY 1
  ) m;

  -- 4) Final JSON
  v_result :=
    json_build_object(
      'prem_dashboard', v_dashboard,
      'top10_presenting_complaints', COALESCE(v_top10_pc, '[]'::json),
      'monthly_registrations', COALESCE(v_monthly, '[]'::json)
    );

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION get_stroke_kpi_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    p_inst_id INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_dashboard JSON;
    v_referral JSON;
    v_result JSON;
BEGIN
    -- 1️⃣ Main Stroke Dashboard KPIs
    SELECT json_build_object(
        -- 1. % Stroke Patients Admitted
        'pct_stroke_admitted',
        ROUND(
            100.0 * COUNT(*) FILTER (WHERE s.admitted = TRUE)
            / NULLIF(COUNT(*), 0),
            2
        ),

        -- 2. Average Door-to-CT Scan Time (in minutes)
        'avg_door_to_ct_time',
        ROUND(AVG(EXTRACT(EPOCH FROM (s.ct_scan_date - s.date_time_of_entry)) / 60), 2),

        -- 3. % Ischemic Stroke Patients Thrombolyzed
        'pct_ischemic_thrombolyzed',
        ROUND(
            100.0 * COUNT(*) FILTER (WHERE s.type = 1 AND s.lysis_done = TRUE)
            / NULLIF(COUNT(*) FILTER (WHERE s.type = 1), 0),
            2
        ),

        -- 4. Average Door-to-Needle Time (in minutes)
        'avg_door_to_needle_time',
        ROUND(AVG(EXTRACT(EPOCH FROM (s.lysis_date - s.date_time_of_entry)) / 60), 2),

        -- 5. Total IFT from Spoke Hospitals
        'total_ift_spoke',
        COUNT(*) FILTER (WHERE s.referred_from = 1),

        -- 6. Stroke Mortality Rate
        'stroke_mortality_rate',
        ROUND(
            100.0 * COUNT(*) FILTER (WHERE so.outcome = 5)
            / NULLIF(COUNT(*) FILTER (WHERE s.admitted = TRUE), 0),
            2
        ),

        -- 7. Transfer-Out Percentage
        'pct_transferred_out',
        ROUND(
            100.0 * COUNT(*) FILTER (WHERE so.outcome = 8)
            / NULLIF(COUNT(*) FILTER (WHERE s.admitted = TRUE), 0),
            2
        )
    )
    INTO v_dashboard
    FROM stroke s
    LEFT JOIN stroke_outcome so ON s.id = so.stroke_id
    WHERE DATE(s.inserted_date) BETWEEN p_from_date AND p_to_date
      AND (p_inst_id = 0 OR s.user_id = p_inst_id);

    -- 2️⃣ Reason for Referral Summary
    SELECT json_agg(row_to_json(sub)) 
    INTO v_referral
    FROM (
        SELECT 
            COALESCE(l.name, 'Not Specified') AS reason_for_referral,
            COUNT(*) AS total_cases
        FROM stroke s
        LEFT JOIN lkp_stroke_reason_for_referral l ON l.id = s.reason_for_referral
        WHERE DATE(s.inserted_date) BETWEEN p_from_date AND p_to_date
          AND (p_inst_id = 0 OR s.user_id = p_inst_id)
        GROUP BY l.name
    ) sub;

    -- 3️⃣ Combine both results into single JSON
    v_result := json_build_object(
        'stroke_dashboard', v_dashboard,
        'referral_summary', COALESCE(v_referral, '[]'::json)
    );

    RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION get_stemi_kpi_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    p_inst_id INT DEFAULT 0
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_stemi JSON;
    v_nstemi JSON;
    v_angina JSON;
    v_result JSON;
BEGIN

-- ===============================================================
-- 1️⃣ STEMI INDICATORS
-- ===============================================================
SELECT json_build_object(
    'door_to_needle_time_min',
    ROUND(AVG(EXTRACT(EPOCH FROM (t.thrombolysis_start - t.stemi_confirmed_at)) / 60), 2),

    'door_to_ecg_time_min',
    ROUND(AVG(EXTRACT(EPOCH FROM (ca.ecg_datetime - ca.fmc_datetime)) / 60), 2),

    'door_to_balloon_time_min',
    ROUND(AVG(EXTRACT(EPOCH FROM (t.balloon_inflation - t.cath_lab_arrival)) / 60), 2),

    'thrombolysis_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE t.thrombolytic_agent_id IS NOT NULL)
          / NULLIF(COUNT(*), 0), 2),

    'thrombolysis_failure_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE t.thrombolysis_outcome_id = 2)
          / NULLIF(COUNT(*) FILTER (WHERE t.thrombolytic_agent_id IS NOT NULL), 0), 2),

    'referral_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE o.outcome_type_id = 6)
          / NULLIF(COUNT(*), 0), 2),

    'case_fatality_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE o.outcome_type_id = 5)
          / NULLIF(COUNT(*), 0), 2),

    'avg_length_of_stay_days',
    ROUND(AVG(t.hospital_stay_days), 2)
)
INTO v_stemi
FROM stemi_treatment t
LEFT JOIN stemi_clinical_assessment ca ON ca.triage_id = t.triage_id
LEFT JOIN stemi_outcome o ON o.triage_id = t.triage_id
WHERE DATE(t.stemi_confirmed_at) BETWEEN p_from_date AND p_to_date
  AND (p_inst_id = 0 OR t.triage_id IN (
        SELECT triage_id FROM stemi_admission WHERE department_name IS NOT NULL
      ));

-- ===============================================================
-- 2️⃣ NSTEMI INDICATORS
-- ===============================================================
SELECT json_build_object(
    'referral_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE o.outcome_type_id = 6)
          / NULLIF(COUNT(*), 0), 2),

    'case_fatality_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE o.outcome_type_id = 5)
          / NULLIF(COUNT(*), 0), 2),

    'avg_length_of_stay_days',
    ROUND(AVG(t.hospital_stay_days), 2)
)
INTO v_nstemi
FROM nstemi_treatment t
LEFT JOIN nstemi_outcome o ON o.triage_id = t.triage_id
WHERE DATE(t.nstemi_confirmed_at) BETWEEN p_from_date AND p_to_date
  AND (p_inst_id = 0 OR t.triage_id IN (
        SELECT triage_id FROM stemi_admission WHERE department_name IS NOT NULL
      ));

-- ===============================================================
-- 3️⃣ UNSTABLE ANGINA INDICATORS
-- ===============================================================
SELECT json_build_object(
    'referral_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE o.outcome_type_id = 6)
          / NULLIF(COUNT(*), 0), 2),

    'case_fatality_rate_pct',
    ROUND(100.0 * COUNT(*) FILTER (WHERE o.outcome_type_id = 5)
          / NULLIF(COUNT(*), 0), 2),

    'avg_length_of_stay_days',
    ROUND(AVG(t.hospital_stay_days), 2)
)
INTO v_angina
FROM unstableangina_treatment t
LEFT JOIN unstableangina_outcome o ON o.triage_id = t.triage_id
WHERE DATE(t.ua_confirmed_at) BETWEEN p_from_date AND p_to_date
  AND (p_inst_id = 0 OR t.triage_id IN (
        SELECT triage_id FROM stemi_admission WHERE department_name IS NOT NULL
      ));

-- ===============================================================
-- 4️⃣ COMBINE INTO SINGLE JSON RESPONSE
-- ===============================================================
v_result := json_build_object(
    'stemi_dashboard', v_stemi,
    'nstemi_dashboard', v_nstemi,
    'unstable_angina_dashboard', v_angina
);

RETURN v_result;

END;
$$;

CREATE OR REPLACE FUNCTION get_taei_kpi_dashboard(
    p_from_date DATE,
    p_to_date DATE,
	p_inst_id int
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_cases INT;
    v_total_documented INT;
    v_category JSON;
    v_presenting JSON;
    v_result JSON;
BEGIN
    -- 1️⃣ Total No. of Cases Registered
    SELECT COUNT(*) 
    INTO v_total_cases
    FROM triage
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 2️⃣ No. of Cases Documented (TAEI Case Documented = true)
    SELECT COUNT(*)
    INTO v_total_documented
    FROM triage t
    INNER JOIN trauma tm ON tm.triage_id = t.id
    INNER JOIN trauma_outcome tro ON tro.trauma_id = tm.id
    WHERE taei_case_documented IS TRUE
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 3️⃣ Category-wise Count
    SELECT json_agg(
             json_build_object(
                 'category', ec.name,
                 'total_count', COALESCE(tbl.total_cases, 0)
             ) ORDER BY COALESCE(tbl.total_cases, 0) DESC
           )
    INTO v_category
    FROM lkp_emo_emergency_category ec
    LEFT JOIN (
        SELECT emergency_category, COUNT(*) AS total_cases
        FROM triage t
        INNER JOIN emo_triage tm ON tm.triage_id = t.id
        WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
        GROUP BY emergency_category
    ) tbl ON tbl.emergency_category = ec.id;

    -- 4️⃣ Top 10 Presenting Complaints (Surgical Emergency)
    SELECT json_agg(
             json_build_object(
                 'presenting_complaint', td.name,
                 'total_count', tbl.total_count
             ) ORDER BY tbl.total_count DESC
           )
    INTO v_presenting
    FROM lkp_triage_dtls_pc_surgical_emergency td
    INNER JOIN (
        SELECT pc_surgical_emergency, COUNT(*) AS total_count
        FROM triage t
        INNER JOIN triage_dtls td ON td.triage_id = t.id
        WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
        GROUP BY pc_surgical_emergency
        ORDER BY COUNT(*) DESC
        LIMIT 10
    ) tbl ON td.id = tbl.pc_surgical_emergency;

    -- 🧩 Combine Everything into a Single JSON Result
    v_result := json_build_object(
        'total_cases_registered', v_total_cases,
        'total_cases_documented', v_total_documented,
        'category_wise_count', COALESCE(v_category, '[]'::json),
        'top10_presenting_complaints', COALESCE(v_presenting, '[]'::json)
    );

    RETURN v_result;
END;
$$;