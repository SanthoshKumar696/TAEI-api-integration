CREATE OR REPLACE FUNCTION get_prem_summary(
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP,
    p_hospital_id INT
)
RETURNS TABLE (
	total BIGINT,
	admitted BIGINT,
	male BIGINT,
	female BIGINT,
	ift BIGINT,
	red BIGINT,
	yellow BIGINT,
	green BIGINT,
	pending BIGINT
)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_triage_ids INT[];
BEGIN
    /*
     * Collect triage IDs that match the criteria
     */
    SELECT ARRAY_AGG(tr.id)
    INTO v_triage_ids
    FROM triage tr
        JOIN emo_triage emo ON emo.triage_id = tr.id AND emo.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp
        JOIN emo_triage_outcome emo_outcome 
            ON emo_outcome.emo_id = emo.id 
                and ( emo_outcome.outcome is null
                    or emo_outcome.outcome in(select id from lkp_emo_outcome where show_pillar = true)
                )
        LEFT JOIN lkp_emo_emergency_category ec ON ec.id = emo.emergency_category       
    WHERE tr.institution_id = p_hospital_id
      AND (
          -- condition 1: emergency_category in 2,4,9
          (emo.emergency_category IN (2, 4, 9))
          -- OR condition 2: pediatric (<=12 years)
          OR (tr.age_year < 12 OR (tr.age_year = 12 AND tr.age_month <= 0))
      );

    IF v_triage_ids IS NULL OR array_length(v_triage_ids, 1) IS NULL THEN
        -- No matching triage rows: return zeros (bigint)
        RETURN QUERY SELECT 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint;
        RETURN;
    END IF;

    /*
     * Compute and return the summary counts (COUNT(*) yields bigint)
     */
    RETURN QUERY
    SELECT
        -- 1. Total (count of triage ids found)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids)) AS total,

        -- 2. Admitted (patient_admitted = true)
        (SELECT COUNT(*) FROM prem p WHERE p.triage_id = ANY(v_triage_ids) AND p.patient_admitted = TRUE) AS admitted,

        -- 3. male (triage_id not present in hanging table)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.gender = 1) AS male,

		-- 4. female (type = 1)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.gender = 2) AS female,

        -- 5. IFT (scene_ift = 2)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.scene_ift = 2) AS ift,

        -- 6. red (type = 1)
        (SELECT COUNT(*) FROM triage_dtls tr WHERE tr.triage_id = ANY(v_triage_ids) AND tr.triage_flag = 1) AS red,
		
		-- 7. yellow (type = 2)
        (SELECT COUNT(*) FROM triage_dtls tr WHERE tr.triage_id = ANY(v_triage_ids) AND tr.triage_flag = 2) AS yellow,

        -- 8. green (type = 3)
        (SELECT COUNT(*) FROM triage_dtls tr WHERE tr.triage_id = ANY(v_triage_ids) AND tr.triage_flag = 3) AS green,
		
        -- 9. Pending (triage_id not present in prem table)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.id NOT IN (SELECT triage_id FROM prem)) AS pending;

END;
$$;
