import mongoose from "mongoose";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import { isAuthenticatedUser } from "@/middlewares/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const user = await isAuthenticatedUser(req);

    await dbConnect();

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

    // Calculate totalAmount using provided or default taxAmount and shippingAmount
    const totalAmount = itemsPrice + taxAmount + shippingAmount;

    // Map cartItems to orderItems
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      sku: item.sku,
      variant: item.variant,
      quantity: item.quantity,
      image: item.img.url,
      price: item.price.toString(),
      product: new mongoose.Types.ObjectId(item.id), // Safe: item.id is a valid ObjectId string
    }));

    // Create new order
    const order = new Order({
      shippingInfo,
      user: new mongoose.Types.ObjectId(user._id),
      orderItems,
      paymentMethod,
      paymentInfo: {
        id: "",
        status: "Pending",
      },
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      orderStatus: "Processing",
    });

    // Save order to database
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(401)
      .json({ success: false, message: error.message || "Server error" });
  }
}
