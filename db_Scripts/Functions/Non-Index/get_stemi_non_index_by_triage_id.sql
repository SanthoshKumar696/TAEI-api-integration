CREATE OR REPLACE FUNCTION public.get_stemi_non_index_by_triage_id(
    triage_id_input INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
AS $BODY$
DECLARE
    -- STEMI
    stemi_admission_json JSON;
    stemi_ca_json JSON;
    stemi_treatment_json JSON;
    stemi_outcome_json JSON;

    -- NSTEMI
    nstemi_treatment_json JSON;
    nstemi_outcome_json JSON;

    -- Unstable Angina
    ua_treatment_json JSON;
    ua_outcome_json JSON;

BEGIN
    ------------------------------------------------------------------------
    -- 1. STEMI ADMISSION
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', a.id,
        'is_admitted', CASE WHEN a.is_admitted THEN 'Yes' ELSE 'No' END,
        'date_time_entry', to_char(a.date_time_entry, 'DD-Mon-YYYY HH12:MI AM'),
        'department_name', a.department_name,
        'date_time_admission', to_char(a.date_time_admission, 'DD-Mon-YYYY HH12:MI AM')
    )
    INTO stemi_admission_json
    FROM stemi_admission a
    WHERE a.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 2. STEMI CLINICAL ASSESSMENT
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', ca.id,
        'symptom_onset_datetime', to_char(ca.symptom_onset_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'risk_factors', ca.risk_factors,
        'other_risk_factor', ca.other_risk_factor,
        'signs_symptoms', ca.signs_symtoms,
        'fmc_type', fmc.name,
        'fmc_datetime', to_char(ca.fmc_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'ecg_datetime', to_char(ca.ecg_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'ecg_location', el.name,
        'diagnosis', d.name,
        'other_diagnosis', ca.other_dignosis
    )
    INTO stemi_ca_json
    FROM stemi_clinical_assessment ca
    LEFT JOIN lkp_stemi_fmc_master fmc ON fmc.id = ca.fmc_type
    LEFT JOIN lkp_stemi_ecg_location_master el ON el.id = ca.ecg_location
    LEFT JOIN lkp_stemi_diagnosis_master d ON d.id = ca.diagnosis
    WHERE ca.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 3. STEMI TREATMENT
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', t.id,
        'stemi_confirmed_at', to_char(t.stemi_confirmed_at, 'DD-Mon-YYYY HH12:MI AM'),
        'infarction_location', inf.name,
        'loading_dose_location', ldl.name,
        'loading_dose_drug', ldd.name,
        'loading_dose_time', to_char(t.loading_dose_time, 'DD-Mon-YYYY HH12:MI AM'),
        'loading_dose_administration_date', to_char(t.loading_dose_administration_date, 'DD-Mon-YYYY HH12:MI AM'),
        'thrombolysis_location', tl.name,
        'thrombolytic_agent', ta.name,
        'thrombolysis_start', to_char(t.thrombolysis_start, 'DD-Mon-YYYY HH12:MI AM'),
        'thrombolysis_end', to_char(t.thrombolysis_end, 'DD-Mon-YYYY HH12:MI AM'),
        'thrombolysis_outcome', to2.name,
        'thrombolysis_not_done_reason', t.thrombolysis_not_done_reason,
        'thrombolysis_date', to_char(t.thrombolysis_date, 'DD-Mon-YYYY HH12:MI AM'),
        'treatment_strategy', ts.name,
        'killip_risk_score', ks.name,
        'planned_cag', t.planned_cag,
        'cath_lab_arrival', to_char(t.cath_lab_arrival, 'DD-Mon-YYYY HH12:MI AM'),
        'balloon_inflation', to_char(t.balloon_inflation, 'DD-Mon-YYYY HH12:MI AM'),
        'stent_type', st.name,
        'complications', t.complications,
        'other_complications', t.other_complications,
        'transfer_location', tlc.name,
        'counselling_id', t.counselling_id,
        'symptom_to_fmc', t.symptom_to_fmc,
        'fmc_to_ecg', t.fmc_to_ecg,
        'door_to_needle', t.door_to_needle,
        'door_to_balloon', t.door_to_balloon,
        'total_ischemic_time', t.total_ischemic_time,
        'icu_admission', t.icu_admission,
        'hospital_stay_days', t.hospital_stay_days,
        'in_hospital_complication', t.in_hospital_complication,
        'coronory_angiography', ca2.name
    )
    INTO stemi_treatment_json
    FROM stemi_treatment t
    LEFT JOIN lkp_stemi_infarction_location inf ON inf.id = t.infarction_location_id
    LEFT JOIN lkp_stemi_loading_dose_location ldl ON ldl.id = t.loading_dose_location_id
    LEFT JOIN lkp_stemi_loading_dose_drug ldd ON ldd.id = t.loading_dose_drug_id
    LEFT JOIN lkp_stemi_thrombolysis_location tl ON tl.id = t.thrombolysis_location_id
    LEFT JOIN lkp_stemi_thrombolytic_agent ta ON ta.id = t.thrombolytic_agent_id
    LEFT JOIN lkp_stemi_thrombolysis_outcome to2 ON to2.id = t.thrombolysis_outcome_id
    LEFT JOIN lkp_stemi_treatment_strategy ts ON ts.id = t.treatment_strategy_id
    LEFT JOIN lkp_stemi_killip_risk_score ks ON ks.id = t.killip_risk_score_id
    LEFT JOIN lkp_stemi_stent_type st ON st.id = t.stent_type_id
    LEFT JOIN lkp_stemi_transfer_location tlc ON tlc.id = t.transfer_location_id
    LEFT JOIN lkp_stemi_coronory_angiography ca2 ON ca2.id = t.coronory_angiography_id
    WHERE t.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 4. STEMI OUTCOME
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', o.id,
        'outcome_type', ot.name,
        'discharge_datetime', to_char(o.discharge_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_datetime', to_char(o.absconded_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'death_datetime', to_char(o.death_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'death_timing', dt.name,
        'other_death_timing', o.other_death_timing,
        'cause_of_death', o.cause_of_death,
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
        'referral_reason', rr.name,
        'other_referral_reason', o.other_referral_reason,
        'patient_condition', pc.name,
        'referring_doctor', o.referring_doctor,
        'documented_in_taei_case_sheet', CASE WHEN o.documented_in_taei_case_sheet THEN 'Yes' ELSE 'No' END
    )
    INTO stemi_outcome_json
    FROM stemi_outcome o
    LEFT JOIN lkp_stemi_outcome_type ot ON ot.id = o.outcome_type_id
    LEFT JOIN lkp_stemi_death_timing dt ON dt.id = o.death_timing_id
    LEFT JOIN lkp_stemi_hospital_type ht ON ht.id = o.hospital_type_id
    LEFT JOIN lkp_stemi_referral_reason rr ON rr.id = o.referral_reason_id
    LEFT JOIN lkp_stemi_patient_condition pc ON pc.id = o.patient_condition_id
    WHERE o.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 5. NSTEMI TREATMENT
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', nt.id,
        'nstemi_confirmed_at', to_char(nt.nstemi_confirmed_at, 'DD-Mon-YYYY HH12:MI AM'),
        'loading_dose_location', ldl.name,
        'loading_dose_drug', ldd.name,
        'loading_dose_time', to_char(nt.loading_dose_time, 'DD-Mon-YYYY HH12:MI AM'),
        'loading_dose_administration_date', to_char(nt.loading_dose_administration_date,'DD-Mon-YYYY HH12:MI AM'),
        'timi_risk_score', ts2.name,
        'treatment_strategy', ntts.name,
        'planned_cag', nt.planned_cag,
        'cath_lab_arrival', to_char(nt.cath_lab_arrival, 'DD-Mon-YYYY HH12:MI AM'),
        'balloon_inflation', to_char(nt.balloon_inflation, 'DD-Mon-YYYY HH12:MI AM'),
        'stent_type', st2.name,
        'complications', nt.complications,
        'other_complications', nt.other_complications,
        'transfer_location', tlc2.name,
        'symptom_to_fmc', nt.symptom_to_fmc,
        'fmc_to_ecg', nt.fmc_to_ecg,
        'door_to_balloon', nt.door_to_balloon,
        'icu_admission', nt.icu_admission,
        'hospital_stay_days', nt.hospital_stay_days,
        'in_hospital_complications', nt.in_hospital_complications
    )
    INTO nstemi_treatment_json
    FROM nstemi_treatment nt
    LEFT JOIN lkp_stemi_nstemi_loading_dose_location ldl ON ldl.id = nt.loading_dose_location_id
    LEFT JOIN lkp_stemi_nstemi_loading_dose_drug ldd ON ldd.id = nt.loading_dose_drug_id
    LEFT JOIN lkp_stemi_timi_risk_score ts2 ON ts2.id = nt.timi_risk_score_id
    LEFT JOIN lkp_stemi_nstemi_treatment_strategy ntts ON ntts.id = nt.treatment_strategy_id
    LEFT JOIN lkp_stemi_stent_type st2 ON st2.id = nt.stent_type_id
    LEFT JOIN lkp_stemi_transfer_location tlc2 ON tlc2.id = nt.transfer_location_id
    WHERE nt.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 6. NSTEMI OUTCOME
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', o.id,
        'outcome_type', ot.name,
        'discharge_datetime', to_char(o.discharge_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_datetime', to_char(o.absconded_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'death_datetime', to_char(o.death_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'death_timing', dt.name,
        'other_death_timing', o.other_death_timing,
        'cause_of_death', o.cause_of_death,
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
        'referral_reason', rr.name,
        'other_referral_reason', o.other_referral_reason,
        'patient_condition', pc.name,
        'referring_doctor', o.referring_doctor,
        'documented_in_taei_case_sheet', CASE WHEN o.documented_in_taei_case_sheet THEN 'Yes' ELSE 'No' END
    )
    INTO nstemi_outcome_json
    FROM nstemi_outcome o
    LEFT JOIN lkp_stemi_nstemi_outcome_type ot ON ot.id = o.outcome_type_id
    LEFT JOIN lkp_stemi_nstemi_death_timing dt ON dt.id = o.death_timing_id
    LEFT JOIN lkp_stemi_hospital_type ht ON ht.id = o.hospital_type_id
    LEFT JOIN lkp_stemi_referral_reason rr ON rr.id = o.referral_reason_id
    LEFT JOIN lkp_stemi_patient_condition pc ON pc.id = o.patient_condition_id
    WHERE o.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 7. UNSTABLE ANGINA TREATMENT
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', ua.id,
        'ua_confirmed_at', to_char(ua.ua_confirmed_at, 'DD-Mon-YYYY HH12:MI AM'),
        'loading_dose_location', ldl.name,
        'loading_dose_drug', ldd.name,
        'loading_dose_time', to_char(ua.loading_dose_time, 'DD-Mon-YYYY HH12:MI AM'),
        'loading_dose_administration_date', to_char(ua.loading_dose_administration_date,'DD-Mon-YYYY HH12:MI AM'),
        'timi_risk_score', trs.name,
        'management_id', ua.management_id,
        'counselling_id', ua.counselling_id,
        'icu_admission', ua.icu_admission,
        'hospital_stay_days', ua.hospital_stay_days,
        'in_hospital_complications', ua.in_hospital_complications,
        'symptom_to_fmc', ua.symptom_to_fmc,
        'fmc_to_ecg', ua.fmc_to_ecg,
        'door_to_balloon', ua.door_to_balloon
    )
    INTO ua_treatment_json
    FROM unstableangina_treatment ua
    LEFT JOIN lkp_stemi_nstemi_loading_dose_location ldl ON ldl.id = ua.loading_dose_location_id
    LEFT JOIN lkp_stemi_nstemi_loading_dose_drug ldd ON ldd.id = ua.loading_dose_drug_id
    LEFT JOIN lkp_stemi_timi_risk_score trs ON trs.id = ua.timi_risk_score_id
    WHERE ua.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 8. UNSTABLE ANGINA OUTCOME
    ------------------------------------------------------------------------
    SELECT json_build_object(
        'id', o.id,
        'outcome_type', ot.name,
        'discharge_datetime', to_char(o.discharge_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_datetime', to_char(o.absconded_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'death_datetime', to_char(o.death_datetime, 'DD-Mon-YYYY HH12:MI AM'),
        'death_timing', dt.name,
        'other_death_timing', o.other_death_timing,
        'cause_of_death', o.cause_of_death,
        'hospital_type', ht.name,
        'destination_hospital', o.destination_hospital,
        'referral_reason', rr.name,
        'other_referral_reason', o.other_referral_reason,
        'patient_condition', pc.name,
        'referring_doctor', o.referring_doctor,
        'documented_in_taei_case_sheet', CASE WHEN o.documented_in_taei_case_sheet THEN 'Yes' ELSE 'No' END
    )
    INTO ua_outcome_json
    FROM unstableangina_outcome o
    LEFT JOIN lkp_stemi_nstemi_outcome_type ot ON ot.id = o.outcome_type_id
    LEFT JOIN lkp_stemi_nstemi_death_timing dt ON dt.id = o.death_timing_id
    LEFT JOIN lkp_stemi_hospital_type ht ON ht.id = o.hospital_type_id
    LEFT JOIN lkp_stemi_referral_reason rr ON rr.id = o.referral_reason_id
    LEFT JOIN lkp_stemi_patient_condition pc ON pc.id = o.patient_condition_id
    WHERE o.triage_id = triage_id_input
    LIMIT 1;

    ------------------------------------------------------------------------
    -- 9. RETURN FULL ACS JSON (STEMI + NSTEMI + UA)
    ------------------------------------------------------------------------
    RETURN json_build_object(
        'stemi', json_build_object(
            'admission', stemi_admission_json,
            'clinical_assessment', stemi_ca_json,
            'treatment', stemi_treatment_json,
            'outcome', stemi_outcome_json
        ),
        'nstemi', json_build_object(
            'treatment', nstemi_treatment_json,
            'outcome', nstemi_outcome_json
        ),
        'unstable_angina', json_build_object(
            'treatment', ua_treatment_json,
            'outcome', ua_outcome_json
        )
    );

END;
$BODY$;
