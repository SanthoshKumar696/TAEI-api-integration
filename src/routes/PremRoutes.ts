
import { Router } from 'express';
import PremController from '../controllers/PremController';

const router = Router();

router.use('/prem', PremController);

export default router;
