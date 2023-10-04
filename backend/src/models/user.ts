import mongoose from 'mongoose';

export type User = {
    name: string;
    email: string;
    password: string;
    createdAt: string;
    lastLogin: string;
    status: 'online' | 'offline' | 'blocked';
};

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
    },
    createdAt: {
        type: String,
        immutable: true,
        required: true,
        // default: () => new Date().toISOString(),
    },
    lastLogin: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'blocked'],
        required: true,
    },
});

export const User = mongoose.model('User', userSchema);
