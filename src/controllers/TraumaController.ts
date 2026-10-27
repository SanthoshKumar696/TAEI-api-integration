import { NextFunction, Request, Response, Router } from 'express';
import TraumaService from '../services/TraumaService';
import logger from "../utils/logger";
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';

const traumaService = new TraumaService();
const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await traumaService.insertFull(req.body, getUserId(req));
        return res.status(201).json(result);
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
        const result = await traumaService.list(Number(offset), Number(limit), filters, getHospitalId(req), start_date as string, end_date as string);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get list of Trauma error', error);
        next(error);
    }
});

router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await traumaService.getById(Number(req.params.id));
        if (!result) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Trauma by Id ' + req.params.id + ' error', error);
        next(error);
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await traumaService.update(Number(req.params.id), req.body, getUserId(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Update Trauma by Id ' + req.params.id + ' error', error);
        next(error);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await traumaService.delete(Number(req.params.id));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Delete Trauma by Id ' + req.params.id + ' error', error);
        next(error);
    }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await traumaService.getAllLookups();
        logger.info('GetAllLookups');
        res.status(200).json(result);
    } catch (e) {
        logger.error('GetAllLookups Trauma error', e);
        next(e);
    }
});

router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Trauma nonIndex');
        const result = await traumaService.getNonIndex(+req.params.id);
        if (!result.trauma) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(result);
    } catch (e) {
        logger.error('nonIndex Trauma error', e);
        next(e);
    }
});

export default router;