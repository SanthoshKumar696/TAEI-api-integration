DROP FUNCTION IF EXISTS get_cases_108_summary(TIMESTAMP, TIMESTAMP, text);

CREATE OR REPLACE FUNCTION get_cases_108_summary(
    p_start_date TIMESTAMP,
    p_end_date   TIMESTAMP,
    p_hospital   TEXT
)
RETURNS TABLE (
    total       BIGINT,
    critical    BIGINT,
    non_critical BIGINT,
    ift         BIGINT,
    scene       BIGINT,
    emergency   BIGINT,
    admitted    BIGINT,
    pending     BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE "IsCritical" = TRUE) AS critical,
        COUNT(*) FILTER (WHERE "IsCritical" = FALSE) AS non_critical,
        COUNT(*) FILTER (WHERE "CallType" = 'IFT') AS ift,
        COUNT(*) FILTER (WHERE "CallType" = 'Scene') AS scene,
        COUNT(*) FILTER (WHERE "CallType" = 'EMERGENCY') AS emergency,
        COUNT(*) FILTER (WHERE "TriageId" IS NOT NULL) AS admitted,
        COUNT(*) FILTER (WHERE "TriageId" IS NULL) AS pending
    FROM cases_108
    WHERE ("InsertedDate"::date BETWEEN p_start_date AND p_end_date)
      AND (p_hospital IS NULL OR "HospitalName" = p_hospital);
END;
$$ LANGUAGE plpgsql STABLE;
