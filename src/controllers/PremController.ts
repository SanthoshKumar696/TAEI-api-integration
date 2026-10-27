// controllers/prem.controller.ts
import { NextFunction, Request, Response, Router } from 'express';
import { PremService } from '../services/PremService';
import logger from '../utils/logger';
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';

const premService = new PremService();

const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prem = await premService.create(req.body, getUserId(req));
        res.status(201).json(prem);
    } catch (e) {
        logger.error('Create Prem error', e);
        next(e);
    }
});

router.get('/', async (_: Request, res: Response, next: NextFunction) => {
    try {
        const data = await premService.getAll();
        res.json(data);
    } catch (e) {
        logger.error('get Prem error', e);
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
        const strokes = await premService.list(Number(offset), Number(limit), filters, getHospitalId(req), start_date as string, end_date as string);
        res.json(strokes);
    } catch (e) {
        logger.error('get Prem list error', e);
        next(e);
    }
});

router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prem = await premService.getById(Number(req.params.id));
        if (!prem) return res.status(404).json({ message: 'Not found' });
        res.json(prem);
    } catch (e) {
        logger.error('get Prem by ID error', e);
        next(e);
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prem = await premService.update(Number(req.params.id), req.body, getUserId(req));
        if (!prem) return res.status(404).json({ message: 'Not found' });
        res.json(prem);
    } catch (e) {
        logger.error('update Prem error', e);
        next(e);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await premService.delete(Number(req.params.id));
        if (!count) return res.status(404).json({ message: 'Not found' });
        res.status(204).send();
    } catch (e) {
        logger.error('delete Prem error', e);
        next(e);
    }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await premService.getAllLookups();
        logger.info('GetAllLookups');
        res.status(200).json(result);
    } catch (e) {
        logger.error('GetAllLookups Prem error', e);
        next(e);
    }
});

router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await premService.getNonIndex(+req.params.id);
        logger.info('Prem nonIndex');
        res.status(200).json(result);
    } catch (e) {
        logger.error('nonIndex Prem error', e);
        next(e);
    }
});


export default router;