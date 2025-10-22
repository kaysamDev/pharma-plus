// src/routes/userRoutes.ts
import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserProfile,
} from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Samuel Boafo
 *               email:
 *                 type: string
 *                 example: samuel@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/users", createUser);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: samuel@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
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
 *                     example: Samuel Boafo
 *                   email:
 *                     type: string
 *                     example: samuel@example.com
 */
router.get("/users", getUsers);

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Get the authenticated user’s profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   example: Samuel Boafo
 *                 email:
 *                   type: string
 *                   example: samuel@example.com
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
router.get("/profile", verifyToken, getUserProfile);

export default router;
