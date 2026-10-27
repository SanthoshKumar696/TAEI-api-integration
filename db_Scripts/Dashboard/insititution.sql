CREATE OR REPLACE FUNCTION public.ins_report_trauma_dashboard(
	p_from_date date,
	p_to_date date,
	inst_id  INT[],
	host_id integer DEFAULT 0,
	dir_id integer DEFAULT 0)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_total_admitted INT;
    v_total_treated INT;
    v_total_surgery INT;
    v_total_ift INT;
    v_outcome JSON;
    v_avg_stay NUMERIC(10,2);
BEGIN
    -- 1️⃣ Total Admitted
    SELECT COUNT(*) INTO v_total_admitted
    FROM trauma t
    INNER JOIN triage tr ON t.triage_id = tr.id
	INNER JOIN lkp_hospitals lh on tr.institution_id=lh.hospitalid and (host_id=0 OR lh.district_id=host_id) 
	AND (dir_id=0 OR mainhospitaltype=dir_id)
    WHERE patient_admitted IS TRUE
	  AND (inst_id IS NULL OR institution_id = ANY(inst_id))
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 2️⃣ Total Treated
    SELECT COUNT(*) INTO v_total_treated
    FROM triage_dtls t
    INNER JOIN triage tr ON t.triage_id = tr.id
	INNER JOIN lkp_hospitals lh on tr.institution_id=lh.hospitalid and (host_id=0 OR lh.district_id=host_id)
	AND (dir_id=0 OR mainhospitaltype=dir_id)
    WHERE 20 = ANY(presenting_complaints_prem)
      AND (inst_id IS NULL OR institution_id = ANY(inst_id))
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 3️⃣ Total Surgery
    SELECT COUNT(*) INTO v_total_surgery
    FROM trauma_final tf
    INNER JOIN trauma t ON tf.trauma_id = t.id
    INNER JOIN triage tr ON t.triage_id = tr.id
	INNER JOIN lkp_hospitals lh on tr.institution_id=lh.hospitalid and (host_id=0 OR lh.district_id=host_id)
	AND (dir_id=0 OR mainhospitaltype=dir_id)
    WHERE surgery_type IS NOT NULL
      AND (inst_id IS NULL OR institution_id = ANY(inst_id))
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 4️⃣ Total IFT
    SELECT COUNT(*) INTO v_total_ift
    FROM trauma_outcome tf
    INNER JOIN trauma t ON tf.trauma_id = t.id
    INNER JOIN triage tr ON t.triage_id = tr.id
	INNER JOIN lkp_hospitals lh on tr.institution_id=lh.hospitalid and (host_id=0 OR lh.district_id=host_id)
	AND (dir_id=0 OR mainhospitaltype=dir_id)
    WHERE outcome = 9
      AND (inst_id IS NULL OR institution_id = ANY(inst_id))
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 5️⃣ Outcome Grouped
    SELECT json_agg(row_to_json(x)) INTO v_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS total_count
        FROM lkp_trauma_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM trauma_outcome tf
            INNER JOIN trauma t ON tf.trauma_id = t.id
            INNER JOIN triage tr ON t.triage_id = tr.id
			INNER JOIN lkp_hospitals lh on tr.institution_id=lh.hospitalid and (host_id=0 OR lh.district_id=host_id)
			AND (dir_id=0 OR mainhospitaltype=dir_id)
            WHERE (inst_id IS NULL OR institution_id = ANY(inst_id))
              AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
            GROUP BY outcome
        ) tbl ON bt.id = tbl.outcome
    ) x;

    -- 6️⃣ Average Stay
    SELECT COALESCE(ROUND(AVG(stayed_duration), 2), 0) INTO v_avg_stay
    FROM trauma_outcome tf
    INNER JOIN trauma t ON tf.trauma_id = t.id
    INNER JOIN triage tr ON t.triage_id = tr.id
	INNER JOIN lkp_hospitals lh on tr.institution_id=lh.hospitalid and (host_id=0 OR lh.district_id=host_id)
	AND (dir_id=0 OR mainhospitaltype=dir_id)
    WHERE (inst_id IS NULL OR institution_id = ANY(inst_id))
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- Return all as one JSON object
    RETURN json_build_object(
        'total_admitted', v_total_admitted,
        'total_treated', v_total_treated,
        'total_surgery', v_total_surgery,
        'total_ift', v_total_ift,
        'avg_stay', v_avg_stay,
        'outcome', v_outcome
    );
END;
$BODY$;


CREATE OR REPLACE FUNCTION get_burns_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    inst_id INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_burns INT;
    v_total_treated INT;
    v_total_surgery INT;
    v_total_ift INT;
    v_outcome JSON;
    v_avg_stay NUMERIC(10,2);
BEGIN
    -- 1️⃣ Total Burns Count
    SELECT COUNT(*) INTO v_total_burns
    FROM burns
    WHERE DATE(admission_date) BETWEEN p_from_date AND p_to_date;

    -- 2️⃣ Treated
    SELECT COUNT(*) INTO v_total_treated
    FROM emo_triage et
    INNER JOIN burns t ON et.triage_id = t.triage_id
    WHERE DATE(t.admission_date) BETWEEN p_from_date AND p_to_date
      AND et.emergency_category = 3;

    -- 3️⃣ Surgery
    SELECT COUNT(*) INTO v_total_surgery
    FROM burns_values et
    INNER JOIN burns t ON et.burns_id = t.id
    WHERE DATE(t.admission_date) BETWEEN p_from_date AND p_to_date
      AND (et.surgery_emergency IS NOT NULL OR et.surgery_elective IS NOT NULL);

    -- 4️⃣ IFT
    SELECT COUNT(*) INTO v_total_ift
    FROM emo_triage et
    INNER JOIN triage t ON et.triage_id = t.id
    WHERE t.scene_ift = 2
      AND DATE(t.date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND et.emergency_category = 3;

    -- 5️⃣ Outcome (grouped)
    SELECT json_agg(row_to_json(x)) INTO v_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS total_count
        FROM lkp_burns_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM burns_outcome et
            INNER JOIN burns t ON et.burns_id = t.id
            WHERE DATE(admission_date) BETWEEN p_from_date AND p_to_date
            GROUP BY outcome
        ) tbl ON bt.id = tbl.outcome
    ) x;

    -- 6️⃣ Average Stay Duration
    SELECT COALESCE(ROUND(AVG(discharge_date::date - admission_date::date)::NUMERIC, 2), 0)
    INTO v_avg_stay
    FROM burns_outcome et
    INNER JOIN burns t ON et.burns_id = t.id
    WHERE DATE(admission_date) BETWEEN p_from_date AND p_to_date;

    -- ✅ Return all data as one JSON
    RETURN json_build_object(
        'total_burns', v_total_burns,
        'total_treated', v_total_treated,
        'total_surgery', v_total_surgery,
        'total_ift', v_total_ift,
        'avg_stay', v_avg_stay,
        'outcome', v_outcome
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_stroke_dashboard(
    p_from_date DATE,
    p_to_date DATE,
	inst_id INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_admitted INT;
    v_total_treated INT;
    v_total_thrombolysis INT;
    v_total_spoke INT;
    v_outcome JSON;
    v_avg_stay NUMERIC(10,2);
BEGIN
    -- 1️⃣ No of Stroke - Ischemic/Hemorrhagic Admitted
    SELECT COUNT(*) INTO v_total_admitted
    FROM stroke
    WHERE type IS NOT NULL
      AND admitted IS TRUE
      AND DATE(admitted_date_time) BETWEEN p_from_date AND p_to_date;

    -- 2️⃣ No of Stroke - Ischemic/Hemorrhagic Treated
    SELECT COUNT(*) INTO v_total_treated
    FROM stroke
    WHERE type IS NOT NULL
      AND DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date;

    -- 3️⃣ Thrombolysis Treated
    SELECT COUNT(*) INTO v_total_thrombolysis
    FROM stroke
    WHERE lysis_done IS TRUE
      AND DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date;

    -- 4️⃣ No of Spoke Center
    SELECT COUNT(*) INTO v_total_spoke
    FROM stroke
    WHERE referred_from = 2
      AND DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date;

    -- 5️⃣ Stroke Outcome
    SELECT json_agg(row_to_json(x)) INTO v_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS total_count
        FROM lkp_stroke_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM stroke_outcome et
            INNER JOIN stroke t ON et.stroke_id = t.id
            WHERE DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date
            GROUP BY outcome
        ) tbl ON bt.id = tbl.outcome
    ) x;

    -- 6️⃣ Hospital Stays (Average Duration)
    SELECT COALESCE(ROUND(AVG(duration_stay)::NUMERIC, 2), 0) INTO v_avg_stay
    FROM stroke_outcome et
    INNER JOIN stroke t ON et.stroke_id = t.id
    WHERE DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date;

    -- ✅ Return All Results as JSON
    RETURN json_build_object(
        'total_admitted', v_total_admitted,
        'total_treated', v_total_treated,
        'total_thrombolysis', v_total_thrombolysis,
        'total_spoke', v_total_spoke,
        'avg_stay', v_avg_stay,
        'outcome', v_outcome
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_trauma_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    inst_id INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_admitted INT;
    v_total_treated INT;
    v_total_surgery INT;
    v_total_ift INT;
    v_outcome JSON;
    v_avg_stay NUMERIC(10,2);
BEGIN
    -- 1️⃣ Total Admitted
    SELECT COUNT(*) INTO v_total_admitted
    FROM trauma t
    INNER JOIN triage tr ON t.triage_id = tr.id
    WHERE patient_admitted IS TRUE
      AND (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 2️⃣ Total Treated
    SELECT COUNT(*) INTO v_total_treated
    FROM triage_dtls t
    INNER JOIN triage tr ON t.triage_id = tr.id
    WHERE 20 = ANY(presenting_complaints_prem)
      AND (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 3️⃣ Total Surgery
    SELECT COUNT(*) INTO v_total_surgery
    FROM trauma_final tf
    INNER JOIN trauma t ON tf.trauma_id = t.id
    INNER JOIN triage tr ON t.triage_id = tr.id
    WHERE surgery_type IS NOT NULL
      AND (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 4️⃣ Total IFT
    SELECT COUNT(*) INTO v_total_ift
    FROM trauma_outcome tf
    INNER JOIN trauma t ON tf.trauma_id = t.id
    INNER JOIN triage tr ON t.triage_id = tr.id
    WHERE outcome = 9
      AND (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- 5️⃣ Outcome Grouped
    SELECT json_agg(row_to_json(x)) INTO v_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS total_count
        FROM lkp_trauma_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM trauma_outcome tf
            INNER JOIN trauma t ON tf.trauma_id = t.id
            INNER JOIN triage tr ON t.triage_id = tr.id
            WHERE (inst_id = 0 OR institution_id = inst_id)
              AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
            GROUP BY outcome
        ) tbl ON bt.id = tbl.outcome
    ) x;

    -- 6️⃣ Average Stay
    SELECT COALESCE(ROUND(AVG(stayed_duration), 2), 0) INTO v_avg_stay
    FROM trauma_outcome tf
    INNER JOIN trauma t ON tf.trauma_id = t.id
    INNER JOIN triage tr ON t.triage_id = tr.id
    WHERE (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- ✅ Return all as one JSON object
    RETURN json_build_object(
        'total_admitted', v_total_admitted,
        'total_treated', v_total_treated,
        'total_surgery', v_total_surgery,
        'total_ift', v_total_ift,
        'avg_stay', v_avg_stay,
        'outcome', v_outcome
    );
END;
$$;



CREATE OR REPLACE FUNCTION get_poison_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    inst_id INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_poison JSON;
    v_bites JSON;
    v_hanging JSON;
    v_poison_admitted INT;
    v_bites_admitted INT;
    v_hanging_admitted INT;
    v_poison_plex_done INT;
    v_ift_count INT;
    v_poison_outcome JSON;
    v_bites_outcome JSON;
    v_hanging_outcome JSON;
    v_bites_avg NUMERIC(10,2);
    v_poison_avg NUMERIC(10,2);
    v_hanging_avg NUMERIC(10,2);
    v_drowning_avg NUMERIC(10,2);
BEGIN
    -- Poison
    SELECT json_agg(row_to_json(t)) INTO v_poison
    FROM (
        SELECT lp.name, COUNT(*) AS poison_count
        FROM poisons p
        INNER JOIN triage t ON p.triage_id = t.id
        INNER JOIN lkp_poison_type_of_poisoning lp ON lp.id = p.type_of_poisoning
        WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
          AND (inst_id = 0 OR institution_id = inst_id)
        GROUP BY lp.name
    ) t;

    -- Bites/Stings
    SELECT json_agg(row_to_json(t)) INTO v_bites
    FROM (
        SELECT lp.name, COUNT(*) AS bites_stings_count
        FROM bites_stings p
        INNER JOIN triage t ON p.triage_id = t.id
        INNER JOIN lkp_bite_type_of_bite_sting lp ON lp.id = p.type_of_bite_sting
        WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
          AND (inst_id = 0 OR institution_id = inst_id)
        GROUP BY lp.name
    ) t;

    -- Hanging
    SELECT json_agg(row_to_json(t)) INTO v_hanging
    FROM (
        SELECT lp.name, COUNT(*) AS hanging_count
        FROM hanging p
        INNER JOIN triage t ON p.triage_id = t.id
        INNER JOIN lkp_hanging_nature_of_incident lp ON lp.id = p.nature_of_incident
        WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
          AND (inst_id = 0 OR institution_id = inst_id)
        GROUP BY lp.name
    ) t;

    -- Admitted counts
    SELECT COUNT(*) INTO v_poison_admitted
    FROM poisons p
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id)
      AND patient_admitted IS TRUE;

    SELECT COUNT(*) INTO v_bites_admitted
    FROM bites_stings p
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id)
      AND patient_admitted IS TRUE;

    SELECT COUNT(*) INTO v_hanging_admitted
    FROM hanging p
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id)
      AND patient_admitted IS TRUE;

    -- Poison PLEX done
    SELECT COUNT(*) INTO v_poison_plex_done
    FROM poisons p
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id)
      AND 4 = ANY(supportive_care_provided);

    -- IFT count
    SELECT COUNT(*) INTO v_ift_count
    FROM emo_triage p
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id)
      AND p.emergency_category IN (5,6,7);

    -- Poison outcome
    SELECT json_agg(row_to_json(t)) INTO v_poison_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS poison_total_count
        FROM lkp_poison_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM poisons_outcome tf
            INNER JOIN poisons t ON tf.poison_id = t.id
            INNER JOIN triage tr ON t.triage_id = tr.id
            WHERE (inst_id = 0 OR institution_id = inst_id)
              AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
            GROUP BY outcome
        ) tbl ON bt.id = tbl.outcome
    ) t;

    -- Bite outcome
    SELECT json_agg(row_to_json(t)) INTO v_bites_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS bites_total_count
        FROM lkp_poison_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM bites_stings_outcome tf
            INNER JOIN bites_stings t ON tf.bites_stings_id = t.id
            INNER JOIN triage tr ON t.triage_id = tr.id
            WHERE (inst_id = 0 OR institution_id = inst_id)
              AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
            GROUP BY outcome
        ) tbl ON bt.id = tbl.outcome
    ) t;

    -- Hanging outcome
    SELECT json_agg(row_to_json(t)) INTO v_hanging_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS hanging_total_count
        FROM lkp_poison_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM hanging_outcome tf
            INNER JOIN hanging t ON tf.hanging_id = t.id
            INNER JOIN triage tr ON t.triage_id = tr.id
            WHERE (inst_id = 0 OR institution_id = inst_id)
              AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
            GROUP BY outcome
        ) tbl ON bt.id = tbl.outcome
    ) t;

    -- Average lengths of stay
    SELECT ROUND(AVG(discharge_date::date - date_of_admit::date)::numeric, 2)
    INTO v_bites_avg
    FROM bites_stings_outcome et
    INNER JOIN bites_stings t ON et.bites_stings_id = t.id
    INNER JOIN triage tri ON tri.id = t.triage_id
    WHERE (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date;

    SELECT ROUND(AVG(discharge_date::date - date_of_admit::date)::numeric, 2)
    INTO v_poison_avg
    FROM poisons_outcome et
    INNER JOIN poisons t ON et.poison_id = t.id
    INNER JOIN triage tri ON tri.id = t.triage_id
    WHERE (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date;

    SELECT ROUND(AVG(discharge_date::date - date_of_admit::date)::numeric, 2)
    INTO v_hanging_avg
    FROM hanging_outcome et
    INNER JOIN hanging t ON et.hanging_id = t.id
    INNER JOIN triage tri ON tri.id = t.triage_id
    WHERE (inst_id = 0 OR institution_id = inst_id)
      AND DATE(date_time_of_entry) BETWEEN p_from_date AND p_to_date;

    SELECT ROUND(AVG(et.discharge_datetime::date - admission_datetime::date)::numeric, 2)
    INTO v_drowning_avg
    FROM drowning_outcome et
    INNER JOIN drowning_cases dc ON dc.triage_id = et.triage_id
    INNER JOIN triage tri ON tri.id = et.triage_id
    WHERE (inst_id = 0 OR institution_id = inst_id)
      AND DATE(tri.date_time_of_triage) BETWEEN p_from_date AND p_to_date;

    -- ✅ Final JSON return
    RETURN json_build_object(
        'poison', v_poison,
        'bites', v_bites,
        'hanging', v_hanging,
        'poison_admitted', v_poison_admitted,
        'bites_admitted', v_bites_admitted,
        'hanging_admitted', v_hanging_admitted,
        'poison_plex_done', v_poison_plex_done,
        'ift_count', v_ift_count,
        'poison_outcome', v_poison_outcome,
        'bites_outcome', v_bites_outcome,
        'hanging_outcome', v_hanging_outcome,
        'bites_avg_days', v_bites_avg,
        'poison_avg_days', v_poison_avg,
        'hanging_avg_days', v_hanging_avg,
        'drowning_avg_days', v_drowning_avg
    );
END;
$$;


CREATE OR REPLACE FUNCTION get_prem_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    inst_id INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_prem INT;
    v_scene_ift JSON;
    v_total_procedures INT;
    v_total_ift INT;
    v_outcome JSON;
    v_avg_stay NUMERIC(10,2);
BEGIN
    -- 1️⃣ Total PREM Admitted
    SELECT COUNT(*) INTO v_total_prem
    FROM prem p
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE patient_admitted IS TRUE
      AND DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id);

    -- 2️⃣ Scene / IFT Breakdown
    SELECT json_agg(row_to_json(x)) INTO v_scene_ift
    FROM (
        SELECT f.id, f.name, COALESCE(tbl.total_count, 0) AS total_count
        FROM lkp_triage_scene_ift f
        LEFT JOIN (
            SELECT scene_ift, COUNT(*) AS total_count
            FROM prem p
            INNER JOIN triage t ON p.triage_id = t.id
            WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
              AND (inst_id = 0 OR institution_id = inst_id)
            GROUP BY scene_ift
        ) tbl ON tbl.scene_ift = f.id
    ) x;

    -- 3️⃣ Procedures Done (any of 1–16)
    SELECT COUNT(*) INTO v_total_procedures
    FROM prem_vitals pv
    INNER JOIN prem p ON pv.prem_id = p.id
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id)
      AND procedures_done && ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];

    -- 4️⃣ IFT Outcome Count
    SELECT COUNT(*) INTO v_total_ift
    FROM prem_outcome pv
    INNER JOIN prem p ON pv.prem_id = p.id
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id)
      AND outcome = 7;

    -- 5️⃣ Group by Outcome
    SELECT json_agg(row_to_json(x)) INTO v_outcome
    FROM (
        SELECT bt.id, bt.name, COALESCE(tbl.total_count, 0) AS total_count
        FROM lkp_prem_outcome bt
        LEFT JOIN (
            SELECT outcome, COUNT(*) AS total_count
            FROM prem_outcome pv
            INNER JOIN prem p ON pv.prem_id = p.id
            INNER JOIN triage t ON p.triage_id = t.id
            WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
              AND (inst_id = 0 OR institution_id = inst_id)
            GROUP BY outcome
        ) tbl ON tbl.outcome = bt.id
    ) x;

    -- 6️⃣ Average Stay Duration
    SELECT COALESCE(ROUND(AVG(discharge_date::date - date_of_admit::date)::NUMERIC, 2), 0)
    INTO v_avg_stay
    FROM prem_outcome pv
    INNER JOIN prem p ON pv.prem_id = p.id
    INNER JOIN triage t ON p.triage_id = t.id
    WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND (inst_id = 0 OR institution_id = inst_id);

    -- ✅ Return combined JSON
    RETURN json_build_object(
        'total_prem_admitted', v_total_prem,
        'scene_ift', v_scene_ift,
        'total_procedures', v_total_procedures,
        'total_ift', v_total_ift,
        'avg_stay', v_avg_stay,
        'outcome', v_outcome
    );
END;
$$;

CREATE OR REPLACE FUNCTION get_stemi_dashboard(
    p_from_date DATE,
    p_to_date DATE,
    inst_id INT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_admitted INT;
    v_golden_period NUMERIC(10,2);
    v_thrombolysis_count INT;
    v_total_stemi_cases INT;
    v_total_ift INT;
    v_outcomes JSON;
    v_avg_stay JSON;
BEGIN
    -- 1️⃣ STEMI & NSTEMI Admitted
    SELECT COUNT(*) INTO v_total_admitted
    FROM stemi_admission st
    INNER JOIN stemi_clinical_assessment sc ON st.triage_id = sc.triage_id
    INNER JOIN triage t ON st.triage_id = t.id
    WHERE DATE(st.date_time_admission) BETWEEN p_from_date AND p_to_date
      AND is_admitted IS TRUE
      AND sc.diagnosis IN (2,3)
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 2️⃣ Average Golden Period (hours)
    SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (st.date_time_admission - sc.symptom_onset_datetime)) / 3600)::NUMERIC, 2), 0)
    INTO v_golden_period
    FROM stemi_admission st
    INNER JOIN triage t ON st.triage_id = t.id
    INNER JOIN stemi_clinical_assessment sc ON t.id = sc.triage_id
    WHERE DATE(st.date_time_admission) BETWEEN p_from_date AND p_to_date
      AND is_admitted IS TRUE
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 3️⃣ Thrombolysis Done (location 1,2)
    SELECT COUNT(*) INTO v_thrombolysis_count
    FROM stemi_admission st
    INNER JOIN stemi_treatment str ON str.triage_id = st.triage_id
    INNER JOIN triage t ON st.triage_id = t.id
    WHERE DATE(st.date_time_admission) BETWEEN p_from_date AND p_to_date
      AND is_admitted IS TRUE
      AND str.thrombolysis_location_id IN (1,2)
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 4️⃣ Total STEMI Cases
    SELECT COUNT(*) INTO v_total_stemi_cases
    FROM stemi_admission st
    INNER JOIN stemi_clinical_assessment str ON str.triage_id = st.triage_id
    INNER JOIN triage t ON st.triage_id = t.id
    WHERE DATE(st.date_time_admission) BETWEEN p_from_date AND p_to_date
      AND is_admitted IS TRUE
      AND str.diagnosis = 3
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 5️⃣ IFT Count
    SELECT COUNT(*) INTO v_total_ift
    FROM emo_triage et
    INNER JOIN triage t ON et.triage_id = t.id
    WHERE t.scene_ift = 2
      AND DATE(t.date_time_of_triage) BETWEEN p_from_date AND p_to_date
      AND et.emergency_category = 11
      AND (inst_id = 0 OR t.institution_id = inst_id);

    -- 6️⃣ Outcomes (STEMI + NSTEMI + Unstable Angina)
    SELECT json_agg(row_to_json(x)) INTO v_outcomes
    FROM (
        SELECT name, SUM(total_count) AS total_count
        FROM (
            SELECT bt.name, COALESCE(tbl.total_count, 0) AS total_count
            FROM lkp_stemi_outcome_type bt
            LEFT JOIN (
                SELECT outcome_type_id, COUNT(*) AS total_count
                FROM stemi_outcome et
                INNER JOIN triage t ON et.triage_id = t.id
                WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
                  AND (inst_id = 0 OR t.institution_id = inst_id)
                GROUP BY outcome_type_id
            ) tbl ON bt.id = tbl.outcome_type_id

            UNION ALL

            SELECT bt.name, COALESCE(tbl.total_count, 0)
            FROM lkp_stemi_nstemi_outcome_type bt
            LEFT JOIN (
                SELECT outcome_type_id, COUNT(*) AS total_count
                FROM nstemi_outcome et
                INNER JOIN triage t ON et.triage_id = t.id
                WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
                  AND (inst_id = 0 OR t.institution_id = inst_id)
                GROUP BY outcome_type_id
            ) tbl ON bt.id = tbl.outcome_type_id

            UNION ALL

            SELECT bt.name, COALESCE(tbl.total_count, 0)
            FROM lkp_stemi_outcome_type bt
            LEFT JOIN (
                SELECT outcome_type_id, COUNT(*) AS total_count
                FROM unstableangina_outcome et
                INNER JOIN triage t ON et.triage_id = t.id
                WHERE DATE(date_time_of_triage) BETWEEN p_from_date AND p_to_date
                  AND (inst_id = 0 OR t.institution_id = inst_id)
                GROUP BY outcome_type_id
            ) tbl ON bt.id = tbl.outcome_type_id
        ) all_outcomes
        GROUP BY name
    ) x;

    -- 7️⃣ Average Stay
    SELECT json_agg(row_to_json(x)) INTO v_avg_stay
    FROM (
        SELECT 'STEMI Avg Stay' AS name,
               COALESCE(ROUND(AVG(discharge_datetime::date - date_time_admission::date)::NUMERIC, 2), 0) AS avg_stay_days
        FROM stemi_outcome et
        INNER JOIN stemi_admission t ON et.triage_id = t.triage_id
        WHERE DATE(date_time_admission) BETWEEN p_from_date AND p_to_date
          AND (inst_id = 0 OR t.institution_id = inst_id)
        UNION ALL
        SELECT 'NSTEMI Avg Stay',
               COALESCE(ROUND(AVG(discharge_datetime::date - date_time_admission::date)::NUMERIC, 2), 0)
        FROM nstemi_outcome et
        INNER JOIN stemi_admission t ON et.triage_id = t.triage_id
        WHERE DATE(date_time_admission) BETWEEN p_from_date AND p_to_date
          AND (inst_id = 0 OR t.institution_id = inst_id)
        UNION ALL
        SELECT 'Unstable Angina Avg Stay',
               COALESCE(ROUND(AVG(discharge_datetime::date - date_time_admission::date)::NUMERIC, 2), 0)
        FROM unstableangina_outcome et
        INNER JOIN stemi_admission t ON et.triage_id = t.triage_id
        WHERE DATE(date_time_admission) BETWEEN p_from_date AND p_to_date
          AND (inst_id = 0 OR t.institution_id = inst_id)
    ) x;

    -- ✅ Return all data as JSON
    RETURN json_build_object(
        'total_admitted', v_total_admitted,
        'golden_period_hours', v_golden_period,
        'thrombolysis_done', v_thrombolysis_count,
        'total_stemi_cases', v_total_stemi_cases,
        'ift_count', v_total_ift,
        'outcomes', v_outcomes,
        'average_stay', v_avg_stay
    );
END;
$$;


