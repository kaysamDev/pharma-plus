import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserProfile,
} from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/users", createUser);
router.post("/login", loginUser);
router.get("/users", getUsers);
router.get("/profile", verifyToken, getUserProfile);

export default router;
