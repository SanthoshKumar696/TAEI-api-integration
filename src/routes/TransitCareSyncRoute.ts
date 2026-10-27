
import { Router } from 'express';
import API108Controller from '../controllers/API108Controller';

const router = Router();

router.use('/', API108Controller);

export default router;
