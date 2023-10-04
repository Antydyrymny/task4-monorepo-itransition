import mongoose from 'mongoose';

export type User = {
    name: string;
    email: string;
    createdAt: string;
    lastLogin: string;
    status: 'online' | 'offline' | 'blocked';
};

export type UserResponse = {
    user: User;
    token: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
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
    createdAt: {
        type: String,
        immutable: true,
        required: true,
        default: () => new Date().toISOString(),
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
