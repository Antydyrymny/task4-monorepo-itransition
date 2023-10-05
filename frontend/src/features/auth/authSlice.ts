import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import apiSlice, { User } from '../../app/services/api';

export const authStorageKey = 'LOCAL_STORAGE_AUTH_KEY';

type AuthState = {
    user: User | null;
    token: string | null;
};

export type Authenticated = {
    user: User;
    token: string;
};

const initialState: AuthState = { user: null, token: null };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        storeAuth: (state, action: PayloadAction<Authenticated>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            window.localStorage.removeItem(authStorageKey);
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isAnyOf(
                    apiSlice.endpoints.login.matchFulfilled,
                    apiSlice.endpoints.register.matchFulfilled
                ),
                (state, action) => {
                    state.user = action.payload.user;
                    state.token = action.payload.token;
                    localStorage.setItem(authStorageKey, JSON.stringify(action.payload));
                }
            )
            .addMatcher(
                apiSlice.endpoints.deleteUsers.matchFulfilled,
                (state, action) => {
                    if (
                        action.meta.arg.originalArgs.find((id) => id === state.user?._id)
                    ) {
                        state.user = null;
                        state.token = null;
                        window.localStorage.removeItem(authStorageKey);
                    }
                }
            )
            .addMatcher(apiSlice.endpoints.blockUsers.matchFulfilled, (state, action) => {
                if (action.payload.find((user) => user._id === state.user?._id)) {
                    state.user = null;
                    state.token = null;
                    window.localStorage.removeItem(authStorageKey);
                }
            });
    },
});

export default authSlice.reducer;

export const { storeAuth, clearAuth } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
