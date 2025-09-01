import mongoose from "mongoose";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import { isAuthenticatedUser } from "@/middlewares/auth";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();
    Product;
    User;
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }
    const userId = user?._id;
    // Validate userId
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing userId" });
    }

    // Fetch orders for the user, populating user and product fields
    const orders = await Order.find({ user: userId })
      .populate("user", "name email") // Populate user fields (adjust fields as needed)
      .populate("orderItems.product", "name price") // Populate product fields (adjust fields as needed)
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    // Check if orders exist
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found for this user" });
    }

    // Return the orders
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}
