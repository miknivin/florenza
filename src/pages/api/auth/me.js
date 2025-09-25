import dbConnect from "@/lib/connection/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const user = await isAuthenticatedUser(req);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
}
