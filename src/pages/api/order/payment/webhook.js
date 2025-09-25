import crypto from "crypto";
import mongoose from "mongoose";
import { setImmediate } from "timers";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import SessionStartedOrder from "@/lib/models/SessionStartedOrder";
import { isAuthenticatedUser } from "@/middlewares/auth";
import { createDelhiveryShipment } from "@/utils/createDelhiveryShipment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
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

    // Validate required fields
    if (
      !cartItems ||
      !shippingInfo ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
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

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    await dbConnect();

    // Calculate itemsPrice
    const itemsPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Calculate totalAmount
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

    // Create new order
    const order = new Order({
      shippingInfo,
      user: new mongoose.Types.ObjectId(user._id),
      orderItems,
      paymentMethod: "Online",
      paymentInfo: {
        id: razorpay_payment_id,
        status: "Paid",
      },
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      couponApplied,
      orderNotes,
      orderStatus: "Processing",
    });

    // Save order to database
    await order.save();

    // Calculate total weight (assuming ~300g per perfume bottle, including packaging)
    const totalQuantity = orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const weight = totalQuantity * 300; // 300g per bottle, adjust as needed

    // Prepare Delhivery shipment data
    const shipmentData = {
      shipments: [
        {
          name: shippingInfo.fullName || "Customer",
          add: shippingInfo.address,
          pin: shippingInfo.zipCode,
          city: shippingInfo.city,
          state: shippingInfo.state || "Unknown",
          country: shippingInfo.country || "India",
          phone: shippingInfo.phoneNo,
          order: order._id.toString(),
          payment_mode: "Prepaid", // Razorpay orders are always prepaid
          return_pin: "678583", // Return address same as pickup location
          return_city: "Thachanattukara",
          return_phone: "9778766273",
          return_add:
            "Florenza Italiya Near ABS Traders Kodakkad, Opp: Rifa Medical Center Kodakkad-Palakkad Kozhikode Highway",
          return_state: "Kerala",
          return_country: "India",
          products_desc: orderItems.map((item) => item.name).join(", "), // Combine perfume names
          hsn_code: "3303", // HSN code for perfumes
          cod_amount: "0", // Razorpay orders are prepaid
          order_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
          total_amount: totalAmount.toString(),
          seller_add:
            "Florenza Italiya Near ABS Traders Kodakkad, Opp: Rifa Medical Center Kodakkad-Palakkad Kozhikode Highway", // Adjust based on your business
          seller_name: "Florenza Italiya", // Updated for perfume e-commerce
          seller_inv: `INV${order._id.toString()}`, // Unique invoice based on order ID
          quantity: totalQuantity.toString(),
          waybill: "", // Delhivery will assign
          shipment_width: "100", // 10 cm, typical for a small perfume box
          shipment_height: "150", // 15 cm, typical for a small perfume box
          weight: weight.toString(), // Total weight in grams
          shipping_mode: "Surface", // Default as per sample
          address_type: "home", // Default as per sample
        },
      ],
      pickup_location: {
        name: "Florenza Italiya",
        add: "Florenza Italiya Near ABS Traders Kodakkad, Opp: Rifa Medical Center Kodakkad-Palakkad Kozhikode Highway",
        pin: "678583",
        city: "Thachanattukara",
        state: "Kerala",
        country: "India",
        phone: "9778766273",
      },
    };

    // Non-blocking deletion of SessionStartedOrder and Delhivery shipment creation
    setImmediate(async () => {
      try {
        // Delete SessionStartedOrder
        await SessionStartedOrder.deleteOne({
          razorpayOrderId: razorpay_order_id,
        });

        // Create Delhivery shipment
        const delhiveryToken = process.env.DELHIVERY_API_TOKEN; // Ensure this is set in your environment variables
        if (!delhiveryToken) {
          throw new Error("Delhivery API token not configured");
        }

        const shipmentResponse = await createDelhiveryShipment(
          delhiveryToken,
          shipmentData
        );

        // Update order with shipment details
        if (
          shipmentResponse.success &&
          shipmentResponse.packages?.[0]?.waybill
        ) {
          order.waybill = shipmentResponse.packages[0].waybill; 
          await order.save();
        }
      } catch (error) {
        console.error("Error in post-order processing:", error);
      }
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create order" });
  }
}
