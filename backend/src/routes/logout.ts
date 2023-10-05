import express from 'express';
import passport from 'passport';
import { disconnect } from '../database/setupConnection';
import { UserModelType } from '../models/user';

const router = express.Router();
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const userToLogout = req.user as UserModelType;
        userToLogout.status = 'offline';
        await userToLogout.save();

        res.status(200).json('Loged out');
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
