import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  singleProduct: null,
  productById: {},
  selectedTemplate: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = [...state.items, ...action.payload];
    },
    resetProducts: (state) => {
      state.items = [];
    },
    setSingleProductForQuickAdd: (state, action) => {
      state.singleProduct = action.payload;
    },
    resetSingleProduct: (state) => {
      state.singleProduct = null;
    },
    setProductById: (state, action) => {
      state.productById = action.payload;
    },
    resetProductById: (state) => {
      state.productById = {};
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    resetSelectedTemplate: (state) => {
      state.selectedTemplate = null;
    },
  },
});

export const {
  setProducts,
  resetProducts,
  setSingleProductForQuickAdd,
  resetSingleProduct,
  setProductById,
  resetProductById,
  setSelectedTemplate,
  resetSelectedTemplate,
} = productsSlice.actions;

export default productsSlice.reducer;
