import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export type User = {
    _id: string;
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

const serverURL = import.meta.env.VITE_SERVER_URL;

const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: serverURL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        login: builder.mutation<UserResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<UserResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logOut: builder.mutation<string, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            providesTags: ['Users'],
        }),
        blockUsers: builder.mutation<User[], string[]>({
            query: (blockedUsers) => ({
                url: '/blockUsers',
                method: 'PATCH',
                body: blockedUsers,
            }),
            invalidatesTags: ['Users'],
            // async onQueryStarted(_blockedUsers, { dispatch, queryFulfilled }) {
            //     try {
            //         const { data: updatedUsers } = await queryFulfilled;
            //         dispatch(
            //             apiSlice.util.updateQueryData(
            //                 'getUsers',
            //                 undefined,
            //                 (oldState) => {
            //                     return oldState.map(
            //                         (user) =>
            //                             updatedUsers.find(
            //                                 (updatedUser) => updatedUser.id === user.id
            //                             ) as User
            //                     );
            //                 }
            //             )
            //         );
            //     } catch {
            //         /* empty */
            //     }
            // },
        }),
        deleteUsers: builder.mutation<string, string[]>({
            query: (blockedUsers) => ({
                url: '/deleteUsers',
                method: 'DELETE',
                body: blockedUsers,
            }),
            invalidatesTags: ['Users'],
            // async onQueryStarted(deletedUsers, { dispatch, queryFulfilled }) {
            //     try {
            //         await queryFulfilled;
            //         dispatch(
            //             apiSlice.util.updateQueryData(
            //                 'getUsers',
            //                 undefined,
            //                 (oldState) => {
            //                     return oldState.filter(
            //                         (user) =>
            //                             !deletedUsers
            //                                 .map((deletedUser) => deletedUser.id)
            //                                 .includes(user.id)
            //                     );
            //                 }
            //             )
            //         );
            //     } catch {
            //         /* empty */
            //     }
            // },
        }),
    }),
});

export default apiSlice;

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogOutMutation,
    useGetUsersQuery,
    useBlockUsersMutation,
    useDeleteUsersMutation,
} = apiSlice;
