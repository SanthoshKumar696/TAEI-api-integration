CREATE OR REPLACE FUNCTION get_stroke_summary(
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP,
    p_hospital_id INT
)
RETURNS TABLE (
    total BIGINT,
    ischemic BIGINT,
    hemorrhagic BIGINT,
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
     * Collect triage IDs that match the criteria
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
        AND emo.emergency_category = 10
        AND emo.inserted_date::timestamp BETWEEN p_start_date::timestamp AND p_end_date::timestamp;

    IF v_triage_ids IS NULL OR array_length(v_triage_ids, 1) IS NULL THEN
        -- No matching triage rows: return zeros (bigint)
        RETURN QUERY SELECT 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint;
        RETURN;
    END IF;

    /*
     * Compute and return the summary counts (COUNT(*) yields bigint)
     */
    RETURN QUERY
    SELECT
        -- 1. Total (count of triage ids found)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids)) AS total,

        -- 2. Ischemic (type = 1)
        (SELECT COUNT(*) FROM stroke s WHERE s.triage_id = ANY(v_triage_ids) AND s.type = 1) AS ischemic,

        -- 3. Hemorrhagic (type = 2)
        (SELECT COUNT(*) FROM stroke s WHERE s.triage_id = ANY(v_triage_ids) AND s.type = 2) AS hemorrhagic,

        -- 4. IFT (scene_ift = 2)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.scene_ift = 2) AS ift,

        -- 5. Admitted (admitted = true)
        (SELECT COUNT(*) FROM stroke s WHERE s.triage_id = ANY(v_triage_ids) AND s.admitted = TRUE) AS admitted,

        -- 6. Pending (triage_id not present in stroke table)
        (SELECT COUNT(*) FROM triage tr WHERE tr.id = ANY(v_triage_ids) AND tr.id NOT IN (SELECT triage_id FROM stroke)) AS pending;
END;
$$;
