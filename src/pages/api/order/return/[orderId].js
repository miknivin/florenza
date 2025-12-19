
import mongoose from "mongoose";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import { isAuthenticatedUser } from "@/middlewares/auth";

export default async function handler(req, res) {
  const {
    method,
    query: { orderId },
    body,
  } = req;
  Product;
  User;

  await dbConnect();

  if (method !== "PATCH") {
    return res.status(405).json({
      success: false,
      error: `Method ${method} not allowed`,
    });
  }

  try {
    // Validate orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
    }

    // Authenticate user
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Authorization: only the owner can request return
    if (order.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to request return for this order",
      });
    }

    // Check if order is eligible for return
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        success: false,
        error: "Return can only be requested for Delivered orders",
      });
    }

    // Prevent multiple return requests
    const returnInProgressStatuses = [
      "Return Requested",
      "Return Approved",
      "Return Rejected",
      "Returned",
      "Refunded",
    ];
    if (returnInProgressStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        error: `Return already in progress. Current status: ${order.orderStatus}`,
      });
    }

    if (order.deliveredAt) {
      const deliveredDate = new Date(order.deliveredAt);
      const now = new Date();
      const diffDays = (now - deliveredDate) / (1000 * 60 * 60 * 24);
      if (diffDays > 2) { // Adjust this number as per your policy
        return res.status(400).json({
          success: false,
          error: "Return window has expired (only allowed within 2 days of delivery)",
        });
      }
    }

    // Get reason from body (optional but recommended)
    const { reason } = body;

    // Update order for return request
    order.orderStatus = "Return Requested";
    order.returnRequestedAt = new Date();
    if (reason && typeof reason === "string" && reason.trim()) {
      order.cancelOrReturnReason = reason.trim();
    }

    // Add tracking entry
    order.orderTracking.push({
      Status: "Return Requested",
      StatusDateTime: new Date(),
      StatusType: "Return",
      StatusLocation: "N/A",
      Instructions: reason ? `Reason: ${reason.trim()}` : "Return requested by customer",
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Return request submitted successfully. Admin will review it soon.",
      order,
    });
  } catch (error) {
    console.error("Error requesting return:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while processing return request",
    });
  }
}