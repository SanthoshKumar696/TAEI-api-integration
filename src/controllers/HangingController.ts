import { NextFunction, Request, Response, Router } from 'express';
import { HangingService } from '../services/HangingService';
import logger from '../utils/logger';
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';

const hangingService = new HangingService();
const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await hangingService.create(req.body, getUserId(req));
        res.status(201).json(data);
    } catch (error) {
        logger.error('Create Trauma error', error);
        next(error);
    }
});


router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await hangingService.getAll();
        res.json(data);
    } catch (error) {
        logger.error('Create Trauma error', error);
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
        const result = await hangingService.list(Number(offset), Number(limit), filters, getHospitalId(req), start_date as string, end_date as string);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get list of bites Stings error', error);
        next(error);
    }
});


router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await hangingService.getById(Number(req.params.id));
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
    } catch (error) {
        logger.error('Create Trauma error', error);
        next(error);
    }
});


router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await hangingService.update(Number(req.params.id), req.body, getUserId(req));
        console.log(JSON.stringify(updated));
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (error) {
        logger.error('Create Trauma error', error);
        next(error);
    }
});


router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await hangingService.delete(Number(req.params.id));
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        logger.error('Create Trauma error', error);
        next(error);
    }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await hangingService.getAllLookups();
        logger.info('GetAllLookups');
        res.status(200).json(result);
    } catch (e) {
        logger.error('GetAllLookups error', e);
        next(e);
    }
});


router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await hangingService.getNonIndex(+req.params.id);
        logger.info('Hanging nonIndex');
        res.status(200).json(result);
    } catch (e) {
        logger.error('nonIndex Hanging error', e);
        next(e);
    }
});

export default router;