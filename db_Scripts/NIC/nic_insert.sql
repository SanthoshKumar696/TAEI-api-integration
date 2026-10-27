CREATE OR REPLACE FUNCTION insert_nic_details(p_triage_id INT)
RETURNS TEXT AS $$
DECLARE
    v_exists INT;
BEGIN
    --------------------------------------------------------------------
    -- 1. Check if triage_id exists
    --------------------------------------------------------------------
    PERFORM 1 FROM triage WHERE id = p_triage_id;
    IF NOT FOUND THEN
        RETURN 'TRIAGE_NOT_FOUND';
    END IF;

    --------------------------------------------------------------------
    -- 2. Check if NIC already inserted for this triage ID
    --------------------------------------------------------------------
    SELECT COUNT(*) INTO v_exists
    FROM tbl_nic_details
    WHERE personalinfoid = p_triage_id;

    IF v_exists > 0 THEN
        RETURN 'EXISTS';
    END IF;

    --------------------------------------------------------------------
    -- 3. INSERT NIC record
    --------------------------------------------------------------------
    INSERT INTO tbl_nic_details (
        personalinfoid,
        patientname,
        presentingcomplaints_rta,
        nursetriage_inserteddate,
        age,
        gender,
        address,
        triagedoneby,
        accompaniedby,
        patient_attender_mobile,
        consious,
        systalic_bp,
        dyalistic_bp,
        spo2,
        temperature,
        broughtdead,
        nic_insert_date,
        new_insert_date
    )
    SELECT 
        t.id AS personalinfoid,
        t.name_of_patient,
        td.oth_pc_medical_emergency AS presentingcomplaints_rta,
        t.date_time_of_triage,
        t.age_year,

        -- gender conversion
        CASE t.gender
            WHEN 1 THEN 'Male'
            WHEN 2 THEN 'Female'
            WHEN 3 THEN 'Transgender'
            ELSE NULL
        END AS gender,

        t.address_line,
        td.triage_done_by,
        tda.name AS accompaniedby,
        t.patient_mobile_number,

        

        CASE td.avpu
            WHEN 1 THEN 'A'
            WHEN 2 THEN 'V'
            WHEN 3 THEN 'P'
            WHEN 4 THEN 'U'
            ELSE NULL
        END AS consious,

        td.bp_systolic AS systalic_bp,
        td.bp_diastolic AS dyalistic_bp,
        td.spo2,
        td.temperature,

        CASE 
            WHEN td.brought_dead = TRUE THEN 1
            ELSE NULL
        END AS broughtdead,

        NOW(),
        NOW()

    FROM triage t
    INNER JOIN triage_dtls td 
        ON t.id = td.triage_id
    LEFT JOIN lkp_triage_dtls_accompanied_by tda 
        ON td.accompanied_by = tda.id
    


    WHERE t.id = p_triage_id;
    

    RETURN 'INSERTED';
END;
$$ LANGUAGE plpgsql;

--Trigger Step 1
CREATE OR REPLACE FUNCTION nic_trg_after_triage_dtls_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Call your NIC insert function
    PERFORM insert_nic_details(NEW.triage_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--Step 2
CREATE TRIGGER trg_insert_nic_after_triage_dtls
AFTER INSERT ON triage_dtls
FOR EACH ROW
EXECUTE FUNCTION nic_trg_after_triage_dtls_insert();



--------------------------------DD TRIGGER---------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_update_nic_emo_drunken_drive()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_memory_name text;
    v_self_control_name text;
    v_speech_name text;
    v_general_disposition_name text;
    v_clothing_name text;
    v_reaction_time_name text;
    v_orientation_time_name text;
BEGIN
    -- Lookup names
    SELECT name INTO v_memory_name
    FROM lkp_emo_recall_info WHERE id = NEW.memory;

    SELECT name INTO v_self_control_name
    FROM lkp_emo_recall_info WHERE id = NEW.self_control;

    SELECT name INTO v_reaction_time_name
    FROM lkp_emo_recall_info WHERE id = NEW.reaction_time;

    SELECT name INTO v_speech_name
    FROM lkp_emo_speech WHERE id = NEW.speech;

    SELECT name INTO v_general_disposition_name
    FROM lkp_emo_gen_disposition WHERE id = NEW.general_disposition;

    SELECT name INTO v_clothing_name
    FROM lkp_emo_clothing WHERE id = NEW.clothing;

    SELECT name INTO v_orientation_time_name
    FROM lkp_emo_orientation_time WHERE id = NEW.orientation_time;

    -- Update NIC table
    UPDATE tbl_nic_details
    SET 
        dd_history = CASE WHEN NEW.is_drunken_drive_history THEN 'Yes' ELSE 'No' END,
        dd_speech = v_speech_name,
        dd_generaldispostion = v_general_disposition_name,
        dd_clothing = v_clothing_name,
        dd_reactiontime = v_reaction_time_name,
        dd_oritime = v_orientation_time_name,
        dd_memory = v_memory_name,
        dd_selfcontrol = v_self_control_name,
        dd_smellinbreath = CASE WHEN NEW.is_smell_in_breath THEN 'Yes' ELSE 'No' END,
        dd_timeofexamin = NEW.time_of_examination::text,
		dd_specialexamin = CASE WHEN NEW.is_urine_alchol_concentration THEN 'YES' ELSE 'No' END,
        emo1_ar_number=NEW.ar_number
    WHERE personalinfoid = NEW.triage_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_update_nic_emo_drunken_drive
AFTER INSERT OR UPDATE ON emo_triage
FOR EACH ROW
EXECUTE FUNCTION fn_update_nic_emo_drunken_drive();
--------------------------------DD END ----------------------------------------------------------------------


