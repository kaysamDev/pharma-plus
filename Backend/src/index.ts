import express from 'express';
import cors from 'cors'
import connectDB from './config/db';
import userRoutes from "./routes/userRoutes";

const app = express();

// Connect to MongoDB
connectDB();

// Middleware

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})