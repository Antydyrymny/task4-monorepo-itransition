import express from 'express';
import getUsers from './getUsers';

const router = express.Router();

// router.use('/login', getUsers);
// router.use('/register', getUsers);
// router.use('/logout', getUsers);
router.use('/users', getUsers);
// router.use('/blockUsers', getUsers);
// router.use('/deleteUsers', getUsers);

export default router;
