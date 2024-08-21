import { Router } from "express";
import {
  createPharmacy,
  getPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
} from "../controllers/pharmacyController";

const router = Router();

// Route to create a new pharmacy
router.post("/pharmacy", createPharmacy);

// Route to get all pharmacies
router.get("/pharmacy", getPharmacies);

// Route to get a specific pharmacy by ID
router.get("/pharmacy/:id", getPharmacyById);

// Route to update a specific pharmacy by ID
router.put("/pharmacy/:id", updatePharmacy);

// Route to delete a specific pharmacy by ID
router.delete("/pharmacy/:id", deletePharmacy);

export default router;