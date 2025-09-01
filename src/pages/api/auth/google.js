import dbConnect from "@/lib/connection/connection";
import User from "@/lib/models/User";
import sendToken from "@/utils/sendToken";

export default async function handler(req, res) {
  if (req.method != "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { idToken, email, displayName, uid, photoURL } = req.body;

    if (!idToken || !email) {
      return res.status(400).json({ error: "idToken and email are required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        avatar: photoURL ? { url: photoURL } : undefined,
        signupMethod: "OAuth",
      });
    } else {
      if (photoURL) {
        user.avatar = { url: photoURL };
      }
      if (user.signupMethod !== "OAuth") {
        user.signupMethod = "OAuth";
      }
      await user.save();
    }

    return sendToken(user, 200, res);
  } catch (error) {
    console.error("Google sign-in error:", error);
    return res.status(500).json({
      error: error.message || "Google authentication failed",
    });
  }
}
