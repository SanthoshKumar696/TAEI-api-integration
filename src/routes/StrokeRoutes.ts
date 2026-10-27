
import { Router } from 'express';
import StrokeController from '../controllers/StrokeController';

const router = Router();

router.use('/stroke', StrokeController);

export default router;
