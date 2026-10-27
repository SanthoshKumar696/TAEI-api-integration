import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import EmoTriageController from "../controllers/EmoTriageController";
import TriageController from "../controllers/TriageController";
import TraumaController from "../controllers/TraumaController";
import PremController from "../controllers/PremController";
import StrokeController from "../controllers/StrokeController";
import HangingController from "../controllers/HangingController";
import PoisonsController from "../controllers/PoisonsController";
import BurnsController from "../controllers/BurnsController";
import BitesStingsController from "../controllers/BitesStingsController";
import StemiController from "../controllers/StemiController";
import DrowningController from "../controllers/DrowningController";
import API108Controller from "../controllers/API108Controller";
import { authorize } from "../middlewares/authorize";
import SummaryController from "../controllers/SummaryController";
import DashboardController from "../controllers/DashboardController";
import abhaController from "../controllers/AbhaController";



const router = Router();


router.use('/triage',  TriageController);
router.use('/emotriage', authenticate, authorize("EmoTriage"), EmoTriageController);
router.use('/trauma', authenticate, authorize("Trauma"), TraumaController);
router.use('/burns', authenticate, authorize("Burns"),BurnsController);
router.use('/poisons', authenticate, authorize("Poisoning"),PoisonsController);
router.use('/bitesStings', authenticate, authorize("BitesStings"),BitesStingsController);
router.use('/hanging', authenticate, authorize("Hanging"),HangingController);
router.use('/stroke', authenticate, authorize("Stroke"),StrokeController);
router.use('/prem', authenticate, authorize("Prem"),PremController);
router.use('/stemi', authenticate, authorize("Stemi"),StemiController);
router.use('/drowning', authenticate, authorize("Drowning"),DrowningController);
router.use('/api108',API108Controller);
router.use('/summary',authenticate, SummaryController);
router.use('/dashboard',DashboardController);

router.use('/abha',abhaController)








export default router; 