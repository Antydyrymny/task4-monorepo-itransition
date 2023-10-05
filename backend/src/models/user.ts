import mongoose, { Document } from 'mongoose';

export type UserType = {
    name: string;
    email: string;
    password: string;
    createdAt: string;
    lastLogin: string;
    status: 'online' | 'offline' | 'blocked';
};

export type UserModelType = UserType & Document;

const userSchema = new mongoose.Schema<UserType>({
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

export const User = mongoose.model<UserModelType>('User', userSchema);
