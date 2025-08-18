import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  isAuthenticated: false,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = {
        id: action.payload.id,
        name: action.payload.name || "",
        email: action.payload.email || "",
        phone: action.payload.phone || "",
      };
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.token = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setToken, setIsAuthenticated, setLoading, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
