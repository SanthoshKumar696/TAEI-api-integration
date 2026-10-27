import { NextFunction, Request, Response, Router } from 'express';
import { BurnsService } from '../services/BurnsService';
import logger from "../utils/logger";
import { getFilters, getHospitalId, getUserId } from '../utils/user_functions';

const router = Router();
/**
 * @swagger
 * /api/burns/create:
 *   post:
 *     summary: Create a burns record
 *     tags: [Burns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Burns record created
 *       500:
 *         description: Server error
 */
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await BurnsService.create(req.body, getUserId(req));
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
/**
 * @swagger
 * /api/burns:
 *   get:
 *     summary: Get all burns records
 *     tags: [Burns]
 *     responses:
 *       200:
 *         description: List of burns records
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const burns = await BurnsService.getAll();
        res.json(burns);
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
        const result = await BurnsService.list(Number(offset), Number(limit), filters, getHospitalId(req), start_date as string, end_date as string);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get list of Burns error', error);
        next(error);
    }
});

router.get('/getById/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await BurnsService.getById(Number(req.params.id));
        if (!burn) return res.status(404).json({ message: 'Burn not found' });
        res.json(burn);
    } catch (e) {
        logger.error('Get burns by Id ' + req.params.id + ' error', e);
        next(e);
    }
});


router.get('/getByTriageId/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await BurnsService.getByTriageId(Number(req.params.id));
        if (!burn) return res.status(404).json({ message: 'Burn not found' });
        res.json(burn);
    } catch (e) {
        logger.error('Get burns by triage Id ' + req.params.id + ' error', e);
        next(e);
    }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await BurnsService.update(Number(req.params.id), req.body, getUserId(req));
        if (!updated) return res.status(404).json({ message: 'Burn not found' });
        res.json(updated);
    } catch (e) {
        logger.error('Update burns for Id ' + req.params.id + ' error', e);
        next(e);
    }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await BurnsService.delete(Number(req.params.id));
        if (!deleted) return res.status(404).json({ message: 'Burn not found' });
        res.status(204).send();
    } catch (e) {
        logger.error('Delete burns by Id ' + req.params.id + ' error', e);
        next(e);
    }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await BurnsService.getAllLookups();
        logger.info('GetAllLookups');
        res.status(200).json(result);
    } catch (e) {
        logger.error('GetAllLookups error', e);
        next(e);
    }
});

router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info('Burns nonIndex');
        const result = await BurnsService.getNonIndex(+req.params.id);
        if (!result.burns) return res.status(404).json({ message: 'Not found' });
        res.status(200).json(result);
    } catch (e) {
        logger.error('nonIndex Burns error', e);
        next(e);
    }
});

export default router;