import mongoose from "mongoose";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { isAuthenticatedUser } from "@/middlewares/auth";

export default async function handler(req, res) {
  const {
    method,
    query: { orderId },
  } = req;
  Product;
  User;
  await dbConnect();

  if (method === "GET") {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid order ID",
        });
      }

      const user = await isAuthenticatedUser(req);

      // 🔴 If no authenticated user
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const order = await Order.findById(orderId)
        .populate("user", "name email")
        .populate("orderItems.product", "name");

      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Order not found",
        });
      }

      return res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: `Method ${method} not allowed`,
  });
}
