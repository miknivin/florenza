import { kv } from "@/lib/redis/kv";

const CACHE_KEY = "allProducts"; // same key as used in your get products API

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Use POST instead." });
  }

  try {
    await kv.delete(CACHE_KEY);
    return res.status(200).json({
      success: true,
      message: `Cache invalidated for key: ${CACHE_KEY}`,
    });
  } catch (error) {
    console.error("Cache invalidation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
