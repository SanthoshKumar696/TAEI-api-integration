import { NextFunction, Request, Response, Router } from 'express';
import { BitesStingsService } from '../services/BitesStingsService';
import logger from '../utils/logger';
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';

const router = Router();
const bitesStingsService = new BitesStingsService();

// POST /bites
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bite = await bitesStingsService.create(req.body, getUserId(req));
    res.status(201).json(bite);
  } catch (e) {
    logger.error('Get all Burns error', e);
    next(e);
  }
});

// GET /bites
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const bites = await bitesStingsService.findAll();
    res.json(bites);
  } catch (e) {
    logger.error('Get all Burns error', e);
    next(e);
  }
});


router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ message: "start_date and end_date are required" });
    }
    let { offset = 1, limit = 20, ...filters } = req.query;
    filters = getFilters(filters);
    const result = await bitesStingsService.list(Number(offset), Number(limit), filters, getHospitalId(req), start_date as string, end_date as string);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Get list of bites Stings error', error);
    next(error);
  }
});


// GET /bites/:id
router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bite = await bitesStingsService.findById(Number(req.params.id));
    if (!bite) return res.status(404).json({ message: 'Not found' });
    res.json(bite);
  } catch (e) {
    logger.error('Get bites by bites Id error', e);
    next(e);
  }
});

// GET /bites/getByTriageId/:id
router.get('/getByTriageId/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bite = await bitesStingsService.findByTriageId(Number(req.params.id));
    if (!bite) return res.status(404).json({ message: 'Not found' });
    res.json(bite);
  } catch (e) {
    logger.error('Get bites by triage Id error', e);
    next(e);
  }
});


// PUT /bites/:id
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await bitesStingsService.update(Number(req.params.id), req.body, getUserId(req));
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (e) {
    logger.error('Get all Burns error', e);
    next(e);
  }
});


// DELETE /bites/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await bitesStingsService.delete(Number(req.params.id));
    res.json({ deleted });
  } catch (e) {
    logger.error('Get all Burns error', e);
    next(e);
  }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bitesStingsService.getAllLookups();
    logger.info('GetAllLookups');
    res.status(200).json(result);
  } catch (e) {
    logger.error('GetAllLookups error', e);
    next(e);
  }
});


router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bitesStingsService.getNonIndex(+req.params.id);
    logger.info('Bites Stings nonIndex');
    res.status(200).json(result);
  } catch (e) {
    logger.error('nonIndex Bites Stings error', e);
    next(e);
  }
});

export default router;

