import express from 'express';
import passport from 'passport';
import establishConnection from '../database/establishConnection';
import { User } from '../models/user';

const router = express.Router();
router.patch('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const [connect, disconnect] = establishConnection();
    const userIds: string[] = req.body;
    try {
        await connect();
        const usersToBlock = await User.find({ _id: { $in: userIds } });
        usersToBlock.forEach((user) => (user.status = 'blocked'));
        await Promise.all(usersToBlock.map((user) => user.save()));

        res.status(200).json(usersToBlock);
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
