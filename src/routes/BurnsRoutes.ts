
import { Router } from 'express';
import burnsController from '../controllers/BurnsController';

const router = Router();

router.use('/burns', burnsController);

export default router;
