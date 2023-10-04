import express from 'express';
import establishConnection from '../database/establishConnection';
import { User } from '../models/user';

const router = express.Router();
router.get('/', async (req, res) => {
    const [connect, disconnect] = establishConnection();
    try {
        await connect();
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;