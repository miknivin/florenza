// pages/api/orders/[orderId]/cancel.js

import mongoose from "mongoose";
import Razorpay from "razorpay"; // npm install razorpay
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import { isAuthenticatedUser } from "@/middlewares/auth";

// Initialize Razorpay instance (use environment variables!)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

export default async function handler(req, res) {
  const {
    method,
    query: { orderId },
    body,
  } = req;

  await dbConnect();

  if (method !== "PATCH") {
    return res.status(405).json({
      success: false,
      error: `Method ${method} not allowed`,
    });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order ID",
      });
    }

    const user = await isAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Authorization
    const isOwner = order.user.toString() === user._id.toString();
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to cancel this order",
      });
    }

    // Prevent cancellation in invalid states
    const nonCancellableStatuses = [
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
      "Return Requested",
      "Return Approved",
    ];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        error: `Order cannot be cancelled. Current status: ${order.orderStatus}`,
      });
    }

    const { reason } = body;

    // === REFUND LOGIC ONLY FOR ONLINE PAYMENTS ===
    let refundData = null;

    if (order.paymentMethod === "Online" && order.paymentInfo?.id) {
      try {
        // Create refund in Razorpay
        const refund = await razorpay.payments.refund(order.paymentInfo.id, {
          amount: order.totalAmount * 100, // amount in paise
          speed: "optimum", // or "normal"
          notes: {
            reason: reason || "Order cancelled by customer",
            cancelled_by: isAdmin ? "admin" : "customer",
          },
        });

        refundData = {
          id: refund.id,
          status: refund.status, // usually "processed"
          amount: refund.amount / 100, // convert back to rupees
          createdAt: new Date(refund.created_at * 1000),
        };

        // Update order with refund info
        order.refundInfo = {
          id: refund.id,
          status: refund.status,
        };
        order.refundAmount = order.totalAmount; // full refund
        order.refundedAt = new Date();
        order.orderStatus = "Refunded"; // change status to Refunded instead of just Cancelled
      } catch (refundError) {
        console.error("Refund failed:", refundError);

        return res.status(500).json({
          success: false,
          error: "Payment refund failed. Please contact support.",
        });
      }
    } else {
      // For COD or no paymentInfo → just cancel
      order.orderStatus = "Cancelled";
    }

    // Common updates
    order.cancelledAt = new Date();
    if (reason && typeof reason === "string" && reason.trim()) {
      order.cancelOrReturnReason = reason.trim();
    }

    // Add tracking
    const statusText =
      order.paymentMethod === "Online" ? "Refunded" : "Cancelled";
    order.orderTracking.push({
      Status: `Order ${statusText}`,
      StatusDateTime: new Date(),
      StatusType: "Cancellation",
      StatusLocation: "N/A",
      Instructions: reason
        ? `Reason: ${reason.trim()} | Payment: ${order.paymentMethod}`
        : `Cancelled by ${isAdmin ? "admin" : "customer"}`,
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        order.paymentMethod === "Online"
          ? "Order cancelled and refund initiated successfully"
          : "Order cancelled successfully",
      order,
      refund: refundData, // optional: send refund details to frontend
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while cancelling order",
    });
  }
}
