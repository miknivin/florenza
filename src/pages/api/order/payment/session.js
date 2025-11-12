import Razorpay from "razorpay";
import mongoose from "mongoose";
import dbConnect from "@/lib/connection/connection";
import SessionStartedOrder from "@/lib/models/SessionStartedOrder";
import { isAuthenticatedUser } from "@/middlewares/auth";
import User from "@/lib/models/User";
import Product from "@/lib/models/Product";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    User;
    Product;
    await dbConnect();

    const user = await isAuthenticatedUser(req);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    const {
      cartItems,
      shippingInfo,
      paymentMethod,
      taxAmount = 0,
      shippingAmount = 0,
    } = req.body;

    // Validate required fields
    if (!cartItems || !shippingInfo || !paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validate cartItems item IDs
    for (const item of cartItems) {
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        return res
          .status(400)
          .json({ success: false, message: `Invalid product ID: ${item.id}` });
      }
    }

    // Calculate itemsPrice
    const itemsPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Calculate totalAmount
    const totalAmount = itemsPrice + taxAmount + shippingAmount;

    // Map cartItems to orderItems
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      sku: item.sku,
      variant: item.variant,
      quantity: item.quantity,
      image: item.img.url,
      price: item.price.toString(),
      product: new mongoose.Types.ObjectId(item.id),
    }));

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: totalAmount * 100, // Use totalAmount instead of itemsPrice
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    const newOrder = new SessionStartedOrder({
      razorpayOrderId: order.id,
      razorpayPaymentStatus: order.status,
      user: user._id,
      orderItems,
      shippingInfo,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      orderId: order.id, // Return Razorpay order ID
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create order" });
  }
}
