// /pages/api/user/[id].js
import mongoose from "mongoose";
import dbConnect from "@/lib/connection/connection";

import { isAuthenticatedUser } from "@/middlewares/auth";
import User from "@/lib/models/User";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // Authenticate user
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get user ID from URL params
    const { id } = req.query;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    // Ensure the user is updating their own profile
    if (id !== user._id.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: You can only update your own profile",
        });
    }

    await dbConnect();

    const { name, email, phone } = req.body;

    // Prepare update data
    const updateData = {
      name: name?.trim(),
      email: email?.trim() || undefined, // Set to undefined if empty to respect sparse index
      phone: phone?.trim() || undefined, // Set to undefined if empty to respect sparse index
    };

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: "-resetPasswordToken -resetPasswordExpire",
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        signupMethod: updatedUser.signupMethod,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === 11000) {
      // Handle duplicate key error (e.g., email or phone already exists)
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
