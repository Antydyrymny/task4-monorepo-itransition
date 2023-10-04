import express from 'express';
import passport from 'passport';
import establishConnection from '../database/establishConnection';
import { User } from '../models/user';

const router = express.Router();
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const [connect, disconnect] = establishConnection();
    const userIds: string[] = req.body;
    try {
        await connect();
        await User.deleteMany({ _id: { $in: userIds } });

        res.status(200).json('Users deleted successfully');
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
