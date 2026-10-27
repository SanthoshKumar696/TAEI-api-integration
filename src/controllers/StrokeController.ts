import { NextFunction, Request, Response, Router } from 'express';
import { StrokeService } from '../services/StrokeService';
import logger from '../utils/logger';
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';


const strokeService = new StrokeService();
const router = Router()

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stroke = await strokeService.create(req.body, getUserId(req));
        res.status(201).json(stroke);
    } catch (e) {
        logger.error('Create Stroke error', e);
        next(e);
    }
});

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const strokes = await strokeService.getAll();
        res.json(strokes);
    } catch (e) {
        logger.error('get all Stroke error', e);
        next(e);
    }
});

router.get('/list', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = _req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date and end_date are required" });
        }
        let { offset = 1, limit = 20, ...filters } = _req.query;
        filters = getFilters(filters);
        const strokes = await strokeService.list(Number(offset), Number(limit), filters, getHospitalId(_req), start_date as string, end_date as string);
        res.json(strokes);
    } catch (e) {
        logger.error('get Stroke list error', e);
        next(e);
    }
});

router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stroke = await strokeService.getById(Number(req.params.id));
        if (!stroke) return res.status(404).json({ message: 'Not found' });
        res.json(stroke);
    } catch (e) {
        logger.error('get Stroke by Id error', e);
        next(e);
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stroke = await strokeService.update(Number(req.params.id), req.body, getUserId(req));
        if (!stroke) return res.status(404).json({ message: 'Not found' });
        res.json(stroke);
    } catch (e) {
        logger.error('update Stroke error', e);
        next(e);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await strokeService.delete(Number(req.params.id));
        res.json({ deleted });
    } catch (e) {
        logger.error('delete Stroke error', e);
        next(e);
    }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await strokeService.getAllLookups();
        logger.info('GetAllLookups');
        res.status(200).json(result);
    } catch (e) {
        logger.error('GetAllLookups Stroke error', e);
        next(e);
    }
});


router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await strokeService.getNonIndex(+req.params.id);
        logger.info('Stroke nonIndex');
        res.status(200).json(result);
    } catch (e) {
        logger.error('nonIndex Stroke error', e);
        next(e);
    }
});


export default router;