import { Request, Response } from "express";
import PharmaciesModel from "../models/Pharmacies";

// Create a new pharmacy
export const createPharmacy = async (req: Request, res: Response) => {
  try {
    const newPharmacy = new PharmaciesModel(req.body);
    const savedPharmacy = await newPharmacy.save();
    res.status(201).json(savedPharmacy);
  } catch (error) {
    res.status(500).json({ message: "Error creating pharmacy", error });
  }
};

// Get all pharmacies
export const getPharmacies = async (req: Request, res: Response) => {
  try {
    const pharmacies = await PharmaciesModel.find();
    res.status(200).json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pharmacies", error });
  }
};

// Get a pharmacy by ID
export const getPharmacyById = async (req: Request, res: Response) => {
  try {
    const pharmacy = await PharmaciesModel.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.status(200).json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving pharmacy", error });
  }
};

// Update a pharmacy by ID
export const updatePharmacy = async (req: Request, res: Response) => {
  try {
    const updatedPharmacy = await PharmaciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.status(200).json(updatedPharmacy);
  } catch (error) {
    res.status(500).json({ message: "Error updating pharmacy", error });
  }
};

// Delete a pharmacy by ID
export const deletePharmacy = async (req: Request, res: Response) => {
  try {
    const deletedPharmacy = await PharmaciesModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedPharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.status(200).json({ message: "Pharmacy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pharmacy", error });
  }
};
