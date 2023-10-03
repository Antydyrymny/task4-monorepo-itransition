import mongoose from 'mongoose';

export type User = {
    id: string;
    name: string;
    email: string;
    registrationDate: string;
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
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: String,
        required: true,
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
