import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.MONGODB_URL;

// type DBRequestFunction = (
//     Model: mongoose.Model<unknown>,
//     data?: unknown
// ) => Promise<void>;

export default async function establishConnection(
    functionsArray,
    cleanupFunctionsArray,
    independentFunctions = true
) {
    try {
        await mongoose.connect(connectionString, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
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
