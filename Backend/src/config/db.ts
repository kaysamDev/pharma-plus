import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
        dbName: 'pharmaplus'
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
};

export default connectDB;