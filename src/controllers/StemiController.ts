import { Router, Request, Response, NextFunction } from 'express';
import { StemiService } from '../services/StemiService';
import logger from '../utils/logger';
import { getHospitalId } from '../utils/user_functions';

const router = Router();



router.post('/stemi-op/create', async (req, res, next) => {
    try {
      const record = await StemiService.create_op_patient(req.body);
      res.status(201).json(record);
    } catch (e) {
      logger.error('Create Stemi all error', e);
      next(e);
    }
  });
  router.get('/stemi-op/list', async (_req, res, next) => {
    try {
      const { start_date, end_date } = _req.query;
      const { offset = 1, limit = 20, ...filters } = _req.query;
      const records = await StemiService.op_list(Number(offset), Number(limit), filters, getHospitalId(_req),start_date as string,end_date as string);
      res.json(records);
    } catch (e) {
      logger.error('Get Stemi list admission error', e);
      next(e);
    }
  });
  router.get('/stemi-op/:id', async (req, res, next) => {
    try {
      const record = await StemiService.get_stemiop_by_id(Number(req.params.id));
      if (!record) return res.status(404).json({ message: 'Not found' });
      res.json(record);
    } catch (e) {
      logger.error(`Get Stemi all by Id ${req.params.id} error`, e);
      next(e);
    }
  });
  

  
/**
 * ================== STEMI Admission ==================
 */

/**
 * @swagger
 * tags:
 *   name: 1.STEMI Admission
 *   description: APIs for STEMI Admission 
 */
/**
 * @swagger
 * /stemi-admission/create:
 *   post:
 *     summary: Create a new STEMI Admission 
 *     tags: [1.STEMI Admission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 101
 *               is_admitted:
 *                 type: boolean
 *                 example: true
 *               date_time_entry:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-09-01T10:30:00Z
 *               department_name:
 *                 type: string
 *                 maxLength: 200
 *                 example: Cardiology
 *               date_time_admission:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-09-01T12:00:00Z
 *     responses:
 *       201:
 *         description: STEMI Clinical record created successfully
 *       500:
 *         description: Server error
 */

router.post('/stemi-all/create', async (req, res, next) => {
    try {
      const record = await StemiService.create_stemi_full(req.body);
      res.status(201).json(record);
    } catch (e) {
      logger.error('Create Stemi all error', e);
      next(e);
    }
  });
  
    router.get('/stemi-all/:id/:patientid', async (req, res, next) => {
    try {
      const record = await StemiService.get_stemi_all(Number(req.params.id),Number(req.params.patientid));
      if (!record) return res.status(404).json({ message: 'Not found' });
      res.json(record);
    } catch (e) {
      logger.error(`Get Stemi all by Id ${req.params.id} error`, e);
      next(e);
    }
  });
router.post('/stemi-admission/create', async (req, res, next) => {
    try {
      const record = await StemiService.createStemiadmission(req.body);
      res.status(201).json(record);
    } catch (e) {
      logger.error('Create Stemi admission error', e);
      next(e);
    }
  });
 /**
 * @swagger
 * /stemi-admission:
 *   get:
 *     summary: Get all STEMI Admission 
 *     tags: [1.STEMI Admission]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: STEMI Admission  record successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 triage_id:
 *                   type: integer
 *                 is_admitted:
 *                   type: boolean
 *                 date_time_entry:
 *                   type: string
 *                   format: date-time
 *                 department_name:
 *                   type: string
 *                 date_time_admission:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Server error
 */
  router.get('/stemi-admission', async (_req, res, next) => {
    try {
      const records = await StemiService.getAllStemiadmission();
      res.json(records);
    } catch (e) {
      logger.error('Get all Stemi admission error', e);
      next(e);
    }
  });


  router.get('/stemi-admission/list', async (_req, res, next) => {
    try {
      const { start_date, end_date } = _req.query;
      const { offset = 1, limit = 20, ...filters } = _req.query;
      const records = await StemiService.list(Number(offset), Number(limit), filters, getHospitalId(_req),start_date as string,end_date as string);
      res.json(records);
    } catch (e) {
      logger.error('Get Stemi list admission error', e);
      next(e);
    }
  });
/**
 * @openapi
 * /stemi-admission/{id}:
 *   get:
 *     summary: Get Stemi Admission by ID
 *     tags: [1.STEMI Admission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Stemi Admission
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Stemi Admission record retrieved successfully
 *       404:
 *         description: Admission not found
 */
  router.get('/stemi-admission/:id', async (req, res, next) => {
    try {
      const record = await StemiService.getByIdStemiadmission(Number(req.params.id));
      if (!record) return res.status(404).json({ message: 'Not found' });
      res.json(record);
    } catch (e) {
      logger.error(`Get Stemi admission by Id ${req.params.id} error`, e);
      next(e);
    }
  });
  /**
 * @openapi
 * /stemi-admission/{id}:
 *   put:
 *     summary: Update Stemi Admission by ID
 *     tags: [1.STEMI Admission]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 101
 *               is_admitted:
 *                 type: boolean
 *                 example: true
 *               date_time_entry:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-09-01T10:30:00Z
 *               department_name:
 *                 type: string
 *                 maxLength: 200
 *                 example: Cardiology
 *               date_time_admission:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-09-01T12:00:00Z
 *             required:
 *               - triage_id
 *               - is_admitted
 *               - date_time_entry
 *               - department_name
 *               - date_time_admission
 *     responses:
 *       200:
 *         description: Successfully updated Stemi Admission
 *       404:
 *         description: Admission not found
 *       400:
 *         description: Invalid request
 */
  router.put('/stemi-admission/:id', async (req, res, next) => {
    try {
      const updated = await StemiService.updateStemiadmission(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (e) {
      logger.error(`Update Stemi admission for Id ${req.params.id} error`, e);
      next(e);
    }
  });
  
  router.delete('/stemi-admission/:id', async (req, res, next) => {
    try {
      const deleted = await StemiService.deleteStemiadmission(Number(req.params.id));
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.status(204).send();
    } catch (e) {
      logger.error(`Delete Stemi admission by Id ${req.params.id} error`, e);
      next(e);
    }
  });

/**
 * ================== STEMI Clinical ==================
 */

/**
 * @swagger
 * tags:
 *   name: 2.STEMI Clinical
 *   description: APIs for STEMI Clinical 
 */
/**
 * @openapi
 * /stemi-clinical/create:
 *   post:
 *     summary: Create a new STEMI Clinical record
 *     tags:
 *       - 2.STEMI Clinical
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               symptom_onset_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:30:00Z"
 *               cv_risk_factor_id:
 *                 type: integer
 *                 example: 1
 *               signs_symptoms:
 *                 type: string
 *                 example: "Chest pain, shortness of breath"
 *               fmc_type_id:
 *                 type: integer
 *                 example: 2
 *               fmc_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:00:00Z"
 *               ecg_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:30:00Z"
 *               ecg_location_id:
 *                 type: integer
 *                 example: 1
 *               diagnosis_id:
 *                 type: integer
 *                 example: 3
 *             required:
 *               - triage_id
 *               - cv_risk_factor_id
 *               - fmc_type_id
 *               - ecg_location_id
 *               - diagnosis_id
 *     responses:
 *       201:
 *         description: STEMI Clinical record created successfully
 *       400:
 *         description: Bad request
 */
router.post('/stemi-clinical/create', async (req, res, next) => {
  try {
    const record = await StemiService.create(req.body);
    res.status(201).json(record);
  } catch (e) {
    logger.error('Create Stemi Clinical error', e);
    next(e);
  }
});
/**
 * @openapi
 * /stemi-clinical:
 *   get:
 *     summary: Get all STEMI Clinical records
 *     tags:
 *       - 2.STEMI Clinical
 *     responses:
 *       200:
 *         description: List of STEMI Clinical records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 symptom_onset_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 cv_risk_factor_id:
 *                   type: integer
 *                   example: 1
 *                 signs_symptoms:
 *                   type: string
 *                   example: "Chest pain, shortness of breath"
 *                 fmc_type_id:
 *                   type: integer
 *                   example: 2
 *                 fmc_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:00:00Z"
 *                 ecg_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:30:00Z"
 *                 ecg_location_id:
 *                   type: integer
 *                   example: 1
 *                 diagnosis_id:
 *                   type: integer
 *                   example: 3
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:00:00Z"
 */
router.get('/stemi-clinical', async (_req, res, next) => {
  try {
    const records = await StemiService.getAll();
    res.json(records);
  } catch (e) {
    logger.error('Get all Stemi Clinical error', e);
    next(e);
  }
});
/**
 * @openapi
 * /stemi-clinical/{id}:
 *   get:
 *     summary: Get STEMI Clinical record by ID
 *     tags:
 *       - 2.STEMI Clinical
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the STEMI Clinical record
 *     responses:
 *       200:
 *         description: STEMI Clinical record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 symptom_onset_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 cv_risk_factor_id:
 *                   type: integer
 *                   example: 1
 *                 signs_symptoms:
 *                   type: string
 *                   example: "Chest pain, shortness of breath"
 *                 fmc_type_id:
 *                   type: integer
 *                   example: 2
 *                 fmc_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:00:00Z"
 *                 ecg_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:30:00Z"
 *                 ecg_location_id:
 *                   type: integer
 *                   example: 1
 *                 diagnosis_id:
 *                   type: integer
 *                   example: 3
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:00:00Z"
 *       404:
 *         description: Not found
 */
router.get('/stemi-clinical/:id', async (req, res, next) => {
  try {
    const record = await StemiService.getById(Number(req.params.id));
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) {
    logger.error(`Get Stemi Clinical by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @openapi
 * /stemi-clinical/{id}:
 *   put:
 *     summary: Update STEMI Clinical record by ID
 *     tags:
 *       - 2.STEMI Clinical
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the STEMI Clinical record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               symptom_onset_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:30:00Z"
 *               cv_risk_factor_id:
 *                 type: integer
 *                 example: 1
 *               signs_symptoms:
 *                 type: string
 *                 example: "Chest pain, shortness of breath"
 *               fmc_type_id:
 *                 type: integer
 *                 example: 2
 *               fmc_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:00:00Z"
 *               ecg_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:30:00Z"
 *               ecg_location_id:
 *                 type: integer
 *                 example: 1
 *               diagnosis_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: STEMI Clinical record updated successfully
 *       404:
 *         description: Not found
 */

router.put('/stemi-clinical/:id', async (req, res, next) => {
  try {
    const updated = await StemiService.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error(`Update Stemi Clinical for Id ${req.params.id} error`, e);
    next(e);
  }
});

router.delete('/stemi-clinical/:id', async (req, res, next) => {
  try {
    const deleted = await StemiService.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) {
    logger.error(`Delete Stemi Clinical by Id ${req.params.id} error`, e);
    next(e);
  }
});

/**
 * ================== STEMI Treatment ==================
 */
/**
 * @swagger
 * tags:
 *   name: 3.STEMI Treatment
 *   description: APIs for STEMI Treatment 
 */
/**
 * @openapi
 * /stemi-treatment/create:
 *   post:
 *     summary: Create a new STEMI Treatment record
 *     tags:
 *       - 3.STEMI Treatment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               stemi_confirmed_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:00:00Z"
 *               infarction_location_id:
 *                 type: integer
 *                 example: 1
 *               loading_dose_location_id:
 *                 type: integer
 *                 example: 2
 *               loading_dose_drug_id:
 *                 type: integer
 *                 example: 5
 *               loading_dose_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:30:00Z"
 *               thrombolysis_location_id:
 *                 type: integer
 *                 example: 3
 *               thrombolytic_agent_id:
 *                 type: integer
 *                 example: 1
 *               thrombolysis_start:
 *                 type: string
 *                 format: date-time
 *               thrombolysis_end:
 *                 type: string
 *                 format: date-time
 *               thrombolysis_outcome_id:
 *                 type: integer
 *               treatment_strategy_id:
 *                 type: integer
 *               management_id:
 *                 type: string
 *                 example: "1,2,3"
 *               killip_risk_score_id:
 *                 type: integer
 *               planned_cag:
 *                 type: boolean
 *               cath_lab_arrival:
 *                 type: string
 *                 format: date-time
 *               balloon_inflation:
 *                 type: string
 *                 format: date-time
 *               stent_type_id:
 *                 type: integer
 *               complications:
 *                 type: string
 *                 example: "Bleeding, hypotension"
 *               transfer_location_id:
 *                 type: integer
 *               counselling_id:
 *                 type: string
 *                 example: "2,5"
 *               symptom_to_fmc:
 *                 type: integer
 *               fmc_to_ecg:
 *                 type: integer
 *               door_to_needle:
 *                 type: integer
 *               door_to_balloon:
 *                 type: integer
 *               total_ischemic_time:
 *                 type: integer
 *               icu_admission:
 *                 type: boolean
 *               hospital_stay_days:
 *                 type: integer
 *               in_hospital_complication:
 *                 type: string
 *     responses:
 *       201:
 *         description: STEMI Treatment created successfully
 */
router.post('/stemi-treatment/create', async (req, res, next) => {
  try {
    const record = await StemiService.createStemiTreament(req.body);
    res.status(201).json(record);
  } catch (e) {
    logger.error('Create Stemi Treatment error', e);
    next(e);
  }
});
/**
 * @openapi
 * /stemi-treatment:
 *   get:
 *     summary: Get all STEMI Treatment records
 *     tags:
 *       - 3.STEMI Treatment
 *     responses:
 *       200:
 *         description: List of STEMI Treatments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   triage_id:
 *                     type: integer
 *                   stemi_confirmed_at:
 *                     type: string
 *                     format: date-time
 *                   infarction_location_id:
 *                     type: integer
 *                   loading_dose_location_id:
 *                     type: integer
 *                   loading_dose_drug_id:
 *                     type: integer
 *                   loading_dose_time:
 *                     type: string
 *                     format: date-time
 *                   thrombolysis_location_id:
 *                     type: integer
 *                   thrombolytic_agent_id:
 *                     type: integer
 *                   thrombolysis_start:
 *                     type: string
 *                     format: date-time
 *                   thrombolysis_end:
 *                     type: string
 *                     format: date-time
 *                   thrombolysis_outcome_id:
 *                     type: integer
 *                   treatment_strategy_id:
 *                     type: integer
 *                   management_id:
 *                     type: string
 *                   killip_risk_score_id:
 *                     type: integer
 *                   planned_cag:
 *                     type: boolean
 *                   cath_lab_arrival:
 *                     type: string
 *                     format: date-time
 *                   balloon_inflation:
 *                     type: string
 *                     format: date-time
 *                   stent_type_id:
 *                     type: integer
 *                   complications:
 *                     type: string
 *                   transfer_location_id:
 *                     type: integer
 *                   counselling_id:
 *                     type: string
 *                   symptom_to_fmc:
 *                     type: integer
 *                   fmc_to_ecg:
 *                     type: integer
 *                   door_to_needle:
 *                     type: integer
 *                   door_to_balloon:
 *                     type: integer
 *                   total_ischemic_time:
 *                     type: integer
 *                   icu_admission:
 *                     type: boolean
 *                   hospital_stay_days:
 *                     type: integer
 *                   in_hospital_complication:
 *                     type: string
 */
router.get('/stemi-treatment', async (_req, res, next) => {
  try {
    const records = await StemiService.getAllStemiTreament();
    res.json(records);
  } catch (e) {
    logger.error('Get all Stemi Treatment error', e);
    next(e);
  }
});
/**
 * @openapi
 * /stemi-treatment/{id}:
 *   get:
 *     summary: Get STEMI Treatment by ID
 *     tags:
 *       - 3.STEMI Treatment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the treatment
 *     responses:
 *       200:
 *         description: STEMI Treatment found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   triage_id:
 *                     type: integer
 *                   stemi_confirmed_at:
 *                     type: string
 *                     format: date-time
 *                   infarction_location_id:
 *                     type: integer
 *                   loading_dose_location_id:
 *                     type: integer
 *                   loading_dose_drug_id:
 *                     type: integer
 *                   loading_dose_time:
 *                     type: string
 *                     format: date-time
 *                   thrombolysis_location_id:
 *                     type: integer
 *                   thrombolytic_agent_id:
 *                     type: integer
 *                   thrombolysis_start:
 *                     type: string
 *                     format: date-time
 *                   thrombolysis_end:
 *                     type: string
 *                     format: date-time
 *                   thrombolysis_outcome_id:
 *                     type: integer
 *                   treatment_strategy_id:
 *                     type: integer
 *                   management_id:
 *                     type: string
 *                   killip_risk_score_id:
 *                     type: integer
 *                   planned_cag:
 *                     type: boolean
 *                   cath_lab_arrival:
 *                     type: string
 *                     format: date-time
 *                   balloon_inflation:
 *                     type: string
 *                     format: date-time
 *                   stent_type_id:
 *                     type: integer
 *                   complications:
 *                     type: string
 *                   transfer_location_id:
 *                     type: integer
 *                   counselling_id:
 *                     type: string
 *                   symptom_to_fmc:
 *                     type: integer
 *                   fmc_to_ecg:
 *                     type: integer
 *                   door_to_needle:
 *                     type: integer
 *                   door_to_balloon:
 *                     type: integer
 *                   total_ischemic_time:
 *                     type: integer
 *                   icu_admission:
 *                     type: boolean
 *                   hospital_stay_days:
 *                     type: integer
 *                   in_hospital_complication:
 *                     type: string
 *       404:
 *         description: Not found
 */
router.get('/stemi-treatment/:id', async (req, res, next) => {
  try {
    const record = await StemiService.getByIdStemiTreament(Number(req.params.id));
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) {
    logger.error(`Get Stemi Treatment by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @openapi
 * /stemi-treatment/{id}:
 *   put:
 *     summary: Update STEMI Treatment by ID
 *     tags:
 *       - 3.STEMI Treatment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the treatment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complications:
 *                 type: string
 *                 example: "Re-occlusion"
 *               icu_admission:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: STEMI Treatment updated successfully
 *       404:
 *         description: Not found
 */
router.put('/stemi-treatment/:id', async (req, res, next) => {
  try {
    const updated = await StemiService.updateStemiTreament(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error(`Update Stemi Treatment for Id ${req.params.id} error`, e);
    next(e);
  }
});

router.delete('/stemi-treatment/:id', async (req, res, next) => {
  try {
    const deleted = await StemiService.deleteStemiTreament(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) {
    logger.error(`Delete Stemi Treatment by Id ${req.params.id} error`, e);
    next(e);
  }
});

/**
 * ================== STEMI Outcome ==================
 */
/**
 * @swagger
 * tags:
 *   name: 4.Stemi Outcome
 *   description: Manage STEMI outcome records
 */

/**
 * @swagger
 * /stemi-outcome/create:
 *   post:
 *     summary: Create a new STEMI Outcome
 *     tags: [4.Stemi Outcome]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 101
 *               outcome_type_id:
 *                 type: integer
 *                 description: Reference to outcome type master
 *                 example: 2
 *               discharge_datetime:
 *                 type: string
 *                 format: date-time
 *               absconded_datetime:
 *                 type: string
 *                 format: date-time
 *               death_datetime:
 *                 type: string
 *                 format: date-time
 *               death_timing_id:
 *                 type: integer
 *                 example: 1
 *               cause_of_death:
 *                 type: string
 *                 example: "Cardiac arrest"
 *               hospital_type_id:
 *                 type: integer
 *                 example: 3
 *               destination_hospital:
 *                 type: string
 *                 example: "Apollo Hospitals, Chennai"
 *               referral_reason_id:
 *                 type: integer
 *                 example: 5
 *               patient_condition_id:
 *                 type: integer
 *                 example: 2
 *               referring_doctor:
 *                 type: string
 *                 example: "Dr. Rajesh"
 *               documented_in_taei_case_sheet:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post('/stemi-outcome/create', async (req, res, next) => {
  try {
    const record = await StemiService.createStemiOutcome(req.body);
    res.status(201).json(record);
  } catch (e) {
    logger.error('Create Stemi Outcome error', e);
    next(e);
  }
});
/**
 * @openapi
 * /stemi-outcome:
 *   get:
 *     summary: Get all STEMI Outcome records
 *     tags:
 *       - 4.Stemi Outcome
 *     responses:
 *       200:
 *         description: List of STEMI Outcome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer, example: 1 }
 *                 triage_id: { type: integer, example: 101 }
 *                 outcome_type_id: { type: integer, example: 2 }
 *                 discharge_datetime: { type: string, format: date-time }
 *                 absconded_datetime: { type: string, format: date-time }
 *                 death_datetime: { type: string, format: date-time }
 *                 death_timing_id: { type: integer, example: 1 }
 *                 cause_of_death: { type: string }
 *                 hospital_type_id: { type: integer }
 *                 destination_hospital: { type: string }
 *                 referral_reason_id: { type: integer }
 *                 patient_condition_id: { type: integer }
 *                 referring_doctor: { type: string }
 *                 documented_in_taei_case_sheet: { type: boolean }
 *                 created_at: { type: string, format: date-time }
 *                 updated_at: { type: string, format: date-time }
 */
router.get('/stemi-outcome', async (_req, res, next) => {
  try {
    const records = await StemiService.getAllStemiOutcome();
    res.json(records);
  } catch (e) {
    logger.error('Get all Stemi Outcome error', e);
    next(e);
  }
});
/**
 * @swagger
 * /stemi-outcome/{id}:
 *   get:
 *     summary: Get STEMI Outcome by ID
 *     tags: [4.Stemi Outcome]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: STEMI Outcome record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer, example: 1 }
 *                 triage_id: { type: integer }
 *                 outcome_type_id: { type: integer }
 *                 discharge_datetime: { type: string, format: date-time }
 *                 absconded_datetime: { type: string, format: date-time }
 *                 death_datetime: { type: string, format: date-time }
 *                 death_timing_id: { type: integer }
 *                 cause_of_death: { type: string }
 *                 hospital_type_id: { type: integer }
 *                 destination_hospital: { type: string }
 *                 referral_reason_id: { type: integer }
 *                 patient_condition_id: { type: integer }
 *                 referring_doctor: { type: string }
 *                 documented_in_taei_case_sheet: { type: boolean }
 *                 created_at: { type: string, format: date-time }
 *                 updated_at: { type: string, format: date-time }
 *       404:
 *         description: Not found
 */
router.get('/stemi-outcome/:id', async (req, res, next) => {
  try {
    const record = await StemiService.getByIdStemiOutcome(Number(req.params.id));
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) {
    logger.error(`Get Stemi Outcome by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @swagger
 * /stemi-outcome/{id}:
 *   put:
 *     summary: Update STEMI Outcome by ID
 *     tags: [4.Stemi Outcome]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id: { type: integer }
 *               outcome_type_id: { type: integer }
 *               discharge_datetime: { type: string, format: date-time }
 *               absconded_datetime: { type: string, format: date-time }
 *               death_datetime: { type: string, format: date-time }
 *               death_timing_id: { type: integer }
 *               cause_of_death: { type: string }
 *               hospital_type_id: { type: integer }
 *               destination_hospital: { type: string }
 *               referral_reason_id: { type: integer }
 *               patient_condition_id: { type: integer }
 *               referring_doctor: { type: string }
 *               documented_in_taei_case_sheet: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated STEMI Outcome
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: integer }
 *                 triage_id: { type: integer }
 *                 outcome_type_id: { type: integer }
 *                 discharge_datetime: { type: string, format: date-time }
 *                 absconded_datetime: { type: string, format: date-time }
 *                 death_datetime: { type: string, format: date-time }
 *                 death_timing_id: { type: integer }
 *                 cause_of_death: { type: string }
 *                 hospital_type_id: { type: integer }
 *                 destination_hospital: { type: string }
 *                 referral_reason_id: { type: integer }
 *                 patient_condition_id: { type: integer }
 *                 referring_doctor: { type: string }
 *                 documented_in_taei_case_sheet: { type: boolean }
 *                 created_at: { type: string, format: date-time }
 *                 updated_at: { type: string, format: date-time }
 *       404:
 *         description: Not found
 */
router.put('/stemi-outcome/:id', async (req, res, next) => {
  try {
    const updated = await StemiService.updateStemiOutcome(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error(`Update Stemi Outcome for Id ${req.params.id} error`, e);
    next(e);
  }
});

router.delete('/stemi-outcome/:id', async (req, res, next) => {
  try {
    const deleted = await StemiService.deleteStemiOutcome(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) {
    logger.error(`Delete Stemi Outcome by Id ${req.params.id} error`, e);
    next(e);
  }
});

/**
 * ================== NSTEMI Treatment ==================
 */
/**
 * @swagger
 * tags:
 *   name: 5.NSTEMI Treatment
 *   description: APIs - NSTEMI Treatment
 */
/**
 * @openapi
 * /nstemi-treatment/create:
 *   post:
 *     summary: Create a new NSTEMI Treatment record
 *     tags:
 *       - 5.NSTEMI Treatment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               nstemi_confirmed_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:30:00Z"
 *               loading_dose_location_id:
 *                 type: integer
 *                 example: 1
 *               loading_dose_drug_id:
 *                 type: integer
 *                 example: 2
 *               loading_dose_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:00:00Z"
 *               timi_risk_score_id:
 *                 type: integer
 *                 example: 3
 *               treatment_strategy_id:
 *                 type: integer
 *                 example: 2
 *               cath_lab_arrival:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T16:00:00Z"
 *               balloon_inflation:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T16:30:00Z"
 *               stent_type_id:
 *                 type: integer
 *                 example: 1
 *               complications:
 *                 type: string
 *                 example: "Minor bleeding"
 *               transfer_location_id:
 *                 type: integer
 *                 example: 4
 *               symptom_to_fmc:
 *                 type: integer
 *                 example: 30
 *               fmc_to_ecg:
 *                 type: integer
 *                 example: 15
 *               icu_admission:
 *                 type: boolean
 *                 example: true
 *               hospital_stay_days:
 *                 type: integer
 *                 example: 5
 *               in_hospital_complications:
 *                 type: string
 *                 example: "Arrhythmia"
 *             required:
 *               - triage_id
 *               - nstemi_confirmed_at
 *               - loading_dose_location_id
 *               - loading_dose_drug_id
 *               - timi_risk_score_id
 *               - treatment_strategy_id
 *     responses:
 *       201:
 *         description: NSTEMI Treatment record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 nstemi_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 loading_dose_location_id:
 *                   type: integer
 *                   example: 1
 *                 loading_dose_drug_id:
 *                   type: integer
 *                   example: 2
 *                 loading_dose_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:00:00Z"
 *                 timi_risk_score_id:
 *                   type: integer
 *                   example: 3
 *                 treatment_strategy_id:
 *                   type: integer
 *                   example: 2
 *                 cath_lab_arrival:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:00:00Z"
 *                 balloon_inflation:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:30:00Z"
 *                 stent_type_id:
 *                   type: integer
 *                   example: 1
 *                 complications:
 *                   type: string
 *                   example: "Minor bleeding"
 *                 transfer_location_id:
 *                   type: integer
 *                   example: 4
 *                 symptom_to_fmc:
 *                   type: integer
 *                   example: 30
 *                 fmc_to_ecg:
 *                   type: integer
 *                   example: 15
 *                 icu_admission:
 *                   type: boolean
 *                   example: true
 *                 hospital_stay_days:
 *                   type: integer
 *                   example: 5
 *                 in_hospital_complications:
 *                   type: string
 *                   example: "Arrhythmia"
 *
 */
router.post('/nstemi-treatment/create', async (req, res, next) => {
  try {
    const record = await StemiService.createNStemiTreament(req.body);
    res.status(201).json(record);
  } catch (e) {
    logger.error('Create NStemi Treatment error', e);
    next(e);
  }
});
/**
 * @openapi
 * /nstemi-treatment:
 *   get:
 *     summary: Get all NSTEMI Treatment records
 *     tags:
 *       - 5.NSTEMI Treatment
 *     responses:
 *       200:
 *         description: List of NSTEMI Treatment records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   triage_id:
 *                     type: integer
 *                     example: 123
 *                   nstemi_confirmed_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T14:30:00Z"
 *                   loading_dose_location_id:
 *                     type: integer
 *                     example: 1
 *                   loading_dose_drug_id:
 *                     type: integer
 *                     example: 2
 *                   loading_dose_time:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T15:00:00Z"
 *                   timi_risk_score_id:
 *                     type: integer
 *                     example: 3
 *                   treatment_strategy_id:
 *                     type: integer
 *                     example: 2
 *                   cath_lab_arrival:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T16:00:00Z"
 *                   balloon_inflation:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T16:30:00Z"
 *                   stent_type_id:
 *                     type: integer
 *                     example: 1
 *                   complications:
 *                     type: string
 *                     example: "Minor bleeding"
 *                   transfer_location_id:
 *                     type: integer
 *                     example: 4
 *                   symptom_to_fmc:
 *                     type: integer
 *                     example: 30
 *                   fmc_to_ecg:
 *                     type: integer
 *                     example: 15
 *                   icu_admission:
 *                     type: boolean
 *                     example: true
 *                   hospital_stay_days:
 *                     type: integer
 *                     example: 5
 *                   in_hospital_complications:
 *                     type: string
 *                     example: "Arrhythmia"
 *
 */
router.get('/nstemi-treatment', async (_req, res, next) => {
  try {
    const records = await StemiService.getAllNStemiTreament();
    res.json(records);
  } catch (e) {
    logger.error('Get all NStemi Treatment error', e);
    next(e);
  }
});
/**
 * @openapi
 * /nstemi-treatment/{id}:
 *   get:
 *     summary: Get NSTEMI Treatment by Id
 *     tags:
 *       - 5.NSTEMI Treatment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: NSTEMI Treatment record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 nstemi_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 loading_dose_location_id:
 *                   type: integer
 *                   example: 1
 *                 loading_dose_drug_id:
 *                   type: integer
 *                   example: 2
 *                 loading_dose_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:00:00Z"
 *                 timi_risk_score_id:
 *                   type: integer
 *                   example: 3
 *                 treatment_strategy_id:
 *                   type: integer
 *                   example: 2
 *                 cath_lab_arrival:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:00:00Z"
 *                 balloon_inflation:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:30:00Z"
 *                 stent_type_id:
 *                   type: integer
 *                   example: 1
 *                 complications:
 *                   type: string
 *                   example: "Minor bleeding"
 *                 transfer_location_id:
 *                   type: integer
 *                   example: 4
 *                 symptom_to_fmc:
 *                   type: integer
 *                   example: 30
 *                 fmc_to_ecg:
 *                   type: integer
 *                   example: 15
 *                 icu_admission:
 *                   type: boolean
 *                   example: true
 *                 hospital_stay_days:
 *                   type: integer
 *                   example: 5
 *                 in_hospital_complications:
 *                   type: string
 *                   example: "Arrhythmia"
 *
 */
router.get('/nstemi-treatment/:id', async (req, res, next) => {
  try {
    const record = await StemiService.getByIdNStemiTreament(Number(req.params.id));
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) {
    logger.error(`Get NStemi Treatment by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @openapi
 * /nstemi-treatment/{id}:
 *   put:
 *     summary: Update an NSTEMI Treatment record by ID
 *     tags:
 *       - 5.NSTEMI Treatment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the NSTEMI Treatment record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               nstemi_confirmed_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:30:00Z"
 *               loading_dose_location_id:
 *                 type: integer
 *                 example: 1
 *               loading_dose_drug_id:
 *                 type: integer
 *                 example: 2
 *               loading_dose_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:00:00Z"
 *               timi_risk_score_id:
 *                 type: integer
 *                 example: 3
 *               treatment_strategy_id:
 *                 type: integer
 *                 example: 2
 *               cath_lab_arrival:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T16:00:00Z"
 *               balloon_inflation:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T16:30:00Z"
 *               stent_type_id:
 *                 type: integer
 *                 example: 1
 *               complications:
 *                 type: string
 *                 example: "Minor bleeding"
 *               transfer_location_id:
 *                 type: integer
 *                 example: 4
 *               symptom_to_fmc:
 *                 type: integer
 *                 example: 30
 *               fmc_to_ecg:
 *                 type: integer
 *                 example: 15
 *               icu_admission:
 *                 type: boolean
 *                 example: true
 *               hospital_stay_days:
 *                 type: integer
 *                 example: 5
 *               in_hospital_complications:
 *                 type: string
 *                 example: "Arrhythmia"
 *     responses:
 *       200:
 *         description: NSTEMI Treatment record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 nstemi_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 loading_dose_location_id:
 *                   type: integer
 *                   example: 1
 *                 loading_dose_drug_id:
 *                   type: integer
 *                   example: 2
 *                 loading_dose_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:00:00Z"
 *                 timi_risk_score_id:
 *                   type: integer
 *                   example: 3
 *                 treatment_strategy_id:
 *                   type: integer
 *                   example: 2
 *                 cath_lab_arrival:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:00:00Z"
 *                 balloon_inflation:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T16:30:00Z"
 *                 stent_type_id:
 *                   type: integer
 *                   example: 1
 *                 complications:
 *                   type: string
 *                   example: "Minor bleeding"
 *                 transfer_location_id:
 *                   type: integer
 *                   example: 4
 *                 symptom_to_fmc:
 *                   type: integer
 *                   example: 30
 *                 fmc_to_ecg:
 *                   type: integer
 *                   example: 15
 *                 icu_admission:
 *                   type: boolean
 *                   example: true
 *                 hospital_stay_days:
 *                   type: integer
 *                   example: 5
 *                 in_hospital_complications:
 *                   type: string
 *                   example: "Arrhythmia"
 *       404:
 *         description: NSTEMI Treatment record not found
 */
router.put('/nstemi-treatment/:id', async (req, res, next) => {
  try {
    const updated = await StemiService.updateNStemiTreament(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error(`Update NStemi Treatment for Id ${req.params.id} error`, e);
    next(e);
  }
});

router.delete('/nstemi-treatment/:id', async (req, res, next) => {
  try {
    const deleted = await StemiService.deleteNStemiTreament(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) {
    logger.error(`Delete NStemi Treatment by Id ${req.params.id} error`, e);
    next(e);
  }
});

/**
 * ================== NSTEMI Outcome ==================
 */
/**
 * @swagger
 * tags:
 *   name: 6.NSTEMI Outcome
 *   description: APIs - NSTEMI Outcome
 */
/**
 * @openapi
 * /nstemi-outcome/create:
 *   post:
 *     summary: Create a new NSTEMI Outcome record
 *     tags:
 *       - 6.NSTEMI Outcome
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               outcome_type_id:
 *                 type: integer
 *                 example: 1
 *               discharge_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:30:00Z"
 *               absconded_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-11T10:00:00Z"
 *               death_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-12T08:00:00Z"
 *               death_timing_id:
 *                 type: integer
 *                 example: 2
 *               cause_of_death:
 *                 type: string
 *                 example: "Cardiac arrest"
 *               hospital_type_id:
 *                 type: integer
 *                 example: 3
 *               destination_hospital:
 *                 type: string
 *                 example: "Apollo Hospitals"
 *               referral_reason_id:
 *                 type: integer
 *                 example: 4
 *               patient_condition_id:
 *                 type: integer
 *                 example: 1
 *               referring_doctor:
 *                 type: string
 *                 example: "Dr. Rajesh Kumar"
 *               documented_in_taei_case_sheet:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: NSTEMI Outcome created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 outcome_type_id:
 *                   type: integer
 *                   example: 1
 *                 discharge_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00Z"
 *                 absconded_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-11T10:00:00Z"
 *                 death_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-12T08:00:00Z"
 *                 death_timing_id:
 *                   type: integer
 *                   example: 2
 *                 cause_of_death:
 *                   type: string
 *                   example: "Cardiac arrest"
 *                 hospital_type_id:
 *                   type: integer
 *                   example: 3
 *                 destination_hospital:
 *                   type: string
 *                   example: "Apollo Hospitals"
 *                 referral_reason_id:
 *                   type: integer
 *                   example: 4
 *                 patient_condition_id:
 *                   type: integer
 *                   example: 1
 *                 referring_doctor:
 *                   type: string
 *                   example: "Dr. Rajesh Kumar"
 *                 documented_in_taei_case_sheet:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:00:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:00:00Z"
 */
router.post('/nstemi-outcome/create', async (req, res, next) => {
  try {
    const record = await StemiService.createNStemiOutcome(req.body);
    res.status(201).json(record);
  } catch (e) {
    logger.error('Create NStemi Outcome error', e);
    next(e);
  }
});

router.get('/nstemi-outcome', async (_req, res, next) => {
  try {
    const records = await StemiService.getAllNStemiOutcome();
    res.json(records);
  } catch (e) {
    logger.error('Get all NStemi Outcome error', e);
    next(e);
  }
});
/**
 * @openapi
 * /nstemi-outcome/{id}:
 *   get:
 *     summary: Get NSTEMI Outcome record by ID
 *     tags:
 *       - 6.NSTEMI Outcome
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: NSTEMI Outcome retrived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 outcome_type_id:
 *                   type: integer
 *                   example: 1
 *                 discharge_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00Z"
 *                 absconded_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-11T10:00:00Z"
 *                 death_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-12T08:00:00Z"
 *                 death_timing_id:
 *                   type: integer
 *                   example: 2
 *                 cause_of_death:
 *                   type: string
 *                   example: "Cardiac arrest"
 *                 hospital_type_id:
 *                   type: integer
 *                   example: 3
 *                 destination_hospital:
 *                   type: string
 *                   example: "Apollo Hospitals"
 *                 referral_reason_id:
 *                   type: integer
 *                   example: 4
 *                 patient_condition_id:
 *                   type: integer
 *                   example: 1
 *                 referring_doctor:
 *                   type: string
 *                   example: "Dr. Rajesh Kumar"
 *                 documented_in_taei_case_sheet:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:00:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:00:00Z"
 *       404:
 *         description: NSTEMI Outcome not found
 */
router.get('/nstemi-outcome/:id', async (req, res, next) => {
  try {
    const record = await StemiService.getByIdNStemiOutcome(Number(req.params.id));
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) {
    logger.error(`Get NStemi Outcome by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @openapi
 * /nstemi-outcome/{id}:
 *   put:
 *     summary: Update NSTEMI Outcome record by ID
 *     tags:
 *       - 6.NSTEMI Outcome
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               outcome_type_id:
 *                 type: integer
 *                 example: 1
 *               discharge_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:30:00Z"
 *               absconded_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-11T10:00:00Z"
 *               death_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-12T08:00:00Z"
 *               death_timing_id:
 *                 type: integer
 *                 example: 2
 *               cause_of_death:
 *                 type: string
 *                 example: "Cardiac arrest"
 *               hospital_type_id:
 *                 type: integer
 *                 example: 3
 *               destination_hospital:
 *                 type: string
 *                 example: "Apollo Hospitals"
 *               referral_reason_id:
 *                 type: integer
 *                 example: 4
 *               patient_condition_id:
 *                 type: integer
 *                 example: 1
 *               referring_doctor:
 *                 type: string
 *                 example: "Dr. Rajesh Kumar"
 *               documented_in_taei_case_sheet:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: NSTEMI Outcome updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NstemiOutcome'
 *       404:
 *         description: NSTEMI Outcome not found
 */
router.put('/nstemi-outcome/:id', async (req, res, next) => {
  try {
    const updated = await StemiService.updateNStemiOutcome(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error(`Update NStemi Outcome for Id ${req.params.id} error`, e);
    next(e);
  }
});

router.delete('/nstemi-outcome/:id', async (req, res, next) => {
  try {
    const deleted = await StemiService.deleteNStemiOutcome(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) {
    logger.error(`Delete NStemi Outcome by Id ${req.params.id} error`, e);
    next(e);
  }
});

/**
 * ================== Unstable Angina Treatment ==================
 */
/**
 * @swagger
 * tags:
 *   name: 7.Angina Treatment
 *   description: APIs - NSTEMI Outcome
 */
/**
 * @openapi
 * /angina-treatment/create:
 *   post:
 *     summary: Create a new NSTEMI Treatment record
 *     tags:
 *       - 7.Angina Treatment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               nstemi_confirmed_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:30:00Z"
 *               loading_dose_location_id:
 *                 type: integer
 *                 example: 1
 *               loading_dose_drug_id:
 *                 type: integer
 *                 example: 2
 *               loading_dose_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T13:00:00Z"
 *               timi_risk_score_id:
 *                 type: integer
 *                 example: 3
 *               treatment_strategy_id:
 *                 type: integer
 *                 example: 2
 *               cath_lab_arrival:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:00:00Z"
 *               balloon_inflation:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:30:00Z"
 *               stent_type_id:
 *                 type: integer
 *                 example: 1
 *               complications:
 *                 type: string
 *                 example: "Minor bleeding"
 *               transfer_location_id:
 *                 type: integer
 *                 example: 4
 *               symptom_to_fmc:
 *                 type: integer
 *                 example: 20
 *               fmc_to_ecg:
 *                 type: integer
 *                 example: 15
 *               icu_admission:
 *                 type: boolean
 *                 example: true
 *               hospital_stay_days:
 *                 type: integer
 *                 example: 5
 *               in_hospital_complications:
 *                 type: string
 *                 example: "Arrhythmia"
 *     responses:
 *       201:
 *         description: NSTEMI Treatment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 nstemi_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00Z"
 *                 loading_dose_location_id:
 *                   type: integer
 *                   example: 1
 *                 loading_dose_drug_id:
 *                   type: integer
 *                   example: 2
 *                 loading_dose_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T13:00:00Z"
 *                 timi_risk_score_id:
 *                   type: integer
 *                   example: 3
 *                 treatment_strategy_id:
 *                   type: integer
 *                   example: 2
 *                 cath_lab_arrival:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:00:00Z"
 *                 balloon_inflation:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 stent_type_id:
 *                   type: integer
 *                   example: 1
 *                 complications:
 *                   type: string
 *                   example: "Minor bleeding"
 *                 transfer_location_id:
 *                   type: integer
 *                   example: 4
 *                 symptom_to_fmc:
 *                   type: integer
 *                   example: 20
 *                 fmc_to_ecg:
 *                   type: integer
 *                   example: 15
 *                 icu_admission:
 *                   type: boolean
 *                   example: true
 *                 hospital_stay_days:
 *                   type: integer
 *                   example: 5
 *                 in_hospital_complications:
 *                   type: string
 *                   example: "Arrhythmia"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 */
router.post('/angina-treatment/create', async (req, res, next) => {
  try {
    const record = await StemiService.createAnginaTreament(req.body);
    res.status(201).json(record);
  } catch (e) {
    logger.error('Create Angina Treatment error', e);
    next(e);
  }
});

/**
 * @openapi
 * /angina-treatment:
 *   get:
 *     summary: Get all NSTEMI Treatment records
 *     tags:
 *       - 7.Angina Treatment
 *     responses:
 *       200:
 *         description: List of NSTEMI Treatment records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   triage_id:
 *                     type: integer
 *                     example: 123
 *                   nstemi_confirmed_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T12:30:00Z"
 *                   loading_dose_location_id:
 *                     type: integer
 *                     example: 1
 *                   loading_dose_drug_id:
 *                     type: integer
 *                     example: 2
 *                   loading_dose_time:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T13:00:00Z"
 *                   timi_risk_score_id:
 *                     type: integer
 *                     example: 3
 *                   treatment_strategy_id:
 *                     type: integer
 *                     example: 2
 *                   cath_lab_arrival:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T14:00:00Z"
 *                   balloon_inflation:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T14:30:00Z"
 *                   stent_type_id:
 *                     type: integer
 *                     example: 1
 *                   complications:
 *                     type: string
 *                     example: "Minor bleeding"
 *                   transfer_location_id:
 *                     type: integer
 *                     example: 4
 *                   symptom_to_fmc:
 *                     type: integer
 *                     example: 20
 *                   fmc_to_ecg:
 *                     type: integer
 *                     example: 15
 *                   icu_admission:
 *                     type: boolean
 *                     example: true
 *                   hospital_stay_days:
 *                     type: integer
 *                     example: 5
 *                   in_hospital_complications:
 *                     type: string
 *                     example: "Arrhythmia"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T14:45:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T14:45:00Z"
 */

router.get('/angina-treatment', async (_req, res, next) => {
  try {
    const records = await StemiService.getAllAnginaTreament();
    res.json(records);
  } catch (e) {
    logger.error('Get all Angina Treatment error', e);
    next(e);
  }
});
/**
 * @openapi
 * /angina-treatment/{id}:
 *   get:
 *     summary: Get NSTEMI Treatment record by ID
 *     tags:
 *       - 7.Angina Treatment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: NSTEMI Treatment record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 nstemi_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00Z"
 *                 loading_dose_location_id:
 *                   type: integer
 *                   example: 1
 *                 loading_dose_drug_id:
 *                   type: integer
 *                   example: 2
 *                 loading_dose_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T13:00:00Z"
 *                 timi_risk_score_id:
 *                   type: integer
 *                   example: 3
 *                 treatment_strategy_id:
 *                   type: integer
 *                   example: 2
 *                 cath_lab_arrival:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:00:00Z"
 *                 balloon_inflation:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 stent_type_id:
 *                   type: integer
 *                   example: 1
 *                 complications:
 *                   type: string
 *                   example: "Minor bleeding"
 *                 transfer_location_id:
 *                   type: integer
 *                   example: 4
 *                 symptom_to_fmc:
 *                   type: integer
 *                   example: 20
 *                 fmc_to_ecg:
 *                   type: integer
 *                   example: 15
 *                 icu_admission:
 *                   type: boolean
 *                   example: true
 *                 hospital_stay_days:
 *                   type: integer
 *                   example: 5
 *                 in_hospital_complications:
 *                   type: string
 *                   example: "Arrhythmia"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 *       404:
 *         description: NSTEMI Treatment not found
 */
router.get('/angina-treatment/:id', async (req, res, next) => {
  try {
    const record = await StemiService.getByIdAnginaTreament(Number(req.params.id));
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) {
    logger.error(`Get Angina Treatment by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @openapi
 * /angina-treatment/{id}:
 *   put:
 *     summary: Update NSTEMI Treatment record by ID
 *     tags:
 *       - 7.Angina Treatment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               nstemi_confirmed_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:30:00Z"
 *               loading_dose_location_id:
 *                 type: integer
 *                 example: 1
 *               loading_dose_drug_id:
 *                 type: integer
 *                 example: 2
 *               loading_dose_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T13:00:00Z"
 *               timi_risk_score_id:
 *                 type: integer
 *                 example: 3
 *               treatment_strategy_id:
 *                 type: integer
 *                 example: 2
 *               cath_lab_arrival:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:00:00Z"
 *               balloon_inflation:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T14:30:00Z"
 *               stent_type_id:
 *                 type: integer
 *                 example: 1
 *               complications:
 *                 type: string
 *                 example: "Minor bleeding"
 *               transfer_location_id:
 *                 type: integer
 *                 example: 4
 *               symptom_to_fmc:
 *                 type: integer
 *                 example: 20
 *               fmc_to_ecg:
 *                 type: integer
 *                 example: 15
 *               icu_admission:
 *                 type: boolean
 *                 example: true
 *               hospital_stay_days:
 *                 type: integer
 *                 example: 5
 *               in_hospital_complications:
 *                 type: string
 *                 example: "Arrhythmia"
 *     responses:
 *       200:
 *         description: NSTEMI Treatment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 nstemi_confirmed_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00Z"
 *                 loading_dose_location_id:
 *                   type: integer
 *                   example: 1
 *                 loading_dose_drug_id:
 *                   type: integer
 *                   example: 2
 *                 loading_dose_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T13:00:00Z"
 *                 timi_risk_score_id:
 *                   type: integer
 *                   example: 3
 *                 treatment_strategy_id:
 *                   type: integer
 *                   example: 2
 *                 cath_lab_arrival:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:00:00Z"
 *                 balloon_inflation:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:30:00Z"
 *                 stent_type_id:
 *                   type: integer
 *                   example: 1
 *                 complications:
 *                   type: string
 *                   example: "Minor bleeding"
 *                 transfer_location_id:
 *                   type: integer
 *                   example: 4
 *                 symptom_to_fmc:
 *                   type: integer
 *                   example: 20
 *                 fmc_to_ecg:
 *                   type: integer
 *                   example: 15
 *                 icu_admission:
 *                   type: boolean
 *                   example: true
 *                 hospital_stay_days:
 *                   type: integer
 *                   example: 5
 *                 in_hospital_complications:
 *                   type: string
 *                   example: "Arrhythmia"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:50:00Z"
 *       404:
 *         description: NSTEMI Treatment not found
 */
router.put('/angina-treatment/:id', async (req, res, next) => {
  try {
    const updated = await StemiService.updateAnginaTreament(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error(`Update Angina Treatment for Id ${req.params.id} error`, e);
    next(e);
  }
});

router.delete('/angina-treatment/:id', async (req, res, next) => {
  try {
    const deleted = await StemiService.deleteAnginaTreament(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) {
    logger.error(`Delete Angina Treatment by Id ${req.params.id} error`, e);
    next(e);
  }
});

/**
 * ================== Unstable Angina Outcome ==================
 */
/**
 * @swagger
 * tags:
 *   name: 8.angina-outcome
 *   description: APIs - angina-outcome
 */
/**
 * @openapi
 * /angina-outcome/create:
 *   post:
 *     summary: Create a new angina-outcome record
 *     tags:
 *       - 8.angina-outcome
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               outcome_type_id:
 *                 type: integer
 *                 example: 1
 *               discharge_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:30:00Z"
 *               absconded_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:00:00Z"
 *               death_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-11T08:15:00Z"
 *               death_timing_id:
 *                 type: integer
 *                 example: 2
 *               cause_of_death:
 *                 type: string
 *                 example: "Cardiac arrest"
 *               hospital_type_id:
 *                 type: integer
 *                 example: 3
 *               destination_hospital:
 *                 type: string
 *                 example: "Apollo Hospital"
 *               referral_reason_id:
 *                 type: integer
 *                 example: 4
 *               patient_condition_id:
 *                 type: integer
 *                 example: 2
 *               referring_doctor:
 *                 type: string
 *                 example: "Dr. Kumar"
 *               documented_in_taei_case_sheet:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: angina-outcome created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 outcome_type_id:
 *                   type: integer
 *                   example: 1
 *                 discharge_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00Z"
 *                 absconded_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:00:00Z"
 *                 death_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-11T08:15:00Z"
 *                 death_timing_id:
 *                   type: integer
 *                   example: 2
 *                 cause_of_death:
 *                   type: string
 *                   example: "Cardiac arrest"
 *                 hospital_type_id:
 *                   type: integer
 *                   example: 3
 *                 destination_hospital:
 *                   type: string
 *                   example: "Apollo Hospital"
 *                 referral_reason_id:
 *                   type: integer
 *                   example: 4
 *                 patient_condition_id:
 *                   type: integer
 *                   example: 2
 *                 referring_doctor:
 *                   type: string
 *                   example: "Dr. Kumar"
 *                 documented_in_taei_case_sheet:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 */
router.post('/angina-outcome/create', async (req, res, next) => {
  try {
    const record = await StemiService.createAnginaOutcome(req.body);
    res.status(201).json(record);
  } catch (e) {
    logger.error('Create Angina Outcome error', e);
    next(e);
  }
});
/**
 * @openapi
 * /angina-outcome:
 *   get:
 *     summary: Get all angina-outcome records
 *     tags:
 *       - 8.angina-outcome
 *     responses:
 *       200:
 *         description: List of angina-outcome records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   triage_id:
 *                     type: integer
 *                     example: 123
 *                   outcome_type_id:
 *                     type: integer
 *                     example: 1
 *                   discharge_datetime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T12:30:00Z"
 *                   absconded_datetime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T15:00:00Z"
 *                   death_datetime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-11T08:15:00Z"
 *                   death_timing_id:
 *                     type: integer
 *                     example: 2
 *                   cause_of_death:
 *                     type: string
 *                     example: "Cardiac arrest"
 *                   hospital_type_id:
 *                     type: integer
 *                     example: 3
 *                   destination_hospital:
 *                     type: string
 *                     example: "Apollo Hospital"
 *                   referral_reason_id:
 *                     type: integer
 *                     example: 4
 *                   patient_condition_id:
 *                     type: integer
 *                     example: 2
 *                   referring_doctor:
 *                     type: string
 *                     example: "Dr. Kumar"
 *                   documented_in_taei_case_sheet:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T14:45:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-09-10T14:45:00Z"
 */
router.get('/angina-outcome', async (_req, res, next) => {
  try {
    const records = await StemiService.getAllAnginaOutcome();
    res.json(records);
  } catch (e) {
    logger.error('Get all Angina Outcome error', e);
    next(e);
  }
});
/**
 * @openapi
 * /angina-outcome/{id}:
 *   get:
 *     summary: Get angina-outcome record by ID
 *     tags:
 *       - 8.angina-outcome
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: angina-outcome record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 triage_id:
 *                   type: integer
 *                   example: 123
 *                 outcome_type_id:
 *                   type: integer
 *                   example: 1
 *                 discharge_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T12:30:00Z"
 *                 absconded_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T15:00:00Z"
 *                 death_datetime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-11T08:15:00Z"
 *                 death_timing_id:
 *                   type: integer
 *                   example: 2
 *                 cause_of_death:
 *                   type: string
 *                   example: "Cardiac arrest"
 *                 hospital_type_id:
 *                   type: integer
 *                   example: 3
 *                 destination_hospital:
 *                   type: string
 *                   example: "Apollo Hospital"
 *                 referral_reason_id:
 *                   type: integer
 *                   example: 4
 *                 patient_condition_id:
 *                   type: integer
 *                   example: 2
 *                 referring_doctor:
 *                   type: string
 *                   example: "Dr. Kumar"
 *                 documented_in_taei_case_sheet:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-10T14:45:00Z"
 *       404:
 *         description: angina-outcome not found
 */
router.get('/angina-outcome/:id', async (req, res, next) => {
  try {
    const record = await StemiService.getByIdAnginaOutcome(Number(req.params.id));
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  } catch (e) {
    logger.error(`Get Angina Outcome by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @openapi
 * /angina-outcome/{id}:
 *   put:
 *     summary: Update angina-outcome record by ID
 *     tags:
 *       - 8.angina-outcome
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               triage_id:
 *                 type: integer
 *                 example: 123
 *               outcome_type_id:
 *                 type: integer
 *                 example: 1
 *               discharge_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T12:30:00Z"
 *               absconded_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-10T15:00:00Z"
 *               death_datetime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-11T08:15:00Z"
 *               death_timing_id:
 *                 type: integer
 *                 example: 2
 *               cause_of_death:
 *                 type: string
 *                 example: "Cardiac arrest"
 *               hospital_type_id:
 *                 type: integer
 *                 example: 3
 *               destination_hospital:
 *                 type: string
 *                 example: "Apollo Hospital"
 *               referral_reason_id:
 *                 type: integer
 *                 example: 4
 *               patient_condition_id:
 *                 type: integer
 *                 example: 2
 *               referring_doctor:
 *                 type: string
 *                 example: "Dr. Kumar"
 *               documented_in_taei_case_sheet:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: angina-outcome updated successfully
 *       404:
 *         description: angina-outcome not found
 */
router.put('/angina-outcome/:id', async (req, res, next) => {
  try {
    const updated = await StemiService.updateAnginaOutcome(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error(`Update Angina Outcome for Id ${req.params.id} error`, e);
    next(e);
  }
});

router.delete('/angina-outcome/:id', async (req, res, next) => {
  try {
    const deleted = await StemiService.deleteAnginaOutcome(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (e) {
    logger.error(`Delete Angina Outcome by Id ${req.params.id} error`, e);
    next(e);
  }
});
/**
 * @openapi
 * /lookup:
 *   get:
 *     summary: Get all lookup
 *     tags:
 *       - Stemi Lookup
 *     responses:
 *       200:
 *         description: List of angina-outcome records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await StemiService.getAllLookups();
        logger.info('GetAllLookups');
        res.status(200).json(result);
    } catch (e) {
        logger.error('GetAllLookups error', e);
        next(e);
    }
});
router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StemiService.getNonIndex(+req.params.id);
    logger.info('Stemi nonIndex');
    res.status(200).json(result);
  } catch (e) {
    logger.error('nonIndex Stemi error', e);
    next(e);
  }
});
router.get('/nonIndexop/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StemiService.getNonIndexOP(+req.params.id);
    logger.info('Stemi nonIndex OP Patient');
    res.status(200).json(result);
  } catch (e) {
    logger.error('nonIndex OP Stemi error', e);
    next(e);
  }
});
export default router;
