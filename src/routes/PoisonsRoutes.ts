
import { Router } from 'express';
import poisonsController from '../controllers/PoisonsController';

const router = Router();

router.use('/poisons', poisonsController);

export default router;
