--DROP FUNCTION get_state_report_dashboard_stroke(timestamp without time zone,timestamp without time zone)
CREATE OR REPLACE FUNCTION get_state_report_dashboard_stroke(
    p_from TIMESTAMP,
    p_to   TIMESTAMP
)
RETURNS TABLE(
    total_stroke BIGINT,
    ischemic_stroke BIGINT,
    hemorrhagic_stroke BIGINT,
    ct_done BIGINT,
    mri_done BIGINT,
    cathlab_done BIGINT,
    arrived_in_window BIGINT,
    thrombolysis_by_alteplase BIGINT,
    thrombolysis_recovered BIGINT,
    referral_from_spoke BIGINT,
    referral_from_hub BIGINT,
    referred_to_hub_after_scan BIGINT,
    thrombectomy_done BIGINT,
    surgery_done BIGINT,
    surgery_recovered BIGINT,
    stroke_deaths BIGINT,
    stroke_dama BIGINT,
    stroke_abscond BIGINT
)
AS $$
BEGIN
RETURN QUERY
WITH base AS (
    SELECT
        s.id AS stroke_id,
        s.type AS stroke_type_id,
        s.ct_scan,
        s.mri_scan,
        s.cath_lab_procedure,
        s.arrival_time_symptoms,
        s.referred_from,
        s.reason_for_referral,
        s.lysis_done,
        s.thrombolysis_by_drug,
        s.thrombectomy,
        s.decompression_craniectomy,
        so.outcome
    FROM stroke s
    LEFT JOIN stroke_outcome so ON so.stroke_id = s.id
    WHERE s.inserted_date BETWEEN p_from AND p_to
)

SELECT
    /* 1. TOTAL STROKE */
    COUNT(*) AS total_stroke,

    /* 2. ISCHEMIC */
    COUNT(*) FILTER (
        WHERE base.stroke_type_id =
            (SELECT id FROM lkp_stroke_type WHERE name ILIKE 'Ischemic')
    ) AS ischemic_stroke,

    /* 3. HEMORRHAGIC */
    COUNT(*) FILTER (
        WHERE base.stroke_type_id =
            (SELECT id FROM lkp_stroke_type WHERE name ILIKE 'Hemorrhagic')
    ) AS hemorrhagic_stroke,

    /* 4. CT DONE */
    COUNT(*) FILTER (WHERE base.ct_scan = TRUE) AS ct_done,

    /* 5. MRI DONE */
    COUNT(*) FILTER (WHERE base.mri_scan = TRUE) AS mri_done,

    /* 6. CATH LAB */
    COUNT(*) FILTER (WHERE base.cath_lab_procedure = TRUE) AS cathlab_done,

    /* 7. ARRIVED IN WINDOW (0–4.5 Hrs) */
    COUNT(*) FILTER (
        WHERE base.arrival_time_symptoms =
            (SELECT id FROM lkp_stroke_arrival_time_symptoms
             WHERE name ILIKE '0 to 4.5 Hrs')
    ) AS arrived_in_window,

    /* 8. THROMBOLYSIS BY ALTEPLASE */
    COUNT(*) FILTER (
        WHERE base.lysis_done = TRUE
          AND base.thrombolysis_by_drug =
                (SELECT id FROM lkp_stroke_thrombolysis_by_drug
                 WHERE name ILIKE 'Alteplase')
    ) AS thrombolysis_by_alteplase,

    /* 9. RECOVERED AFTER THROMBOLYSIS */
    COUNT(*) FILTER (
        WHERE base.lysis_done = TRUE
          AND base.outcome IN (
                SELECT id FROM lkp_stroke_outcome
                WHERE name ILIKE 'Discharged%'
          )
    ) AS thrombolysis_recovered,

    /* 10. REFERRAL FROM SPOKE */
    COUNT(*) FILTER (
        WHERE base.referred_from =
            (SELECT id FROM lkp_stroke_referred_from WHERE name ILIKE 'Spoke%')
    ) AS referral_from_spoke,

    /* 11. REFERRAL FROM HUB */
    COUNT(*) FILTER (
        WHERE base.referred_from =
            (SELECT id FROM lkp_stroke_referred_from WHERE name ILIKE 'HUB%')
    ) AS referral_from_hub,

    /* 12. REFERRED TO HUB (CT/MRI reason) */
    COUNT(*) FILTER (
        WHERE base.reason_for_referral =
            (SELECT id FROM lkp_stroke_reason_for_referral 
             WHERE name ILIKE 'CT/MRI')
    ) AS referred_to_hub_after_scan,

    /* 13. THROMBECTOMY DONE */
    COUNT(*) FILTER (WHERE base.thrombectomy = TRUE) AS thrombectomy_done,

    /* 14. SURGERY DONE */
    COUNT(*) FILTER (WHERE base.decompression_craniectomy = TRUE) AS surgery_done,

    /* 15. SURGERY RECOVERY */
    COUNT(*) FILTER (
        WHERE base.decompression_craniectomy = TRUE
          AND base.outcome IN (
               SELECT id FROM lkp_stroke_outcome WHERE name ILIKE 'Discharged%'
          )
    ) AS surgery_recovered,

    /* 16. DEATH */
    COUNT(*) FILTER (
        WHERE base.outcome =
            (SELECT id FROM lkp_stroke_outcome WHERE name ILIKE 'Death')
    ) AS stroke_deaths,

    /* 17. DAMA */
    COUNT(*) FILTER (
        WHERE base.outcome =
            (SELECT id FROM lkp_stroke_outcome WHERE name ILIKE 'DAMA')
    ) AS stroke_dama,

    /* 18. ABSCOND */
    COUNT(*) FILTER (
        WHERE base.outcome =
            (SELECT id FROM lkp_stroke_outcome WHERE name ILIKE 'Abscond')
    ) AS stroke_abscond

FROM base;
END;
$$ LANGUAGE plpgsql;
