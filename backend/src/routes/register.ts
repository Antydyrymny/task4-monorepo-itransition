import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import establishConnection from '../database/establishConnection';
import { User } from '../models/user';
import type { UserResponse } from './login';

dotenv.config();

type RegisterRequest = {
    name: string;
    email: string;
    password: string;
};

const router = express.Router();
router.post('/', async (req, res) => {
    const [connect, disconnect] = establishConnection();
    const { name, email, password }: RegisterRequest = req.body;
    const newUser = new User({
        name,
        email,
        password,
        lastLogin: new Date().toISOString(),
        status: 'online',
    });
    try {
        await connect();
        await newUser.save();

        const jwtToken = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET
        );
        const response: UserResponse = {
            user: newUser,
            token: jwtToken,
        };
        res.status(200).json(response);
    } catch (error) {
        if (error.code === 11000 && error.message.includes('duplicate'))
            res.status(409).json('Email is already in use');
        else res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
