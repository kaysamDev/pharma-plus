import mongoose, { Schema, Document } from "mongoose";
import { PharmacyProperties, Geometry } from "../global";

export interface IPharmacies extends Document {
  type: "FeatureCollection";
  geometry: Geometry;
  properties: PharmacyProperties;
}

const GeometrySchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const PropertiesSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  Tel: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  services: {
    type: [String],
    required: true,
  },
});

// Define the main schema for Pharmacies
const PharmaciesSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ["Feature"],
    required: true,
  },
  geometry: GeometrySchema,
  properties: PropertiesSchema,
});

// Create the model
const PharmaciesModel = mongoose.model<IPharmacies>(
  "Pharmacies",
  PharmaciesSchema
);

export default PharmaciesModel;
