import mongoose from "mongoose";
import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import { isAuthenticatedUser } from "@/middlewares/auth";
import { createDelhiveryShipment } from "@/utils/createDelhiveryShipment";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { triggerAdminShipment } from "@/utils/triggerAdminShipment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const user = await isAuthenticatedUser(req);
    Product;
    User;
    await dbConnect();

    const {
      cartItems,
      shippingInfo,
      paymentMethod,
      taxAmount = 0,
      shippingAmount: clientShippingAmount = 0,
    } = req.body;

    if (!paymentMethod || paymentMethod.trim().toUpperCase() !== "COD") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. This route only supports COD.",
      });
    }

    let shippingAmount = clientShippingAmount;

    if (paymentMethod === "COD") {
      if (!shippingAmount || shippingAmount <= 0) {
        shippingAmount = 100;
      }
    }
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

    // Calculate total weight (assuming ~300g per perfume bottle, including packaging)
    const totalQuantity = orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const weight = totalQuantity * 300; // 300g per bottle, adjust as needed

    // Prepare Delhivery shipment data
    // const shipmentData = {
    //   shipments: [
    //     {
    //       name: shippingInfo.fullName || "Customer",
    //       add: shippingInfo.address,
    //       pin: shippingInfo.zipCode,
    //       city: shippingInfo.city,
    //       state: shippingInfo.state || "Unknown",
    //       country: shippingInfo.country || "India",
    //       phone: shippingInfo.phoneNo,
    //       order: order._id.toString(),
    //       payment_mode: paymentMethod === "COD" ? "COD" : "Prepaid",
    //       return_pin: "678583", // Return address same as pickup location
    //       return_city: "Thachanattukara",
    //       return_phone: "9778766273",
    //       return_add:
    //         "Florenza Italiya Near ABS Traders Kodakkad, Opp: Rifa Medical Center Kodakkad-Palakkad Kozhikode Highway",
    //       return_state: "Kerala",
    //       return_country: "India",
    //       products_desc: orderItems.map((item) => item.name).join(", "), // Combine perfume names
    //       hsn_code: "3303", // HSN code for perfumes
    //       cod_amount: paymentMethod === "COD" ? totalAmount.toString() : "0",
    //       order_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD
    //       total_amount: totalAmount.toString(),
    //       seller_add:
    //         "Florenza Italiya Near ABS Traders Kodakkad, Opp: Rifa Medical Center Kodakkad-Palakkad Kozhikode Highway", // Adjust based on your business
    //       seller_name: "Florenza Italiya", // Updated for perfume e-commerce
    //       seller_inv: `INV${order._id.toString()}`, // Unique invoice based on order ID
    //       quantity: totalQuantity.toString(),
    //       waybill: "", // Delhivery will assign
    //       shipment_width: "100", // 10 cm, typical for a small perfume box
    //       shipment_height: "150", // 15 cm, typical for a small perfume box
    //       weight: weight.toString(), // Total weight in grams
    //       shipping_mode: "Surface", // Default as per sample
    //       address_type: "home", // Default as per sample
    //       seller_gst: process.env.GSTNO || "32AAIFO0471H1ZI",
    //     },
    //   ],
    //   pickup_location: {
    //     name: "Florenza Italiya",
    //     add: "Florenza Italiya Near ABS Traders Kodakkad, Opp: Rifa Medical Center Kodakkad-Palakkad Kozhikode Highway",
    //     pin: "678583",
    //     city: "Thachanattukara",
    //     state: "Kerala",
    //     country: "India",
    //     phone: "9778766273",
    //     gst: process.env.GSTNO || "32AAIFO0471H1ZI",
    //   },
    // };
    triggerAdminShipment(order._id.toString());
    // Call Delhivery shipment creation in a non-blocking way
    // setImmediate(async () => {
    //   try {
    //     const delhiveryToken = process.env.DELHIVERY_API_TOKEN; // Ensure this is set in your environment variables
    //     if (!delhiveryToken) {
    //       throw new Error("Delhivery API token not configured");
    //     }

    //     const shipmentResponse = await createDelhiveryShipment(
    //       delhiveryToken,
    //       shipmentData
    //     );

    //     // Update order with shipment details
    //     if (
    //       shipmentResponse.success &&
    //       shipmentResponse.packages?.[0]?.waybill
    //     ) {
    //       order.waybill = shipmentResponse.packages[0].waybill; // Store in the new waybill field
    //       await order.save();
    //     }
    //   } catch (error) {
    //     console.error("Error creating shipment:", error);
    //     // Optionally store error in order (consider adding shipmentInfo field for errors)
    //   }
    // });

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
