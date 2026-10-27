CREATE OR REPLACE FUNCTION get_poison_summary(
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP,
    p_hospital_id INT
)
RETURNS TABLE (
    total BIGINT,
    mild BIGINT,
    moderate BIGINT,
    severe BIGINT,
    ift BIGINT,
    admitted BIGINT,
    pending BIGINT
)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_triage_ids INT[];
BEGIN
    /*
     * Step 1: Collect triage IDs for poisons-related emergency category (5)
     */
    SELECT ARRAY_AGG(tr.id)
    INTO v_triage_ids
    FROM triage tr
    JOIN emo_triage emo ON emo.triage_id = tr.id
    JOIN emo_triage_outcome emo_outcome 
        ON emo_outcome.emo_id = emo.id 
            and ( emo_outcome.outcome is null
                or emo_outcome.outcome in(select id from lkp_emo_outcome where show_pillar = true)
            )
    WHERE 
        tr.institution_id = p_hospital_id
        AND emo.emergency_category = 5
        AND emo.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp;

    /*
     * Step 2: If no data found, return all zeros
     */
    IF v_triage_ids IS NULL OR array_length(v_triage_ids, 1) IS NULL THEN
        RETURN QUERY SELECT 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint;
        RETURN;
    END IF;

    /*
     * Step 3: Compute all required counts
     */
    RETURN QUERY
    SELECT
        -- Total
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids)) AS total,

        -- Mild (severity_of_poisoning = 1)
        (SELECT COUNT(*) FROM poisons p WHERE p.triage_id = ANY(v_triage_ids) AND p.severity_of_poisoning = 1) AS mild,

        -- Moderate (severity_of_poisoning = 2)
        (SELECT COUNT(*) FROM poisons p WHERE p.triage_id = ANY(v_triage_ids) AND p.severity_of_poisoning = 2) AS moderate,

        -- Severe (severity_of_poisoning = 3)
        (SELECT COUNT(*) FROM poisons p WHERE p.triage_id = ANY(v_triage_ids) AND p.severity_of_poisoning = 3) AS severe,

        -- IFT (scene_ift = 2 in triage)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.scene_ift = 2) AS ift,

        -- Admitted (patient_admitted = TRUE)
        (SELECT COUNT(*) FROM poisons p WHERE p.triage_id = ANY(v_triage_ids) AND p.patient_admitted = TRUE) AS admitted,

        -- Pending (triage IDs not in poisons)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.id NOT IN (SELECT triage_id FROM poisons)) AS pending;
END;
$$;
