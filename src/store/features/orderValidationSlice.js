import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation
const validateOrderData = (orderData, showToast = false) => {
  const errors = {};

  // Validate shippingInfo
  if (!orderData.shippingInfo) {
    errors.shippingInfo = "Shipping information is required";
  } else {
    const { shippingInfo } = orderData;
    if (!shippingInfo.address) {
      errors.address = "Address is required";
    }
    if (!shippingInfo.houseNoBuilding) {
      errors.houseNoBuilding = "House No, Building Name is required"; // Added
    }
    if (!shippingInfo.streetArea) {
      errors.streetArea = "Street Name, Area is required"; // Added
    }
    if (!shippingInfo.city) {
      errors.city = "City is required";
    }
    if (!shippingInfo.state) {
      errors.state = "State is required"; // Added
    }
    if (!shippingInfo.phoneNo) {
      errors.phoneNo = "Phone number is required";
    } else if (!/^[0-9]+$/.test(shippingInfo.phoneNo)) {
      errors.phoneNo = "Please enter a valid phone number";
    }
    if (!shippingInfo.zipCode) {
      errors.zipCode = "Zip code is required";
    }
    if (!shippingInfo.country) {
      errors.country = "Country is required";
    }
    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!shippingInfo.fullName) {
      errors.fullName = "Full name is required";
    }
  }

  // Validate cartItems
  // Validate cartItems
  if (!orderData.cartItems || orderData.cartItems.length === 0) {
    errors.cartItems =
      "Cart is empty. Please add items before placing an order.";
  } else {
    orderData.cartItems.forEach((item, index) => {
      if (!item.id || !mongoose.Types.ObjectId.isValid(item.id)) {
        errors[`cartItems[${index}].id`] = "Valid product ID is required";
      }
      if (!item.name) {
        errors[`cartItems[${index}].name`] = "Item name is required";
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`cartItems[${index}].quantity`] =
          "Item quantity must be greater than 0";
      }
      if (!item.variant) {
        errors[`cartItems[${index}].variant`] = "Item variant is required";
      }
      if (!item.img || !item.img.url) {
        errors[`cartItems[${index}].image`] = "Item image URL is required";
      }
      if (!item.price || item.price <= 0) {
        errors[`cartItems[${index}].price`] =
          "Item price must be greater than 0";
      }
      if (!item.sku) {
        errors[`cartItems[${index}].sku`] = "Item SKU is required";
      }
    });
  }

  // Validate paymentMethod
  if (
    !orderData.paymentMethod ||
    !["COD", "Online"].includes(orderData.paymentMethod)
  ) {
    errors.paymentMethod =
      "Please select a valid payment method (COD or Online)";
  }

  // Validate amounts
  if (!orderData.itemsPrice || orderData.itemsPrice <= 0) {
    errors.itemsPrice = "Items price must be greater than 0";
  }
  if (orderData.taxAmount === undefined) {
    errors.taxAmount = "Tax amount is required";
  }
  if (orderData.shippingAmount === undefined) {
    errors.shippingAmount = "Shipping amount is required";
  }
  if (!orderData.totalAmount || orderData.totalAmount <= 0) {
    errors.totalAmount = "Total amount must be greater than 0";
  }

  if (showToast && Object.keys(errors).length > 0) {
    const errorMessages = Object.values(errors).join(", ");
    toast.error(`Validation failed: ${errorMessages}`, {
      position: "top-center",
      autoClose: 3000,
    });
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const orderValidationSlice = createSlice({
  name: "orderValidation",
  initialState: {
    errors: null,
    isValid: false,
    shippingInfo: {
      email: "",
      country: "",
      fullName: "",
      state: "",
      city: "",
      zipCode: "",
      phoneNo: "",
      houseNoBuilding: "",
      streetArea: "",
      address: "",
      msg: "",
    },
  },
  reducers: {
    validateOrder: (state, action) => {
      const { orderData, showToast = false } = action.payload;
      const errors = validateOrderData(orderData, showToast);
      state.errors = errors;
      state.isValid = !errors;
    },
    updateShippingInfo: (state, action) => {
      const updatedInfo = { ...state.shippingInfo, ...action.payload };
      // Combine houseNoBuilding and streetArea into address
      if (updatedInfo.houseNoBuilding || updatedInfo.streetArea) {
        updatedInfo.address = [
          updatedInfo.houseNoBuilding,
          updatedInfo.streetArea,
        ]
          .filter(Boolean)
          .join(", "); // Added logic to combine fields
      } else {
        updatedInfo.address = "";
      }
      state.shippingInfo = updatedInfo;
    },
    clearErrors: (state) => {
      state.errors = null;
      state.isValid = false;
    },
    clearShippingInfo: (state) => {
      state.shippingInfo = {
        email: "",
        country: "",
        fullName: "",
        state: "",
        city: "",
        zipCode: "",
        phoneNo: "",
        address: "",
        msg: "",
      };
    },
  },
});

export const {
  validateOrder,
  updateShippingInfo,
  clearErrors,
  clearShippingInfo,
} = orderValidationSlice.actions;
export default orderValidationSlice.reducer;
