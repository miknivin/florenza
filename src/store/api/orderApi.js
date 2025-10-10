import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/`,
    credentials: "include", // Ensures cookies are sent with requests
  }),
  tagTypes: ["Order", "AdminOrders", "UserOrders", "Coupons", "Tracking"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query(body) {
        return {
          url: "/order/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Order", "UserOrders", "AdminOrders"], // New order affects user and admin order lists, and specific order details
    }),
    myOrders: builder.query({
      query: () => `/order/by-user`,
      providesTags: ["UserOrders"], // Cache user-specific orders
    }),
    orderDetails: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }], // Cache specific order by ID
    }),
    razorpayCheckoutSession: builder.mutation({
      query(body) {
        return {
          url: "order/payment/session",
          method: "POST",
          body,
        };
      },
      // No invalidation needed; this creates a session, not an order
    }),
    razorpayWebhook: builder.mutation({
      query(body) {
        return {
          url: "order/payment/webhook",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Order", "UserOrders", "AdminOrders"], // Payment confirmation may update order status
    }),
    getAdminOrders: builder.query({
      query: () => `/admin/orders`,
      providesTags: ["AdminOrders"], // Cache admin order list
    }),
    updateOrder: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/orders/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        "UserOrders",
        "AdminOrders",
        "Tracking", // Order updates (e.g., status) may affect tracking
      ],
    }),
    deleteOrder: builder.mutation({
      query(id) {
        return {
          url: `/admin/orders/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: "Order", id },
        "UserOrders",
        "AdminOrders",
      ],
    }),
    createCoupon: builder.mutation({
      query(body) {
        return {
          url: "/admin/coupon/new",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Coupons"],
    }),
    getCoupons: builder.query({
      query: () => "/admin/coupons",
      providesTags: ["Coupons"],
    }),
    updateCoupon: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/coupon/update/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Coupons"],
    }),
    deleteCoupon: builder.mutation({
      query(id) {
        return {
          url: `/admin/coupon/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Coupons"],
    }),
    checkCoupon: builder.mutation({
      query(body) {
        return {
          url: "/coupon/check",
          method: "POST",
          body,
        };
      },
      // No invalidation needed; this is a read-only check
    }),
    applyCoupon: builder.mutation({
      query(body) {
        return {
          url: "/coupon/apply",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Order", "UserOrders"], // Applying a coupon may update order totals
    }),
    uploadKidsImage: builder.mutation({
      query(body) {
        return {
          url: "/orders/uploadImage",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Order", "UserOrders"], // Image upload may affect order details
    }),
    deleteSessionOrder: builder.mutation({
      query: (sessionOrderId) => ({
        url: `/payments/session/${sessionOrderId}`,
        method: "DELETE",
      }),
      // No invalidation needed; session orders are temporary
    }),
    trackOrder: builder.query({
      query: ({ waybill, refIds }) => ({
        url: "/order/track",
        params: {
          waybill,
          ref_ids: refIds || "ORD1243244",
        },
      }),
      providesTags: (result, error, { waybill }) => [
        { type: "Tracking", id: waybill }, // Cache tracking by waybill
      ],
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useRazorpayCheckoutSessionMutation,
  useRazorpayWebhookMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useGetAdminOrdersQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useCreateCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useCheckCouponMutation,
  useApplyCouponMutation,
  useUploadKidsImageMutation,
  useDeleteSessionOrderMutation,
  useTrackOrderQuery,
} = orderApi;
