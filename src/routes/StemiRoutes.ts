
import { Router } from 'express';
import StemiCOntroller from '../controllers/StemiController';

const router = Router();

router.use('/stemi', StemiCOntroller);

export default router;
