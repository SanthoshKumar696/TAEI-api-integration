--DROP FUNCTION get_state_report_dashboard_poison(timestamp without time zone,timestamp without time zone)
CREATE OR REPLACE FUNCTION get_state_report_dashboard_poison(
    p_from TIMESTAMP,
    p_to   TIMESTAMP
)
RETURNS TABLE (
    out_main_category varchar,
    out_sub_category varchar,
    admitted BIGINT,
    deaths BIGINT,
    referral_to_higher_centers BIGINT
)
AS $$
BEGIN
RETURN QUERY
WITH base AS (
    SELECT
        p.id AS poison_id,
        l1.name AS main_cat,
        COALESCE(l2.name,'') AS sub_cat,
        p.patient_admitted,
        po.outcome
    FROM poisons p
    LEFT JOIN lkp_poison_substance_involved l1
        ON l1.id = p.substance_involved
    LEFT JOIN lkp_poison_substance_involved_sub l2
        ON l2.id = p.substance_involved_sub
    LEFT JOIN poisons_outcome po
        ON po.poison_id = p.id
    WHERE p.inserted_date BETWEEN p_from AND p_to
)
SELECT
    base.main_cat AS out_main_category,
    base.sub_cat AS out_sub_category,
    COUNT(*) FILTER (WHERE patient_admitted = TRUE) AS admitted,
    COUNT(*) FILTER (
        WHERE outcome = (
            SELECT id FROM lkp_poison_outcome WHERE name ILIKE 'Death' LIMIT 1
        )
    ) AS deaths,
    COUNT(*) FILTER (
        WHERE outcome = (
            SELECT id FROM lkp_poison_outcome WHERE name ILIKE '%Transferred%' LIMIT 1
        )
    ) AS referral_to_higher_centers
FROM base
GROUP BY base.main_cat, base.sub_cat
ORDER BY base.main_cat, base.sub_cat;

END;
$$ LANGUAGE plpgsql;