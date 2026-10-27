import { NextFunction, Request, Response, Router } from 'express';
import logger from '../utils/logger';
import { getHospitalId, getHospitalName, getUserName, toBoolean } from '../utils/user_functions';
import { SummaryService } from '../services/SummaryService';

const summaryService = new SummaryService();
const router = Router();

router.get('/TransitCare', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date and end_date are required" });
        }
        const result = await summaryService.getTransitCareSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get Transit Care  abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Transit Care abstrat summary error - ', error);
        next(error);
    }
});

router.get('/TriageNurse', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date, is_age12 } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date and end_date are required" });
        }
        const result = await summaryService.getTriageNurseSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req),
            toBoolean(is_age12)
        );
        logger.info('Get Triage Nurse abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Triage Nurse abstrat summary error - ', error);
        next(error);
    }
});

router.get('/Emo', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date, is_age12 } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getEmoSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req),
            toBoolean(is_age12)
        );
        logger.info('Get EMO abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Emo abstrat summary error - ', error);
        next(error);
    }
});


router.get('/Trauma', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getTraumaSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get Trauma abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Trauma abstrat summary error - ', error);
        next(error);
    }
});

router.get('/Burns', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getBurnsSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get Burns abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Burns abstrat summary error - ', error);
        next(error);
    }
});

router.get('/Stroke', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getStrokeSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get Stroke abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Stroke abstrat summary error - ', error);
        next(error);
    }
});

router.get('/Poison', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getPoisonSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get Poison abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Poison abstrat summary error - ', error);
        next(error);
    }
});

router.get('/BitesStings', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getBitesStingsSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get BitesStings abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get BitesStings abstrat summary error - ', error);
        next(error);
    }
});

router.get('/Hanging', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getHangingSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get Hanging abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Hanging abstrat summary error - ', error);
        next(error);
    }
});

router.get('/Prem', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getPremSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get Prem abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get Prem abstrat summary error - ', error);
        next(error);
    }
});

router.get('/stemi', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;
        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getStemiSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get stemi abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get stemi abstrat summary error - ', error);
        next(error);
    }
});

router.get('/drowning', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ message: "start_date, end_date and hospital_name are required" });
        }
        const result = await summaryService.getDrowningSummary(
            start_date as string,
            end_date as string,
            getHospitalName(req),
            getHospitalId(req)
        );
        logger.info('Get drowning abstrat summary requested by user - ' + getUserName(req));
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Get drowning abstrat summary error - ', error);
        next(error);
    }
});

export default router;