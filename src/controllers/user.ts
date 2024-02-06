import { Request, Response } from "express";
import User from "../model/User";

export const registerController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(404).json({
                error: "User already exists",
                response: null
            });
        }
        const newUser = new User({
            email,
            name,
            password
        })
        await newUser.save()
        const token = await newUser.generateAuthToken();
        res.status(201).json({
            error: null,
            response: {
                user: newUser.toJSON(),
                token
            }
        })
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
            response: null
        })
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.status(200).json({
            error: null,
            response: {
                user: user.toJSON(),
                token
            }
        })
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
            response: null
        })
    }
}