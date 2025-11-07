// pages/api/product/products.js
import dbConnect from "@/lib/connection/connection";
import Product from "@/lib/models/Product";
import { kv } from "@/lib/redis/kv";
import APIFilters from "@/utils/apiFilter";
import CacheFilters from "@/utils/CacheApiFilter";

const FULL_CACHE_KEY = "allProducts";
const TTL = 6 * 60 * 60;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { resPerPage = 50, ...queryParams } = req.query;
    const perPage = Number(resPerPage);
    console.log(queryParams);

    const cachedFull = await kv.get(FULL_CACHE_KEY);

    let filteredProducts, filteredProductsCount, categories;

    if (cachedFull) {
      const cacheFilter = new CacheFilters(cachedFull, queryParams)
        .search()
        .filter()
        .sort();
      if (queryParams && queryParams.category) {
        console.log(cacheFilter.result().length);
      }
      const totalAfterFilter = cacheFilter.result().length;
      filteredProductsCount = totalAfterFilter;

      filteredProducts = cacheFilter.pagination(perPage).result();
      categories = [...new Set(cachedFull.map((p) => p.category))];
    } else {
      // ----- CACHE MISS → DB + Mongo filters -----
      const apiFilters = new APIFilters(Product, queryParams)
        .search()
        .filter()
        .sort();

      const countQuery = apiFilters.query.clone();
      const countDocs = await countQuery;
      filteredProductsCount = countDocs.length;

      apiFilters.pagination(perPage);
      filteredProducts = await apiFilters.query.clone();

      categories = await Product.distinct("category");

      // ----- store full list for future calls -----
      const fullList = await Product.find({}).lean();
      await kv.set(FULL_CACHE_KEY, fullList, { ttl: TTL });
    }

    return res.status(200).json({
      success: true,
      resPerPage: perPage,
      source: cachedFull ? "cache" : "db",
      filteredProductsCount,
      filteredProducts,
      filters: {
        categories: categories || [],
        prices: [
          [0, 1000],
          [1000, 5000],
          [5000, 10000],
        ],
      },
    });
  } catch (error) {
    console.error("Error in /api/product/products:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
