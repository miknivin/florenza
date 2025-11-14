// pages/api/orders/online.ts
import crypto from "crypto";
import mongoose from "mongoose";
import { setImmediate } from "timers";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import SessionStartedOrder from "@/lib/models/SessionStartedOrder";
import { isAuthenticatedUser } from "@/middlewares/auth";
import { triggerAdminShipment } from "@/utils/triggerAdminShipment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      shippingInfo,
      taxAmount = 0,
      shippingAmount = 0,
      orderNotes,
      couponApplied = "No",
    } = req.body;

    // --- Validation ---
    if (
      !cartItems ||
      !shippingInfo ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    for (const item of cartItems) {
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID: ${item.id}`,
        });
      }
    }

    // --- Razorpay Signature ---
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    await dbConnect();

    // --- Price & Items ---
    const itemsPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalAmount = itemsPrice + taxAmount + shippingAmount;

    const orderItems = cartItems.map((item) => ({
      name: item.name,
      sku: item.sku,
      variant: item.variant,
      quantity: item.quantity,
      image: item.img.url,
      price: item.price.toString(),
      product: new mongoose.Types.ObjectId(item.id),
    }));

    // --- 1. CREATE ORDER (no shipmentData) ---
    const order = new Order({
      shippingInfo,
      user: new mongoose.Types.ObjectId(user._id),
      orderItems,
      paymentMethod: "Online",
      paymentInfo: { id: razorpay_payment_id, status: "Paid" },
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      couponApplied,
      orderNotes,
      orderStatus: "Processing",
    });

    await order.save(); // ← order._id now exists

    setImmediate(() => {
      SessionStartedOrder.deleteOne({ razorpayOrderId: razorpay_order_id }).catch((err) =>
        console.error("Failed to delete SessionStartedOrder:", err)
      );

      // Trigger admin – only orderId
      triggerAdminShipment(order._id.toString());
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error creating online order:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
}