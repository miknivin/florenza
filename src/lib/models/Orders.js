import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      fullName: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: true,
      },
      phoneNo: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "India",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        sku: {
          type: String,
          required: false,
        },
        quantity: {
          type: Number,
          required: true,
        },
        variant: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: [true, "Please select payment method"],
      enum: {
        values: ["COD", "Online"],
        message: "Please select COD or Online Payments",
      },
    },
    paymentInfo: {
      id: String,
      status: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    shippingAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    couponApplied: {
      type: String,
      required: false,
      default: "No",
    },
     couponAppliedRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    orderStatus: {
      type: String,
      default: "Processing",
      enum: {
        values: [
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Return Requested",
          "Return Approved",
          "Return Rejected",
          "Returned",
          "Refunded",
        ],
        message: "Please select valid order status",
      },
    },
    delhiveryCurrentOrderStatus: { type: String, required: false },
    // Optional: Reason for cancellation or return
    cancelOrReturnReason: {
      type: String,
      required: false,
    },

    // Date when order was cancelled
    cancelledAt: {
      type: Date,
      required: false,
    },

    // Date when return was requested
    returnRequestedAt: {
      type: Date,
      required: false,
    },

    // Date when return was processed/completed
    returnedAt: {
      type: Date,
      required: false,
    },

    // Date when refund was processed (for Online payments)
    refundedAt: {
      type: Date,
      required: false,
    },

    // Refund amount (in case of partial refund)
    refundAmount: {
      type: Number,
      required: false,
    },

    // Refund transaction ID (from payment gateway)
    refundInfo: {
      id: String,
      status: String,
    },
    orderNotes: {
      type: String,
      required: false,
    },
    waybill: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    invoiceURL: {
      type: String,
      required: false,
    },
    orderTracking: [
      {
        Status: {
          type: String,
          required: false,
        },
        StatusDateTime: {
          type: Date,
          required: false,
        },
        StatusType: {
          type: String,
          required: false,
        },
        StatusLocation: {
          type: String,
          required: false,
        },
        Instructions: {
          type: String,
          required: false,
        },
      },
    ],
    deliveredAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
