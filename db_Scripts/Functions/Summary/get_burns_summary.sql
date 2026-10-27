CREATE OR REPLACE FUNCTION public.get_burns_summary(
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP,
    p_hospital_id INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_total INT := 0;
    v_taba_gt_40 INT := 0;
    v_taba_lt_40 INT := 0;
    v_pediatrics INT := 0;
    v_admitted INT := 0;
    v_pending INT := 0;
    v_burns_ids INT[];
BEGIN
    ----------------------------------------------------------------
    -- Collect all triage_ids (for Total)
    ----------------------------------------------------------------
    SELECT ARRAY_AGG(tr.id)
    INTO v_burns_ids
    FROM triage tr
    JOIN emo_triage emo ON emo.triage_id = tr.id
    JOIN emo_triage_outcome emo_outcome 
        ON emo_outcome.emo_id = emo.id 
            and ( emo_outcome.outcome is null
                or emo_outcome.outcome in(select id from lkp_emo_outcome where show_pillar = true)
            )
    WHERE tr.institution_id = p_hospital_id
      AND emo.inserted_date BETWEEN p_start_date AND p_end_date
      AND emo.emergency_category IN (3, 4);

    IF v_burns_ids IS NULL THEN
        v_burns_ids := ARRAY[]::INT[];
    END IF;

    v_total := COALESCE(array_length(v_burns_ids, 1), 0);

    ----------------------------------------------------------------
    -- TBSA > 40 and < 40 (robust against values like '15%', ' 15 %', 'NA', NULL)
    ----------------------------------------------------------------
	SELECT 
	    COUNT(*) FILTER (
	      WHERE (
	        regexp_replace(b.tbsa_total_per, '[^0-9.]', '', 'g') ~ '^[0-9]+(\.[0-9]+)?$'
	      )
	      AND (regexp_replace(b.tbsa_total_per, '[^0-9.]', '', 'g')::NUMERIC > 40)
	    ),
	    COUNT(*) FILTER (
	      WHERE (
	        regexp_replace(b.tbsa_total_per, '[^0-9.]', '', 'g') ~ '^[0-9]+(\.[0-9]+)?$'
	      )
	      AND (regexp_replace(b.tbsa_total_per, '[^0-9.]', '', 'g')::NUMERIC < 40)
	    )
	INTO v_taba_gt_40, v_taba_lt_40
	FROM burns b
	WHERE b.triage_id = ANY(v_burns_ids);


    ----------------------------------------------------------------
    -- Pediatrics (emergency_category = 4)
    ----------------------------------------------------------------
    SELECT COUNT(*)
    INTO v_pediatrics
    FROM emo_triage emo
    WHERE emo.triage_id = ANY(v_burns_ids)
      AND emo.emergency_category = 4;

    ----------------------------------------------------------------
    -- Admitted (burns.admitted = TRUE)
    ----------------------------------------------------------------
    SELECT COUNT(*)
    INTO v_admitted
    FROM burns b
    WHERE b.triage_id = ANY(v_burns_ids)
      AND b.admitted = TRUE;

    ----------------------------------------------------------------
    -- Pending (triage IDs not yet recorded in burns table)
    ----------------------------------------------------------------
    SELECT COUNT(*)
    INTO v_pending
    FROM unnest(v_burns_ids) AS id
    WHERE id NOT IN (SELECT triage_id FROM burns);

    ----------------------------------------------------------------
    -- Return JSON summary
    ----------------------------------------------------------------
    RETURN json_build_object(
        'total', v_total,
        'taba_gt_40', v_taba_gt_40,
        'taba_lt_40', v_taba_lt_40,
        'pediatrics', v_pediatrics,
        'admitted', v_admitted,
        'pending', v_pending
    );
END;
$$;
