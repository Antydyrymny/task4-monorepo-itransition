import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { connect, disconnect } from '../database/setupConnection';
import { User, UserType } from '../models/user';

dotenv.config();

type LoginRequest = {
    email: string;
    password: string;
};

export type UserResponse = {
    user: UserType;
    token: string;
};

const router = express.Router();
router.post('/', async (req, res) => {
    const { email, password }: LoginRequest = req.body;
    try {
        await connect();

        const userWithEmail = await User.findOne({ email });
        if (!userWithEmail || userWithEmail.password !== password) {
            res.status(401).json('Email or password does not match');
            return;
        } else if (userWithEmail.status === 'blocked') {
            res.status(403).json('You are blocked! Access forbidden');
            return;
        }

        userWithEmail.lastLogin = new Date().toISOString();
        userWithEmail.status = 'online';
        await userWithEmail.save();

        const jwtToken = jwt.sign(
            {
                _id: userWithEmail._id,
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

export default router;
