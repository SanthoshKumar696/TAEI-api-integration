
import { Router } from 'express';
import HangingController from '../controllers/HangingController';

const router = Router();

router.use('/hanging', HangingController);

export default router;
