import express from 'express';
import login from './login';
import register from './register';
import logout from './logout';
import getUsers from './getUsers';
import blockUsers from './blockUsers';

const router = express.Router();

router.use('/login', login);
router.use('/register', register);
router.use('/logout', logout);
router.use('/users', getUsers);
router.use('/blockUsers', blockUsers);
// router.use('/deleteUsers', getUsers);

export default router;
