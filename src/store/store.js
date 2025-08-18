import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";
import userReducer from "./features/userSlice";
import { authApi } from "./api/authApi";
import { orderApi } from "./api/orderApi";
import { userApi } from "./api/userApi";
import { productApi } from "./api/productApi";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      orderApi.middleware,
      userApi.middleware,
      productApi.middleware
    ),
});
