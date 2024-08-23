import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const SALT_ROUNDS = 10;

// Create a new User account
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({ name, email, password: hashedPassword, role: "user" });
    const savedUser = await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Middleware to verify JWT
export const verifyToken = (req: Request, res: Response, next: Function) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// Get all Users (Protected Route)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

// Function to verify the user's password during login (if needed)
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the hashed password with the input password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Failed to login user" });
  }
};
