import express from 'express';
// // import passport from 'passport';
// // import { connect, disconnect } from '../database/setupConnection';
// // import { User } from '../models/user';
// import mongoose, { ConnectOptions } from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();
// const connectionString = process.env.MONGODB_URL;

// const router = express.Router();
// // router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
// router.get('/', async (req, res) => {
//     try {
//         await mongoose.connect(connectionString, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         } as ConnectOptions);
//         // await connect();
//         // const users = await User.find({});
//         // res.status(200).json(users);
//         res.status(200).json('working');
//     } catch (error) {
//         res.status(500).json({ error });
//     } finally {
//         // disconnect();
//         mongoose.disconnect();
//     }
// });

// export default router;

import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGODB_URL;

export async function establishConnection(
    functionsArray,
    cleanupFunctionsArray?,
    independentFunctions = true
) {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        let results;
        if (independentFunctions) {
            results = await Promise.all(functionsArray.map((fn) => fn()));
        } else {
            results = await functionsArray.reduce(
                (promiseChain, fn) =>
                    promiseChain.then((resultsArr) =>
                        fn().then((res) => resultsArr.concat(res))
                    ),
                Promise.resolve([])
            );
        }
        console.log('Operations successful!');
        return results;
    } catch (error) {
        if (cleanupFunctionsArray) {
            console.log('Performing cleanup operations');
            await Promise.allSettled(cleanupFunctionsArray.map((fn) => fn()));
            console.log('Cleanup successful');
        }
        console.error('Error while establishing connection:', error);
        throw new Error(error);
    } finally {
        mongoose.disconnect();
    }
}

const router = express.Router();
// router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
router.get('/', async (req, res) => {
    try {
        await establishConnection([async () => Promise.resolve(1)]);
        // await connect();
        // const users = await User.find({});
        // res.status(200).json(users);
        res.status(200).json('working');
    } catch (error) {
        res.status(500).json({ error });
    }
});

export default router;
