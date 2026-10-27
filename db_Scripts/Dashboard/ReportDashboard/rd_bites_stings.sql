--DROP FUNCTION get_state_report_dashboard_bitestings(timestamp without time zone,timestamp without time zone)
CREATE OR REPLACE FUNCTION get_state_report_dashboard_bitestings(
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
        b.id AS case_id,
        l1.name AS main_cat,
        l2.name AS sub_cat,
        b.patient_admitted,
        bo.outcome
    FROM bites_stings b
    LEFT JOIN lkp_bite_type_of_bite_sting l1
        ON l1.id = b.type_of_bite_sting
    LEFT JOIN lkp_bite_type_of_organism l2
        ON l2.id = b.type_of_organism
    LEFT JOIN bites_stings_outcome bo
        ON bo.bites_stings_id = b.id
    WHERE b.date_time_of_entry BETWEEN p_from AND p_to
)
SELECT
    base.main_cat AS out_main_category,
    base.sub_cat AS out_sub_category,

    COUNT(*) FILTER (WHERE base.patient_admitted = TRUE) AS admitted,

    COUNT(*) FILTER (
        WHERE base.outcome = (
            SELECT id 
            FROM lkp_bite_outcome 
            WHERE name ILIKE 'Death' 
            LIMIT 1
        )
    ) AS deaths,

    COUNT(*) FILTER (
        WHERE base.outcome = (
            SELECT id 
            FROM lkp_bite_outcome
            WHERE name ILIKE '%Transferred%' 
            LIMIT 1
        )
    ) AS referral_to_higher_centers

FROM base
GROUP BY base.main_cat, base.sub_cat
ORDER BY base.main_cat, base.sub_cat;

END;
$$ LANGUAGE plpgsql;
