import express from "express";
import {
  createUser,
  loginUser,
  getUsers,
  verifyToken,
} from "../controllers/userController";

const router = express.Router();

router.post("/user", createUser);
router.post("/login", loginUser);
router.get("/user", verifyToken, getUsers);

export default router;
