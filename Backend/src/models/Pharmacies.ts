import mongoose, { Document, Schema, Model } from "mongoose";
import { PharmacyProperties as IPharmacyProperties,  } from "../global";

// Create the pharmacy schema
const pharmacySchema: Schema<IPharmacyProperties> = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String },
    website: { type: String },
    Tel: { type: String },
    city: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, required: true }, // Latitude
    lng: { type: Number, required: true }, // Longitude
    services: [{ type: String }], // Array of services
});

// Create and export the Pharmacies model
const PharmaciesModel: Model<IPharmacyProperties> = mongoose.model<IPharmacyProperties>("Pharmacies", pharmacySchema);
export default PharmaciesModel;
