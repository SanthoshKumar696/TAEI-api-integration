import express from 'express';
import TriageController from '../controllers/TriageController';

const router = express.Router();
router.use('/triage', TriageController);
export default router;

// import { Router } from "express";
// import { TriageController } from "../controllers/TriageController";
// import { authenticate } from "../middlewares/authenticate";

// const router = Router();

// const ctrl = new TriageController();
// /**
//  * @swagger
//  * /api/triage/:
//  *   post:
//  *     summary: Create a full triage record
//  *     tags: [Triage]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *     responses:
//  *       201:
//  *         description: Triage created
//  */
// router.post("/", authenticate, ctrl.create);
// /**
//  * @swagger
//  * /api/triage/:
//  *   get:
//  *     summary: Get all triage list
//  *     tags: [Triage]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *     responses:
//  *       201:
//  *         description: Triage created
//  */
// router.get("/", authenticate, ctrl.list);
// /**
//  * @swagger
//  * /api/triage/{id}:
//  *   put:
//  *     summary: Update a full triage record
//  *     tags: [Triage]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Triage updated
//  */
// router.put("/:id", authenticate, ctrl.update);
// /**
//  * @swagger
//  * /api/triage/{id}:
//  *   delete:
//  *     summary: Delete a full triage record
//  *     tags: [Triage]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Triage deleted
//  */
// router.delete("/:id", authenticate, ctrl.delete);

// export default router;
