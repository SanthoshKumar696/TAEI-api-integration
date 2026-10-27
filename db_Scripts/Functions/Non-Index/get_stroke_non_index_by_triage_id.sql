-- FUNCTION: public.get_stroke_non_index_by_triage_id(integer)

-- DROP FUNCTION IF EXISTS public.get_stroke_non_index_by_triage_id(integer);

CREATE OR REPLACE FUNCTION public.get_stroke_non_index_by_triage_id(
	triage_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    stroke_json JSON;
    stroke_outcome_json JSON;
BEGIN
    -- 1) STROKE MAIN TABLE
    SELECT json_build_object(
        'id', s.id,
        'triage_id', s.triage_id,
        'date_time_of_entry', to_char(s.date_time_of_entry, 'DD-Mon-YYYY HH12:MI AM'),
        'arrival_time_symptoms', las.name,
        'reason_for_delay', lrd.name,
        'scene_ift', lsi.name,
        'referred_from', lrf.name,
        'reason_for_referral', lrr.name,
        'oth_reason_for_referral', s.oth_reason_for_referral,
        'admitted', CASE WHEN s.admitted THEN 'Yes' ELSE 'No' END,
        'admitted_date_time', to_char(s.admitted_date_time, 'DD-Mon-YYYY HH12:MI AM'),
        'lysis_done_outside', CASE WHEN s.lysis_done_outside THEN 'Yes' ELSE 'No' END,
        'lysis_done_outside_date', to_char(s.lysis_done_outside_date, 'DD-Mon-YYYY HH12:MI AM'),
        'symptoms', lss.name,
        'absolute_contraindication', (
            SELECT string_agg(l.name, ', ')
            FROM lkp_stroke_absolute_contraindication l
            WHERE l.id = ANY(s.absolute_contraindication)
        ),
        'oth_absolute_contraindication', s.oth_absolute_contraindication,
        'nihs_scale', lns.name,
        'cbg', CASE WHEN s.cbg THEN 'Yes' ELSE 'No' END,
        'cbg_date', to_char(s.cbg_date, 'DD-Mon-YYYY HH12:MI AM'),
		'history_of_anticoagulant', CASE WHEN s.history_of_anticoagulant THEN 'Yes' ELSE 'No' END,
		'bp_sbp', s.bp_sbp,
		'bp_dbp', s.bp_dbp,
		'aspect_score', s.aspect_score,
        'ct_scan', CASE WHEN s.ct_scan THEN 'Yes' ELSE 'No' END,
        'ct_scan_date', to_char(s.ct_scan_date, 'DD-Mon-YYYY HH12:MI AM'),
        'mri_scan', CASE WHEN s.mri_scan THEN 'Yes' ELSE 'No' END,
        'mri_scan_date', to_char(s.mri_scan_date, 'DD-Mon-YYYY HH12:MI AM'),
        'mri_scan_eligibility', lmse.name,
        'cath_lab_procedure', CASE WHEN s.cath_lab_procedure THEN 'Yes' ELSE 'No' END,
        'cath_lab_procedure_date', to_char(s.cath_lab_procedure_date, 'DD-Mon-YYYY HH12:MI AM'),
        'procedure_done', CASE WHEN s.procedure_done THEN 'Yes' ELSE 'No' END,
        'name_of_procedure', s.name_of_procedure,
        'type', lt.name,
        'lysis_done', CASE WHEN s.lysis_done THEN 'Yes' ELSE 'No' END,
        'lysis_date', to_char(s.lysis_date, 'DD-Mon-YYYY HH12:MI AM'),
        'thrombolysis_by_drug', ltd.name,
        'thrombectomy', CASE WHEN s.thrombectomy THEN 'Yes' ELSE 'No' END,
        'thrombectomy_dtls', s.thrombectomy_dtls,
        'decompression_craniectomy', CASE WHEN s.decompression_craniectomy THEN 'Yes' ELSE 'No' END,
        'decompression_craniectomy_dtls', s.decompression_craniectomy_dtls,
        'drug_prescribed', s.drug_prescribed,
        'user_id', s.user_id,
        'inserted_date', to_char(s.inserted_date, 'DD-Mon-YYYY HH12:MI AM'),
        'ref_form_id', s.ref_form_id,
        'ref_id', s.ref_id
    )
    INTO stroke_json
    FROM stroke s
    LEFT JOIN lkp_stroke_arrival_time_symptoms las ON las.id = s.arrival_time_symptoms
    LEFT JOIN lkp_stroke_reason_for_delay lrd ON lrd.id = s.reason_for_delay
    LEFT JOIN lkp_triage_scene_ift lsi ON lsi.id = s.scene_ift
    LEFT JOIN lkp_stroke_referred_from lrf ON lrf.id = s.referred_from
    LEFT JOIN lkp_stroke_reason_for_referral lrr ON lrr.id = s.reason_for_referral
    LEFT JOIN lkp_stroke_symptoms lss ON lss.id = s.symptoms
    LEFT JOIN lkp_stroke_nihs_scale lns ON lns.id = s.nihs_scale
    LEFT JOIN lkp_stroke_mri_scan_wakeup_stroke lmse ON lmse.id = s.mri_scan_eligibility
    LEFT JOIN lkp_stroke_type lt ON lt.id = s.type
    LEFT JOIN lkp_stroke_thrombolysis_by_drug ltd ON ltd.id = s.thrombolysis_by_drug
    WHERE s.triage_id = triage_id_input
    LIMIT 1;

    -- 2) STROKE_OUTCOME TABLE
    SELECT json_build_object(
        'id', o.id,
        'outcome', lo.name,
        'discharge_date', to_char(o.discharge_date, 'DD-Mon-YYYY HH12:MI AM'),
        'discharge_static_date', to_char(o.discharge_static_date, 'DD-Mon-YYYY HH12:MI AM'),
        'dama_date', to_char(o.dama_date, 'DD-Mon-YYYY HH12:MI AM'),
        'absconded_date', to_char(o.absconded_date, 'DD-Mon-YYYY HH12:MI AM'),
        'death_date', to_char(o.death_date, 'DD-Mon-YYYY HH12:MI AM'),
        'transferred_ward_date', to_char(o.transferred_ward_date, 'DD-Mon-YYYY HH12:MI AM'),
        'transferred_icu_date', to_char(o.transferred_icu_date, 'DD-Mon-YYYY HH12:MI AM'),
        'cause_of_death', o.cause_of_death,
        'transferred_to', ltt.name,
        'hospital_type', lht.name,
        'destination_hospital', o.destination_hospital,
		'destination_taei_hospital', dh.hospitalname,
        'reason_for_referral', lrr2.name,
        'condition_of_patient', lcp.name,
        'referring_doctor', o.referring_doctor,
        'documented_taei_sheet', CASE WHEN o.documented_taei_sheet THEN 'Yes' ELSE 'No' END,
        'treatment_given', o.treatment_given,
        'duration_stay', o.duration_stay,
        'is_discharged', CASE WHEN o.is_discharged THEN 'Yes' ELSE 'No' END
    )
    INTO stroke_outcome_json
    FROM stroke_outcome o
    LEFT JOIN lkp_stroke_outcome lo ON lo.id = o.outcome
    LEFT JOIN lkp_stroke_transferred_to ltt ON ltt.id = o.transferred_to
    LEFT JOIN lkp_hospital_type lht ON lht.id = o.hospital_type
    LEFT JOIN lkp_hospitals dh ON dh.hospitalid = o.destination_taei_hospital
    LEFT JOIN lkp_reason_for_referral lrr2 ON lrr2.id = o.reason_for_referral
    LEFT JOIN lkp_condition_of_patient lcp ON lcp.id = o.condition_of_patient
    WHERE o.stroke_id IN (SELECT id FROM stroke WHERE triage_id = triage_id_input)
    LIMIT 1;

    -- Combine into final JSON
    RETURN json_build_object(
        'stroke', stroke_json,
        'outcome', stroke_outcome_json
    );
END;
$BODY$;
