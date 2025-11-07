// pages/api/product/invalidate/[id].js
import dbConnect from "@/lib/connection/connection";
import { kv } from "@/lib/redis/kv";
export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const { id } = req.query;

  // Validate ObjectId format
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid product ID" });
  }

  const cacheKey = `product:${id}`;

  try {
    await dbConnect();

    // Delete from Redis KV
    const deleted = await kv.delete(cacheKey);

    return res.status(200).json({
      success: true,
      message: "Cache invalidated",
      deleted: Boolean(deleted),
      cacheKey,
    });
  } catch (error) {
    console.error("Cache invalidation error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to invalidate cache" });
  }
}
