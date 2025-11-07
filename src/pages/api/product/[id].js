// pages/api/product/[id].js
import dbConnect from "@/lib/connection/connection";
import Product from "@/lib/models/Product";
import { kv } from "@/lib/redis/kv";

const TTL = 6 * 60 * 60; // 6 h – same as the list cache

export const config = { runtime: "nodejs" }; // required for Mongoose

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  const { id } = req.query;
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid product ID" });
  }

  const cacheKey = `product:${id}`;

  try {
    await dbConnect();

    // ---------- 1. TRY KV ----------
    const cached = await kv.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        product: cached,
        source: "cache",
      });
    }

    // ---------- 2. DB ----------
    const product = await Product.findById(id).lean(); // .lean() → plain object
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    // ---------- 3. WRITE TO KV ----------
    await kv.set(cacheKey, product, { ttl: TTL });

    return res.json({
      success: true,
      product,
      source: "db",
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
}
