import { Request, Response } from "express";
import User from "../models/User";

// Create a new User account
export const createUser = async(req:Request, res:Response) => {
    try {
        const {name, email, password} = req.body;
        const newUser = new User({name, email, password, role: 'user'});
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json({error: "Faile to create user"});
    }

}

// Get all Users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({error: "Failed to get users"});
    }
}