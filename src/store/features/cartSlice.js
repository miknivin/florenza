import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return undefined;
    }
    const persistedState = JSON.parse(serializedState);
    // Recalculate totalCost to ensure consistency
    const totalCost = persistedState.cartData.reduce(
      (total, i) => total + i.price * i.quantity,
      0
    );
    return { ...persistedState, totalCost };
  } catch (e) {
    console.warn("Could not load cart from localStorage", e);
    return undefined;
  }
};

const loadWishlistFromLocalStorage = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const serializedState = localStorage.getItem("wishlist");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Could not load wishlist from localStorage", e);
    return undefined;
  }
};

const saveCartToLocalStorage = (state) => {
  if (typeof window === "undefined") return undefined;
  try {
    const cartState = {
      cartData: state.cartData,
      totalCost: state.totalCost,
      orderProduct: state.orderProduct,
    };
    const serializedState = JSON.stringify(cartState);
    localStorage.setItem("cart", serializedState);
  } catch (e) {
    console.warn("Could not save cart to localStorage", e);
  }
};

const saveWishlistToLocalStorage = (state) => {
  if (typeof window === "undefined") return undefined;
  try {
    const wishlistState = {
      allWishList: state.allWishList,
      activeWishList: state.activeWishList,
    };
    const serializedState = JSON.stringify(wishlistState);
    localStorage.setItem("wishlist", serializedState);
  } catch (e) {
    console.warn("Could not save wishlist to localStorage", e);
  }
};

const initialCartState = loadCartFromLocalStorage() || {
  cartData: [], // Array of cart items, e.g., [{ id, name, price, quantity, img, sku, variant }]
  totalCost: 0, // Total cost of items in cart
  orderProduct: [], // Array of ordered products
};

const initialWishlistState = loadWishlistFromLocalStorage() || {
  allWishList: [], // Array of all wishlist items
  activeWishList: [], // Array of active wishlist items
};

const initialState = {
  ...initialCartState,
  ...initialWishlistState,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart or update quantity if item exists
    addToCart(state, action) {
      const item = action.payload; // Expecting { id, name, price, quantity, img, sku, variant }
      const existingItem = state.cartData.find(
        (i) => i.id === item.id && i.variant === item.variant
      );
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.cartData.push({ ...item, quantity: item.quantity || 1 });
      }
      state.totalCost = state.cartData.reduce(
        (total, i) => total + i.price * i.quantity,
        0
      );
      saveCartToLocalStorage(state);
    },
    // Remove item from cart by id and variant
    removeFromCart(state, action) {
      const { id, variant } = action.payload;
      console.log(id);

      state.cartData = state.cartData.filter(
        (item) => !(item.id === id && item.variant === variant)
      );
      state.totalCost = state.cartData.reduce(
        (total, i) => total + i.price * i.quantity,
        0
      );
      saveCartToLocalStorage(state);
    },
    // Update quantity of an item in cart
    updateQuantity(state, action) {
      const { id, variant, quantity } = action.payload;
      const item = state.cartData.find(
        (i) => i.id === id && i.variant === variant
      );
      if (item && quantity > 0) {
        item.quantity = quantity;
        state.totalCost = state.cartData.reduce(
          (total, i) => total + i.price * i.quantity,
          0
        );
      }
      saveCartToLocalStorage(state);
    },
    // Clear the entire cart
    clearCart(state) {
      state.cartData = [];
      state.totalCost = 0;
      saveCartToLocalStorage(state);
    },
    // Set order products
    setOrderProduct(state, action) {
      state.orderProduct = action.payload;
      saveCartToLocalStorage(state);
    },
    // Set all wishlist items
    setAllWishList(state, action) {
      state.allWishList = action.payload;
      saveWishlistToLocalStorage(state);
    },
    // Set active wishlist items
    setActiveWishList(state, action) {
      state.activeWishList = action.payload;
      saveWishlistToLocalStorage(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setOrderProduct,
  setAllWishList,
  setActiveWishList,
} = cartSlice.actions;
export default cartSlice.reducer;
