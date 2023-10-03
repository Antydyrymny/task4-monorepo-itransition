import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import apiSlice, { User } from '../../app/services/api';

type AuthState = {
    user: User | null;
    token: string | null;
};

const initialState: AuthState = { user: null, token: null };

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        removeCredentials: (state) => {
            state.user = null;
            state.token = null;
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
                }
            )
            .addMatcher(
                apiSlice.endpoints.deleteUsers.matchFulfilled,
                (state, action) => {
                    if (
                        action.meta.arg.originalArgs.find(
                            (user) => user.id === state.user?.id
                        )
                    ) {
                        state.user = null;
                        state.token = null;
                    }
                }
            )
            .addMatcher(apiSlice.endpoints.blockUsers.matchFulfilled, (state, action) => {
                if (action.payload.find((user) => user.id === state.user?.id)) {
                    state.user = null;
                    state.token = null;
                }
            });
    },
});

export default slice.reducer;

export const { removeCredentials } = slice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
