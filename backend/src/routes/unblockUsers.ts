import express from 'express';
import passport from 'passport';
import { disconnect } from '../database/setupConnection';
import { User } from '../models/user';

const router = express.Router();
router.patch('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const userIds: string[] = req.body;
    try {
        const usersToUnblock = await User.find({ _id: { $in: userIds } });
        usersToUnblock.forEach((user) => (user.status = 'offline'));
        await Promise.all(usersToUnblock.map((user) => user.save()));

        res.status(200).json(usersToUnblock);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
