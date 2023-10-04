import express from 'express';
import passport from 'passport';
import { disconnect } from '../database/setupConnection';
import { User } from '../models/user';

const router = express.Router();
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
