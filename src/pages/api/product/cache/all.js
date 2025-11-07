import dbConnect from "@/lib/connection/connection";
import Product from "@/lib/models/Product";
import { kv } from "@/lib/redis/kv"; // Now correct
const CACHE_KEY = "allProducts";
const TTL = 6 * 60 * 60;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const cached = await kv.get(CACHE_KEY);
    if (cached) {
      return res.json({
        success: true,
        count: cached.length,
        data: cached,
        source: "cache",
      });
    }

    const products = await Product.find({}).lean();
    await kv.set(CACHE_KEY, products, { ttl: TTL });

    return res.json({
      success: true,
      count: products.length,
      data: products,
      source: "db",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
