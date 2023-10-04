import express from 'express';
import passport from 'passport';
import establishConnection from '../database/establishConnection';
import { User } from '../models/user';

const router = express.Router();
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const [connect, disconnect] = establishConnection();
    const _id: string = req.body;
    try {
        await connect();
        const userToLogout = await User.findOne({ _id });
        if (!userToLogout) {
            res.status(404).json('User not found');
            return;
        }

        userToLogout.status = 'offline';
        userToLogout.save();

        res.status(200).json('Loged out');
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
