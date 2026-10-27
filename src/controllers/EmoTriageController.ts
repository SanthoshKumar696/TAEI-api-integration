import { NextFunction, Request, Response, Router } from 'express';
import { EmoTriageService } from '../services/EmoTriageService';
import logger from "../utils/logger";
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';

const service = new EmoTriageService();
const router = Router();

router.get('/getAll', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emo = await service.getAll();
    if (!emo) return res.status(404).json({ message: 'Not found' });
    res.status(201).json(emo);
  } catch (e) {
    logger.error('get all emo error', e);
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
    const result = await service.list(Number(offset), Number(limit), filters, getHospitalId(req), start_date as string, end_date as string);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Get list of Emo error', error);
    next(error);
  }
});

router.get('/byid/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emo = await service.getById(+req.params.id);
    if (!emo) return res.status(404).json({ message: 'Not found' });
    res.status(201).json(emo);
  } catch (e) {
    logger.error('get by id emo error', e);
    next(e);
  }
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emo = await service.create(req.body, getUserId(req));
    res.status(201).json(emo);
  } catch (e) {
    logger.error('Create emo error', e);
    next(e);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emo = await service.update(+req.params.id, req.body, getUserId(req));
    if (!emo) return res.status(404).json({ message: 'Not found' });
    res.status(201).json(emo);
  } catch (e) {
    logger.error('Update emo error', e);
    next(e);
  }
});


router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const emo = await service.delete(+req.params.id);
    if (!emo) return res.status(404).json({ message: 'Not found' });
    res.status(204).json(emo);
  } catch (e) {
    logger.error('Update emo error', e);
    next(e);
  }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getAllLookups();
    logger.info('GetAllLookups - EMO Success');
    res.status(200).json(result);
  } catch (e) {
    logger.error('GetAllLookups - EMO error', e);
  }
});

router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getNonIndex(+req.params.id);
    logger.info('EMO - nonIndex');
    res.status(200).json(result);
  } catch (e) {
    logger.error('nonIndex EMO Triage error', e);
    next(e);
  }
});

export default router;

/*
export class EmoTriageController {
  async getAll(req: Request, res: Response) {
    const data = await service.getAll();
    res.json(data);
  }

  async getById(req: Request, res: Response) {
    const record = await service.getById(+req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  }

  async create(req: Request, res: Response) {
    const record = await service.create(req.body);
    res.status(201).json(record);
  }

  async update(req: Request, res: Response) {
    const record = await service.update(+req.params.id, req.body);
    if (!record) return res.status(404).json({ message: 'Not found' });
    res.json(record);
  }

  async delete(req: Request, res: Response) {
    const success = await service.delete(+req.params.id);
    if (!success) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  }
}
*/