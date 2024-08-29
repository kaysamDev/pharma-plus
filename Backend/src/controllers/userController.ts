import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const SALT_ROUNDS = 10;

// Create a new User account
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password,profile_url, role } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      name,
      email,
      profile_url,
      password: hashedPassword,
      role: role || "user",
    });
    const savedUser = await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
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
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Failed to login user" });
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

// Controller to get the logged-in user's profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;  // Extract user ID from the request object
    const user = await User.findById(userId).select("-password");  // Find user by ID and exclude the password field

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};