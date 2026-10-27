import express from 'express';
import EmoTriageController from '../controllers/EmoTriageController';

const router = express.Router();
router.use('/emotriage', EmoTriageController);
// router.post('/saveTriage', EmoTriageController);
export default router;