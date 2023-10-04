import express from 'express';
// import passport from 'passport';
// import { connect, disconnect } from '../database/setupConnection';
// import { User } from '../models/user';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.MONGODB_URL;

const router = express.Router();
// router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
router.get('/', async (req, res) => {
    try {
        await mongoose.connect(connectionString);
        mongoose.disconnect();
        // await connect();
        // const users = await User.find({});
        // res.status(200).json(users);
        res.status(200).json('working');
    } catch (error) {
        mongoose.disconnect();
        res.status(500).json({ error });
    } finally {
        // disconnect();
    }
});

export default router;
