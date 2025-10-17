import dbConnect from "@/lib/connection/connection";
import User from "@/lib/models/User";
import sendToken from "@/utils/sendToken";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return ipKeyGenerator(req) || "unknown-ip"; // Normalize IP and provide fallback
  },
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      error: "Too many requests, please try again later",
    });
  },
});

const generateRandomPassword = () => uuidv4().slice(0, 8);

const applyRateLimit = (req, res) => {
  if (process.env.NODE_ENV === "development") {
    return Promise.resolve(); // Skip rate limiting in development
  }
  return new Promise((resolve, reject) => {
    limiter(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res);

    await dbConnect();

    const { method, body } = req;

    if (method !== "PUT") {
      return res
        .status(405)
        .json({ success: false, error: "Method not allowed" });
    }

    const { phone, idToken } = body;

    if (!phone || !idToken) {
      return res.status(400).json({
        success: false,
        error: "Phone number and idToken are required",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.phone_number !== phone) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number mismatch" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        password: generateRandomPassword(),
        signupMethod: "OTP",
      });
    }

    return sendToken(user, 200, res);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: error.message || "Server error" });
  }
}
