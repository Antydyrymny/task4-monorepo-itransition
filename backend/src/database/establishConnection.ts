import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.MONGODB_URL;

export default function establishConnection() {
    return [
        () =>
            mongoose.connect(connectionString, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            } as ConnectOptions),
        mongoose.disconnect,
    ];
}
