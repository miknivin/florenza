// pages/api/orders/[orderId]/cancel.js

import mongoose from "mongoose";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import { isAuthenticatedUser } from "@/middlewares/auth";
import { cancelDelhiveryShipment } from "@/utils/cancelDelhiveryShipment";

const DELHIVERY_API_TOKEN = process.env.DELHIVERY_API_TOKEN;

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

    // Authorization: only owner or admin
    const isOwner = order.user.toString() === user._id.toString();
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to cancel this order",
      });
    }

    // === SERVER-SIDE CANCELLATION ELIGIBILITY CHECK ===
    const terminalStatuses = [
      "Cancelled",
      "Refunded",
      "Delivered",
      "Returned",
      "Return Requested",
      "Return Approved",
      "Return Rejected",
    ];

    if (terminalStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        error: `Order cannot be cancelled. Current status: ${order.orderStatus}`,
      });
    }

    // Special rule for Shipped orders
    if (order.orderStatus === "Shipped") {
      if (!order.waybill) {
        return res.status(400).json({
          success: false,
          error: "Cannot cancel shipped order without waybill",
        });
      }

      const createdAt = new Date(order.createdAt);
      const now = new Date();
      const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
      if (hoursDiff > 24) {
        return res.status(400).json({
          success: false,
          error: "Cannot cancel shipped order after 24 hours from placement",
        });
      }
    }

    // Get optional reason
    const { reason } = body;

    // === MANDATORY DELHIVERY CANCELLATION IF WAYBILL EXISTS ===
    if (order.waybill) {
      if (!DELHIVERY_API_TOKEN) {
        return res.status(500).json({
          success: false,
          error: "Delhivery API token not configured. Contact support.",
        });
      }

      try {
        await cancelDelhiveryShipment(DELHIVERY_API_TOKEN, order.waybill);
        console.log(
          `Delhivery shipment ${order.waybill} cancelled successfully`
        );
      } catch (delhiveryError) {
        console.error(
          `Delhivery cancellation failed for waybill ${order.waybill}:`,
          delhiveryError.message
        );

        return res.status(400).json({
          success: false,
          error:
            "Cannot cancel order: Failed to cancel shipment with courier. Please contact support.",
          delhiveryError: delhiveryError.message,
        });
      }
    }

    // === Proceed with DB update only if Delhivery succeeded (or no waybill) ===
    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();

    if (reason && typeof reason === "string" && reason.trim()) {
      order.cancelOrReturnReason = reason.trim();
    }

    // Add tracking entry
    order.orderTracking.push({
      Status: "Order Cancelled",
      StatusDateTime: new Date(),
      StatusType: "Cancellation",
      StatusLocation: "N/A",
      Instructions: reason
        ? `Reason: ${reason.trim()} ${
            order.waybill
              ? `(Delhivery waybill: ${order.waybill} cancelled)`
              : ""
          }`
        : "Cancelled by customer",
    });

    // Optional: Clear waybill after successful cancellation
    // order.waybill = null;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order and shipment cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while cancelling order",
    });
  }
}
