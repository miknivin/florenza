import mongoose from "mongoose";

import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";

export default async function handler(req, res) {
  const {
    method,
    query: { orderId },
  } = req;

  // Ensure database connection
  await dbConnect();

  if (method === "GET") {
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid order ID" });
      }

      // Find order by ID and populate necessary fields
      const order = await Order.findById(orderId)
        .populate("user", "name email") // Populate user details if needed
        .populate("orderItems.product", "name"); // Populate product details if needed

      if (!order) {
        return res
          .status(404)
          .json({ success: false, error: "Order not found" });
      }

      return res.status(200).json({ success: true, order });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ success: false, error: "Server error" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, error: `Method ${method} not allowed` });
  }
}
