import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setUser,
  setIsAuthenticated,
  setLoading,
  clearUser,
} from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/auth`,
    credentials: "include",
  }),
  tagTypes: ["User", "AdminUsers", "AdminUser"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "me",
        params: { t: Date.now() },
      }),
      transformResponse: (response) => {
        if (response.success) {
          const user = response.user || response.data;
          if (user) {
            return {
              id: user._id || "", // Handle backend _id
              name: user.name,
              email: user.email,
              phone: user.phone || "",
            };
          }
        }
        throw new Error(response.error || "Failed to fetch user data");
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUser({
              id: data.id || "",
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
            })
          );
          dispatch(setIsAuthenticated(true));
        } catch (error) {
          console.error("getMe error:", error);
          if (error.status === 401 || error.status === 403) {
            dispatch(clearUser());
            dispatch(setIsAuthenticated(false));
          }
        } finally {
          dispatch(setLoading(false));
        }
      },
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: ({ id, body }) => ({
        url: `user/${id}`,
        method: "PUT",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response) => {
        if (response.success) {
          const user = response.data;
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || "",
            };
          }
        }
        throw new Error(response.message || "Failed to update profile");
      },
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || "Failed to update profile",
        };
      },
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setUser({
              id: data.id,
              name: data.name,
              email: data.email,
              phone: data.phone || "",
            })
          );
        } catch (error) {
          console.error("updateProfile error:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation({
      query(body) {
        return {
          url: "update/avatar",
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: "password/update",
          method: "PUT",
          body,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ token, body }) => ({
        url: `password/reset/${token}`,
        method: "PUT",
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: "password/forgot",
          method: "POST",
          body,
        };
      },
    }),
    getAdminUsers: builder.query({
      query: () => "users",
      transformResponse: (response) => {
        if (response.success) {
          const users = response.user || response.data;
          if (users) return users;
        }
        throw new Error(response.error || "Failed to fetch admin users");
      },
      providesTags: ["AdminUsers"],
    }),
    getUserDetails: builder.query({
      query: (id) => `users/${id}`,
      transformResponse: (response) => {
        if (response.success) {
          const user = response.user || response.data;
          if (user) return user;
        }
        throw new Error(response.error || "Failed to fetch user details");
      },
      providesTags: ["AdminUser"],
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    deleteUser: builder.mutation({
      query(id) {
        return {
          url: `users/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetAdminUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
