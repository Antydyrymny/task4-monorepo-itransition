import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.MONGODB_URL;

export const connect = async () =>
    mongoose.connect(connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    } as ConnectOptions);

export const disconnect = mongoose.disconnect;
