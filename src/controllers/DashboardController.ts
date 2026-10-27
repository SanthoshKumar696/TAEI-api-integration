import { NextFunction, Request, Response, Router } from 'express';
import { DashboardService } from '../services/DashboardService';
import logger from "../utils/logger";
import { getHospitalId } from '../utils/user_functions';
const router = Router();


router.post('/get-poison-report', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_poison_dashboard(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.post('/get-poison-report-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_poison_dashboard_multi(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});

router.post('/get-kpi-dashboard', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_kpi_dashboard(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.post('/get-kpi-dashboard-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_kpi_dashboard_multi(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});


router.post('/get-report-dashboard', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_report_dashboard(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.post('/get-report-dashboard-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_report_dashboard_multi(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});


router.post('/get-entry-report', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_entry_report(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.post('/get-entry-report-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_entry_report_multi(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.get('/get-entry-report-list', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_entry_report_by_click(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.get('/get-entry-report-list-108', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_entry_report_by_click_108(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.get('/get-search-patient', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_patient_tracker_search(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error Patient Search', e);
        next(e);
    }
});
router.get('/get-patient-details', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_patient_tracker_details(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error Patient Details', e);
        next(e);
    }
});
//#region dashboard

// Prehospital Dashboard
router.get('/get-dashboard-prehospital', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_dashboard_prehospital(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard prehospital', e);
        next(e);
    }
});
router.get('/get-dashboard-prehospital-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_dashboard_prehospital_multi(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard prehospital', e);
        next(e);
    }
});
router.get('/get-dashboard-main', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_dashboard_main(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard prehospital', e);
        next(e);
    }
});
//IN Hospital Dashboard
router.get('/get-dashboard-main-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_dashboard_main_multi(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard prehospital', e);
        next(e);
    }
});
router.get('/get-dashboard-trauma', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_dashboard_trauma(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard Trauma', e);
        next(e);
    }
});
router.get('/get-hospital-by-district', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_hospital_by_district(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard Trauma', e);
        next(e);
    }
});
//#endregion

router.get('/get-triage-list', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.getTriageList(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard Trauma', e);
        next(e);
    }
});
router.get('/get-triage-list-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.getTriageList_multi(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard Trauma', e);
        next(e);
    }
});

router.get('/get-district', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_district(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard Trauma', e);
        next(e);
    }
});
router.get('/get-directorate', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await DashboardService.get_directorate(req);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Error dashboard Trauma', e);
        next(e);
    }
});

export default router;