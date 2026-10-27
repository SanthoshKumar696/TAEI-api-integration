import { NextFunction, Request, Response, Router } from 'express';
import { DrowningService } from '../services/DrowningService';
import logger from '../utils/logger';
import { getHospitalId } from '../utils/user_functions';

const router = Router();
const drowningService = new DrowningService();


// POST /drowning
router.post('/drowning-all/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drowning = await drowningService.create_drowning_all(req.body);
    res.status(201).json(drowning);
  } catch (e) {
    logger.error('Drowning create error', e);
    next(e);
  }
});

router.get('/drowning-all/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drowning = await drowningService.find_drowning_all(Number(req.params.id));
    if (!drowning) return res.status(404).json({ message: 'Not found' });
    res.json(drowning);
  } catch (e) {
    logger.error('Drowning findById error', e);
    next(e);
  }
});


router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;
        const { offset = 1, limit = 20, ...filters } = req.query;
        const result = await drowningService.list(Number(offset), Number(limit), filters, getHospitalId(req),start_date as string,end_date as string);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get list of bites Stings error', error);
        next(error);
    }
});

/**
 * @swagger
 * /drowning-case/create:
 *   post:
 *     summary: Create a drowning case
 *     tags: [Drowning]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_admitted_id: { type: integer }
 *               admitting_department: { type: string }
 *               admission_datetime: { type: string, format: date-time }
 *               place_of_incident_id: { type: integer }
 *               type_of_water_id: { type: integer }
 *               activity_during_drowning_id: { type: integer }
 *               assessment_id: { type: integer }
 *               intervention_id: { type: integer }
 *               counselling_before_discharge_id: { type: integer }
 *               discharge_datetime: { type: string, format: date-time }
 *               duration_of_hospital_stay: { type: integer }
 *               complications_admission: { type: string }
 *               supportive_care: { type: string }
 *               complications_developed: { type: string }
 *     responses:
 *       201:
 *         description: Created successfully
 */
// POST /drowning
router.post('/drowning-case/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drowning = await drowningService.create(req.body);
    res.status(201).json(drowning);
  } catch (e) {
    logger.error('Drowning create error', e);
    next(e);
  }
});

// GET/drowning
router.get('/drowning-case', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const drownings = await drowningService.findAll();
    res.json(drownings);
  } catch (e) {
    logger.error('Drowning findAll error', e);
    next(e);
  }
});

// GET /drowning/:id
router.get('/drowning-case/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drowning = await drowningService.findById(Number(req.params.id));
    if (!drowning) return res.status(404).json({ message: 'Not found' });
    res.json(drowning);
  } catch (e) {
    logger.error('Drowning findById error', e);
    next(e);
  }
});

// PUT /drowning/:id
router.put('/drowning-case/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await drowningService.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error('Drowning update error', e);
    next(e);
  }
});

// DELETE /drowning/:id
router.delete('/drowning-case/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await drowningService.delete(Number(req.params.id));
    res.json({ deleted });
  } catch (e) {
    logger.error('Drowning delete error', e);
    next(e);
  }
});


// POST /drowning
router.post('/drowning-outcome/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drowning = await drowningService.outcome_create(req.body);
    res.status(201).json(drowning);
  } catch (e) {
    logger.error('Drowning create error', e);
    next(e);
  }
});

// GET/drowning
router.get('/drowning-outcome', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const drownings = await drowningService.outcome_findAll();
    res.json(drownings);
  } catch (e) {
    logger.error('Drowning findAll error', e);
    next(e);
  }
});

// GET /drowning/:id
router.get('/drowning-outcome/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drowning = await drowningService.outcome_findById(Number(req.params.id));
    if (!drowning) return res.status(404).json({ message: 'Not found' });
    res.json(drowning);
  } catch (e) {
    logger.error('Drowning findById error', e);
    next(e);
  }
});

// PUT /drowning/:id
router.put('/drowning-outcome/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await drowningService.outcome_update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error('Drowning update error', e);
    next(e);
  }
});

// DELETE /drowning/:id
// router.delete('/drowning-case/:id', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const deleted = await drowningService.delete(Number(req.params.id));
//     res.json({ deleted });
//   } catch (e) {
//     logger.error('Drowning delete error', e);
//     next(e);
//   }
// });

// GET /drowning/lookups
router.get('/lookups', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await drowningService.getAllLookups();
    logger.info('Drowning getAllLookups success');
    res.status(200).json(result);
  } catch (e) {
    logger.error('Drowning getAllLookups error', e);
    next(e);
  }
});
router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await drowningService.getNonIndex(+req.params.id);
    logger.info('Drowning nonIndex');
    res.status(200).json(result);
  } catch (e) {
    logger.error('nonIndex Drowning error', e);
    next(e);
  }
});

export default router;
