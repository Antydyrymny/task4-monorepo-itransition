import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import establishConnection from '../database/establishConnection';
import { User } from '../models/user';

dotenv.config();

type LoginRequest = {
    email: string;
    password: string;
};

type UserResponse = {
    user: User;
    token: string;
};

const router = express.Router();
router.post('/', async (req, res) => {
    const [connect, disconnect] = establishConnection();
    const { email, password }: LoginRequest = req.body;
    try {
        await connect();
        const userWithEmail = await User.findOne({ email });
        if (!userWithEmail || userWithEmail.password !== password) {
            res.status(401).json('Email or password does not match');
            return;
        }
        const jwtToken = jwt.sign(
            {
                id: userWithEmail._id,
            },
            process.env.JWT_SECRET
        );
        const response: UserResponse = {
            user: userWithEmail,
            token: jwtToken,
        };
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});
