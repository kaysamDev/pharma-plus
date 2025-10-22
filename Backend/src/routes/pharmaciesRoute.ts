// src/routes/pharmaciesRoute.ts
import { Router } from "express";
import {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
} from "../controllers/pharmacyController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pharmacies
 *   description: Endpoints for managing pharmacies
 */

/**
 * @swagger
 * /api/v1/pharmacy:
 *   post:
 *     summary: Create a new pharmacy
 *     tags: [Pharmacies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: HealthPlus Pharmacy
 *               address:
 *                 type: string
 *                 example: Osu, Accra
 *               phone:
 *                 type: string
 *                 example: "+233 555 123 456"
 *               email:
 *                 type: string
 *                 example: contact@healthplus.com
 *               website:
 *                 type: string
 *                 example: "https://healthplus.com"
 *     responses:
 *       201:
 *         description: Pharmacy created successfully
 *       400:
 *         description: Invalid input data
 */
router.post("/pharmacy", createPharmacy);

/**
 * @swagger
 * /api/v1/pharmacy:
 *   get:
 *     summary: Get all pharmacies
 *     tags: [Pharmacies]
 *     responses:
 *       200:
 *         description: A list of pharmacies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 672fba459fa93893b52e8b7c
 *                   name:
 *                     type: string
 *                     example: HealthPlus Pharmacy
 *                   address:
 *                     type: string
 *                     example: Osu, Accra
 *                   phone:
 *                     type: string
 *                     example: "+233 555 123 456"
 *                   email:
 *                     type: string
 *                     example: contact@healthplus.com
 *                   website:
 *                     type: string
 *                     example: "https://healthplus.com"
 */
router.get("/pharmacy", getPharmacies);

/**
 * @swagger
 * /api/v1/pharmacy/{id}:
 *   get:
 *     summary: Get a pharmacy by ID
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pharmacy ID
 *     responses:
 *       200:
 *         description: Pharmacy details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 672fba459fa93893b52e8b7c
 *                 name:
 *                   type: string
 *                   example: HealthPlus Pharmacy
 *                 address:
 *                   type: string
 *                   example: Osu, Accra
 *                 phone:
 *                   type: string
 *                   example: "+233 555 123 456"
 *                 email:
 *                   type: string
 *                   example: contact@healthplus.com
 *                 website:
 *                   type: string
 *                   example: "https://healthplus.com"
 *       404:
 *         description: Pharmacy not found
 */
router.get("/pharmacy/:id", getPharmacyById);

/**
 * @swagger
 * /api/v1/pharmacy/{id}:
 *   put:
 *     summary: Update a pharmacy by ID
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pharmacy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *             example:
 *               name: NewLife Pharmacy
 *               address: East Legon, Accra
 *               phone: "+233 244 567 890"
 *               email: info@newlife.com
 *               website: "https://newlife.com"
 *     responses:
 *       200:
 *         description: Pharmacy updated successfully
 *       404:
 *         description: Pharmacy not found
 */
router.put("/pharmacy/:id", updatePharmacy);

/**
 * @swagger
 * /api/v1/pharmacy/{id}:
 *   delete:
 *     summary: Delete a pharmacy by ID
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pharmacy ID
 *     responses:
 *       200:
 *         description: Pharmacy deleted successfully
 *       404:
 *         description: Pharmacy not found
 */
router.delete("/pharmacy/:id", deletePharmacy);

export default router;
