import { NextFunction, Request, Response, Router } from 'express';
import { API108Service } from '../services/API108Service';
import axios from 'axios';
import logger from "../utils/logger";
import { getHospitalId } from '../utils/user_functions';
const fs = require("fs");
const router = Router();

router.get('/get-taei-report', async (req: Request, res: Response, next: NextFunction) => {
    console.log("constroller start :"+ req)
    try {
        const { date = "2025-10-13", to_date = "2025-10-13", ...filters } = req.query;
        const filePath:any = await API108Service.get_taei_report(date,to_date);
        //  res.download(filePath, (err) => {
        //     if (!err) fs.unlinkSync(filePath); // delete after download
        // });
        res.download(filePath, () => fs.unlinkSync(filePath));
    
        // res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.post('/Add_Calls_New', async (req: Request, res: Response, next: NextFunction) => {
    console.log();
    try {
        // Replace this with your target URL
        const targetUrl = 'https://web.taei.co.in/API108/Add_Calls_New';

        // Forward the same body, headers, and method
        const response = await axios.post(targetUrl, req.body, {
            timeout: 10000, // optional timeout
        });

        // Return the same response data from target
        res.status(response.status).json(response.data);

    } catch (e: any) {
        logger.error('Error forwarding Add_Calls_New request:', e.message);
        
        // Send back appropriate error
        if (e.response) {
            res.status(e.response.status).json(e.response.data);
        } else {
            res.status(500).json({ message: 'Error forwarding request', error: e.message });
        }

        next(e);
    }
});
router.post('/api-add-calls', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await API108Service.add_calls(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create 108 Case error', e);
        next(e);
    }
});
router.post('/api-sync', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const burn = await API108Service.fetchAndSaveCases();
        res.status(201).json("");
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.post('/api-sync-new', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await API108Service.fetchAndSaveCases();
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});
router.post('/get-caselist', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const burn = await API108Service.get_all_cases(req.body);
        res.status(201).json(burn);
    } catch (e) {
        logger.error('Create Burns error', e);
        next(e);
    }
});


export default router;

