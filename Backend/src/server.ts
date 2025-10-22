import dotenv from "dotenv";

dotenv.config();

import express from 'express';
import cors from 'cors'
import userRoutes from "./routes/userRoutes";
import pharmaciesRoutes from "./routes/pharmaciesRoute"
import connectDB from "./config/db";
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


connectDB();

const app = express();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pharma Plus API',
            version: '1.0.0',
            description: 'API documentation for Pharma Plus',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 4000}`,
                description: 'Development server',
            },
        ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", userRoutes);

app.use("/api/v1", pharmaciesRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
})