CREATE OR REPLACE FUNCTION public.get_trauma_summary(
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP,
    p_hospital_id INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total INT := 0;
    v_red INT := 0;
    v_yellow INT := 0;
    v_green INT := 0;
    v_rta INT := 0;
    v_admitted INT := 0;
    v_pending INT := 0;
    v_trauma_ids INT[];
BEGIN
    ----------------------------------------------------------------
    -- Get all triage_ids matching Total condition
    ----------------------------------------------------------------
    SELECT ARRAY_AGG(tr.id)
    INTO v_trauma_ids
    FROM triage tr
    JOIN emo_triage emo ON emo.triage_id = tr.id
    JOIN emo_triage_outcome emo_outcome 
        ON emo_outcome.emo_id = emo.id 
            and ( emo_outcome.outcome is null
                or emo_outcome.outcome in(select id from lkp_emo_outcome where show_pillar = true)
            )
    WHERE tr.institution_id = p_hospital_id
      AND emo.inserted_date BETWEEN p_start_date AND p_end_date
      AND emo.emergency_category IN (1, 2);

    IF v_trauma_ids IS NULL THEN
        v_trauma_ids := ARRAY[]::INT[];
    END IF;

    v_total := COALESCE(array_length(v_trauma_ids, 1), 0);

    ----------------------------------------------------------------
    -- RED / YELLOW / GREEN (from triage_dtls)
    ----------------------------------------------------------------
    SELECT 
        COUNT(*) FILTER (WHERE td.triage_flag = 1),
        COUNT(*) FILTER (WHERE td.triage_flag = 2),
        COUNT(*) FILTER (WHERE td.triage_flag = 3)
    INTO v_red, v_yellow, v_green
    FROM triage_dtls td
    WHERE td.triage_id = ANY(v_trauma_ids);

    ----------------------------------------------------------------
    -- No of RTA (type_of_injury = 1)
    ----------------------------------------------------------------
    SELECT COUNT(*)
    INTO v_rta
    FROM trauma t
    WHERE t.triage_id = ANY(v_trauma_ids)
      AND t.type_of_injury = 1;

    ----------------------------------------------------------------
    -- Admitted (patient_admitted = TRUE)
    ----------------------------------------------------------------
    SELECT COUNT(*)
    INTO v_admitted
    FROM trauma t
    WHERE t.triage_id = ANY(v_trauma_ids)
      AND t.patient_admitted = TRUE;

    ----------------------------------------------------------------
    -- Pending (trauma not yet recorded)
    ----------------------------------------------------------------
    SELECT COUNT(*)
    INTO v_pending
    FROM unnest(v_trauma_ids) AS id
    WHERE id NOT IN (
        SELECT triage_id FROM trauma
    );

    ----------------------------------------------------------------
    -- Return Final JSON
    ----------------------------------------------------------------
    RETURN json_build_object(
        'total', v_total,
        'red', v_red,
        'yellow', v_yellow,
        'green', v_green,
        'rta', v_rta,
        'admitted', v_admitted,
        'pending', v_pending
    );
END;
$$;
