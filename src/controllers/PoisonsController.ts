import { NextFunction, Request, Response, Router } from 'express';
import { PoisonsService } from '../services/PoisonsService';
import logger from '../utils/logger';
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';

const poisonsService = new PoisonsService();

const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const poisons = await poisonsService.create(req.body, getUserId(req));
        res.status(201).json(poisons);
    } catch (error) {
        logger.error('Create Poison error', error);
        next(error);
    }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(await poisonsService.getAll());
    } catch (error) {
        logger.error('Create Poison error', error);
        next(error);
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
        const strokes = await poisonsService.list(Number(offset), Number(limit), filters, getHospitalId(req), start_date as string, end_date as string);
        res.json(strokes);
    } catch (e) {
        logger.error('get Poison list error', e);
        next(e);
    }
});

router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const poisons = await poisonsService.getById(Number(req.params.id));
        if (!poisons) return res.status(404).json({ error: 'Not found' });
        res.json(poisons);
    } catch (error) {
        logger.error('Get Poison by Id error', error);
        next(error);
    }
});

router.get('/getByTriageId/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const poisons = await poisonsService.getByTriageId(Number(req.params.id));
        if (!poisons) return res.status(404).json({ error: 'Not found' });
        res.json(poisons);
    } catch (error) {
        logger.error('Get Poison by Triage Id error', error);
        next(error);
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const poisons = await poisonsService.update(Number(req.params.id), req.body, getUserId(req));
        if (!poisons) return res.status(404).json({ error: 'Not found' });
        res.json(poisons);
    } catch (error) {
        logger.error('Update Poison error', error);
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await poisonsService.delete(Number(req.params.id));
        if (!count) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        logger.error('Delete Poison error', error);
        next(error);
    }
});


router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await poisonsService.getAllLookups();
        logger.info('GetAllLookups');
        res.status(200).json(result);
    } catch (e) {
        logger.error('GetAllLookups Poison error', e);
        next(e);
    }
});


router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await poisonsService.getNonIndex(+req.params.id);
        logger.info('Poison nonIndex');
        res.status(200).json(result);
    } catch (e) {
        logger.error('nonIndex Poison error', e);
        next(e);
    }
});

export default router;