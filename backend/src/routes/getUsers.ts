import express from 'express';
// import passport from 'passport';
import { connect, disconnect } from '../database/setupConnection';
// import { User } from '../models/user';

const router = express.Router();
// router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
router.get('/', async (req, res) => {
    try {
        await connect();
        // const users = await User.find({});
        // res.status(200).json(users);
        res.status(200).json('working');
    } catch (error) {
        res.status(500).json({ error });
    } finally {
        disconnect();
    }
});

export default router;
