CREATE OR REPLACE FUNCTION get_cases108_filtered_list(
    p_from_date DATE,
    p_to_date DATE,
    p_hospital_name TEXT DEFAULT NULL,
    p_case_id INT DEFAULT NULL,
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0
)
RETURNS JSON AS
$$
DECLARE
    v_total_count INT;
    v_data JSON;
BEGIN
    -- Get total count
    SELECT COUNT(*)
    INTO v_total_count
    FROM cases_108 c
    WHERE "InsertedDate" >= p_from_date
      AND "InsertedDate" < (p_to_date + INTERVAL '1 day')
      AND (p_hospital_name IS NULL OR "HospitalName" = p_hospital_name)
      AND (p_case_id IS NULL OR "CaseId" = p_case_id)
      AND "Emergency_Type" <> 'Pregnancy related';

    -- Get data with pagination
    SELECT COALESCE(json_agg(row_to_json(x)), '[]'::json)
    INTO v_data
    FROM (
        SELECT *
        FROM cases_108 c
        WHERE "InsertedDate" >= p_from_date
          AND "InsertedDate" < (p_to_date + INTERVAL '1 day')
          AND (p_hospital_name IS NULL OR "HospitalName" = p_hospital_name)
          AND (p_case_id IS NULL OR "CaseId" = p_case_id)
          AND "Emergency_Type" <> 'Pregnancy related'
        ORDER BY "InsertedDate" DESC
        LIMIT p_limit
        OFFSET p_offset
    ) x;

    -- Return combined result
    RETURN json_build_object(
        'totalItems', v_total_count,
        'totalPages', CEIL(v_total_count::DECIMAL / p_limit),
        'currentPage', (p_offset / p_limit) + 1,
        'data', v_data
    ) as data;
END;
$$
LANGUAGE plpgsql;
