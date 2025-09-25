import dbConnect from "@/lib/connection/connection";
import User from "@/lib/models/User";
import { NextResponse } from "next/server"; 
import sendToken from "@/utils/sendToken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { name, email, password } = await req.body;

    const user = await User.create({
      name,
      email,
      password,
    });

    return sendToken(user, 201, res);
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ success: false, error: error.message || "Server error" });
  }
}
