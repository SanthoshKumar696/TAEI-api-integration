import { Request, Response, NextFunction, Router } from "express";
import { TriageService } from "../services/TriageService";
import logger from "../utils/logger";
import { getHospitalId, getUserId, toBoolean } from "../utils/user_functions";

const service = new TriageService();
const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = await service.create(req.body, getHospitalId(req), getUserId(req));
    logger.info('Create Triage success');
    res.status(201).json(result);
  } catch (e) {
    logger.error('createTriage error', e);
    next(e);
  }
});

// router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { page = 1, size = 20, ...filters } = req.query;
//     const result = await service.getList(+page, +size, filters);
//     logger.info('Get Triage List success');
//     res.json(result);
//   } catch (e) {
//     logger.error('Get Triage error', e);
//     next(e);
//   }
// });

/**
 * @swagger
 * /api/triage/list:
 *   get:
 *     summary: Get Triage List
 *     description: Returns a paginated list of triage records filtered by date range and other optional filters.
 *     tags:
 *       - Triage
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-07-01"
 *         description: Start date (YYYY-MM-DD)
 *
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-07-23"
 *         description: End date (YYYY-MM-DD)
 *
 *       - in: query
 *         name: is_age12
 *         required: false
 *         schema:
 *           type: boolean
 *         example: true
 *         description: Filter patients aged 12 years or below.
 *
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *         description: Page number.
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         example: 20
 *         description: Number of records per page.
 *
 *     responses:
 *       200:
 *         description: Triage list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 125
 *                 offset:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: start_date and end_date are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: start_date and end_date are required
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/list', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { start_date, end_date, is_age12 } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ message: "start_date and end_date are required" });
    }
    const { offset = 1, limit = 20, ...filters } = req.query;
    const result = await service.getList(+offset, +limit, filters, getHospitalId(req),
      start_date as string,
      end_date as string,
      toBoolean(is_age12));
    logger.info('Get Triage List success');
    res.json({ success: true, ...result });
  } catch (e) {
    logger.error('Get Triage error', e);
    next(e);
  }
});

router.get('/byId/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getById(+req.params.id);
    logger.info('Get by Triage ID success ID - ' + req.params.id);
    res.status(200).json(result);
  } catch (e) {
    logger.error('Get by Triage ID error', e);
    next(e);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.update(+req.params.id, req.body, getUserId(req));
    logger.info('Update Triage success ID - ' + req.params.id);
    res.status(200).json(result);
  } catch (e) {
    logger.error('Update Triage error', e);
    next(e);
  }
});
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const result = await service.delete(+req.params.id);
    logger.info('Delete Triage success ID - ' + req.params.id);
    res.status(200).json(result);
  } catch (e) {
    logger.error('Delete Triage error', e);
    return res.status(404).json({ message: 'Not found' });
  }
});

router.get('/lookup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getAllLookups();
    logger.info('GetAllLookups');
    res.status(200).json(result);
  } catch (e) {
    logger.error('GetAllLookups Triage error', e);
    next(e);
  }
});


router.get('/hospitals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getHospitals();
    logger.info('Get hospitals');
    res.status(200).json(result);
  } catch (e) {
    logger.error('Get hospitals error', e);
    next(e);
  }
});

router.get('/nonIndex/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getNonIndex(+req.params.id);
    logger.info('Triage nonIndex');
    res.status(200).json(result);
  } catch (e) {
    logger.error('nonIndex Triage error', e);
    next(e);
  }
});

export default router;

/*export class TriageController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.insertFull(req.body);
      logger.info('Create Triage success');
      res.status(201).json(result);
    } catch (e) {
      logger.error('createTriage error', e);
      next(e);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, size = 20, ...filters } = req.query;
      const result = await service.getList(+page, +size, filters);
      logger.info('Get Triage List success');
      res.json(result);
    } catch (e) {
      logger.error('Get Triage error', e);
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.update(+req.params.id, req.body);
      logger.info('Update Triage success ID - ' + req.params.id);
      res.status(200).json(result);
    } catch (e) {
      logger.error('Update Triage error', e);
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.delete(+req.params.id);
      logger.info('Delete Triage success ID - ' + req.params.id);
      res.status(200).json(result);
    } catch (e) {
      logger.error('Delete Triage error', e);
      next(e);
    }
  }
}*/