import express from 'express';
import TraumaController from '../controllers/TraumaController';

const router = express.Router();
router.use('/trauma', TraumaController);
export default router;