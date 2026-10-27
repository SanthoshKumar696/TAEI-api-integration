
import { Router } from 'express';
import BitesStingsController from '../controllers/BitesStingsController';

const router = Router();

router.use('/bitesStings', BitesStingsController);

export default router;
