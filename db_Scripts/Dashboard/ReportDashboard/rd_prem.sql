
CREATE OR REPLACE FUNCTION get_state_report_dashboard_prem(
    p_from TIMESTAMP,
    p_to   TIMESTAMP
)
RETURNS TABLE(

    -- 1. Critical Etiology KPIs
    fever_alc BIGINT,
    focus_of_infection BIGINT,
    cough BIGINT,
    cold BIGINT,
    diarrhea_alc BIGINT,
    vomiting BIGINT,
    altered_loc BIGINT,
    noisy_breathing BIGINT,
    breathlessness BIGINT,
    unresponsive BIGINT,
    regained_consciousness BIGINT,
    foreign_body BIGINT,
    snake_bite BIGINT,
    scorpion_bite BIGINT,
    insect_bite BIGINT,
    dog_bite BIGINT,
    bleed BIGINT,
    rash BIGINT,
    acute_abdomen BIGINT,
    trauma BIGINT,
    burns BIGINT,
    poison BIGINT,
    submersion BIGINT,
    seizures BIGINT,
    others BIGINT,

    -- 2. Life-Saving Interventions (procedures_done)
    oxygen_nrbm BIGINT,
    oxygen_jr BIGINT,
    oxygen_bvm BIGINT,
    oxygen_et BIGINT,
    oxygen_cpap BIGINT,
    mdi_spacer BIGINT,
    nebulisation BIGINT,
    airway_manoeuvres BIGINT,
    iv_io_access BIGINT,
    fluid_bolus BIGINT,
    dopamine BIGINT,
    epinephrine BIGINT,
    cpr_chest BIGINT,
    anticonvulsants BIGINT,

    -- 3. Queue
    triaged_in_queue BIGINT,

    -- 4. Triage Flag
    red_flag BIGINT,
    yellow_flag BIGINT,
    green_flag BIGINT,
    black_flag BIGINT,

    -- 5. Outcomes
    treated_as_op BIGINT,
    discharged BIGINT,
    discharged_on_request BIGINT,
    death BIGINT,
    dama BIGINT,
    abscond BIGINT,
    transferred BIGINT,

    -- 6. Case Sheet Documentation
    case_sheet_documented BIGINT
)
AS $$
BEGIN
RETURN QUERY
WITH base AS (
    SELECT
        p.id,
        p.presenting_complaints_prem,
        p.triage_flag,
        p.is_prem_casesheet_used,

        pv.procedures_done,

        po.outcome

    FROM prem p
    LEFT JOIN prem_vitals pv ON pv.prem_id = p.id
    LEFT JOIN prem_outcome po ON po.prem_id = p.id
    WHERE p.inserted_date BETWEEN p_from AND p_to
)
SELECT
    ------------------------------------------------------------------
    -- 1. Critical Etiology (IDs from lkp_prem_presenting_complaints)
    ------------------------------------------------------------------
    COUNT(*) FILTER (WHERE 1 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 2 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 3 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 4 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 5 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 6 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 7 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 8 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 9 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 10 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 11 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 12 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 13 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 14 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 15 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 16 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 17 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 18 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 19 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 20 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 21 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 22 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 23 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 24 = ANY(base.presenting_complaints_prem)),
    COUNT(*) FILTER (WHERE 25 = ANY(base.presenting_complaints_prem)),

    ------------------------------------------------------------------
    -- 2. Life Saving Interventions (procedures_done[] using lookup order)
    ------------------------------------------------------------------
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[1]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[2]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[3]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[4]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[5]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[6]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[7]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[8]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[9]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[10]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[11]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[12]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[13]),
    COUNT(*) FILTER (WHERE base.procedures_done @> ARRAY[14]),

    ------------------------------------------------------------------
    -- 3. Triaged in Queue (Null flag)
    ------------------------------------------------------------------
    COUNT(*) FILTER (WHERE base.triage_flag IS NULL),

    ------------------------------------------------------------------
    -- 4. Triage Flags
    ------------------------------------------------------------------
    COUNT(*) FILTER (WHERE base.triage_flag =
        (SELECT id FROM lkp_prem_triage_flag WHERE name ILIKE 'Red')),
    COUNT(*) FILTER (WHERE base.triage_flag =
        (SELECT id FROM lkp_prem_triage_flag WHERE name ILIKE 'Yellow')),
    COUNT(*) FILTER (WHERE base.triage_flag =
        (SELECT id FROM lkp_prem_triage_flag WHERE name ILIKE 'Green')),
    COUNT(*) FILTER (WHERE base.triage_flag =
        (SELECT id FROM lkp_prem_triage_flag WHERE name ILIKE 'Black')),

    ------------------------------------------------------------------
    -- 5. Outcomes (lkp_prem_outcome)
    ------------------------------------------------------------------
    COUNT(*) FILTER (WHERE base.outcome =
        (SELECT id FROM lkp_prem_outcome WHERE name ILIKE 'Treated as OP')),
    COUNT(*) FILTER (WHERE base.outcome =
        (SELECT id FROM lkp_prem_outcome WHERE name ILIKE 'Discharged')),
    COUNT(*) FILTER (WHERE base.outcome =
        (SELECT id FROM lkp_prem_outcome WHERE name ILIKE 'Discharged at request')),
    COUNT(*) FILTER (WHERE base.outcome =
        (SELECT id FROM lkp_prem_outcome WHERE name ILIKE 'Death')),
    COUNT(*) FILTER (WHERE base.outcome =
        (SELECT id FROM lkp_prem_outcome WHERE name ILIKE 'DAMA')),
    COUNT(*) FILTER (WHERE base.outcome =
        (SELECT id FROM lkp_prem_outcome WHERE name ILIKE 'Absconded')),
    COUNT(*) FILTER (WHERE base.outcome =
        (SELECT id FROM lkp_prem_outcome WHERE name ILIKE 'Transferred To other Hospital')),

    ------------------------------------------------------------------
    -- 6. Case Sheet Documentation
    ------------------------------------------------------------------
    COUNT(*) FILTER (WHERE base.is_prem_casesheet_used = TRUE)

FROM base;
END;
$$ LANGUAGE plpgsql;
