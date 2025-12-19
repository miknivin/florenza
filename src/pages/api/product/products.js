// pages/api/product/products.js

import dbConnect from "@/lib/connection/connection";
import Product from "@/lib/models/Product";
import { kv } from "@/lib/redis/kv";
import APIFilters from "@/utils/apiFilter";
import CacheFilters from "@/utils/CacheApiFilter";

const FULL_CACHE_KEY = "allProducts";
const TTL = 6 * 60 * 60; // 6 hours
const CACHE_TIMEOUT_MS = 1000; // 1 second timeout for cache fetch

// Detect environment
const isDev = process.env.NODE_ENV === "development";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { resPerPage = 50, isDistinctCategory, ...queryParams } = req.query;
    const perPage = Number(resPerPage);

    let source = "db";
    let filteredProducts, filteredProductsCount, categories;

    // === DISABLE CACHING IN DEVELOPMENT ===
    if (isDev) {
      console.log("Development mode: Caching disabled, fetching from DB");
      await dbConnect();

      const apiFilters = new APIFilters(Product, queryParams)
        .search()
        .filter()
        .sort();

      const countQuery = apiFilters.query.clone();
      const countDocs = await countQuery;
      filteredProductsCount = countDocs.length;

      apiFilters.pagination(perPage);
      filteredProducts = await apiFilters.query.clone();

      if (isDistinctCategory === "true") {
        categories = await Product.distinct("category");
      }

      return res.status(200).json({
        success: true,
        resPerPage: perPage,
        source,
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
    }

    // === PRODUCTION: CACHING ENABLED (original logic) ===
    let cachedFull = null;

    // Try to fetch from cache with timeout
    try {
      cachedFull = await Promise.race([
        kv.get(FULL_CACHE_KEY),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Cache timeout")), CACHE_TIMEOUT_MS)
        ),
      ]);
    } catch (cacheError) {
      console.warn("Cache fetch failed or timed out:", cacheError.message);
    }

    if (cachedFull) {
      // CACHE HIT
      source = "cache";
      const cacheFilter = new CacheFilters(cachedFull, queryParams)
        .search()
        .filter()
        .sort();

      const totalAfterFilter = cacheFilter.result().length;
      filteredProductsCount = totalAfterFilter;
      filteredProducts = cacheFilter.pagination(perPage).result();

      if (isDistinctCategory === "true") {
        categories = [...new Set(cachedFull.map((p) => p.category))];
      }
    } else {
      // CACHE MISS
      await dbConnect();

      const apiFilters = new APIFilters(Product, queryParams)
        .search()
        .filter()
        .sort();

      const countQuery = apiFilters.query.clone();
      const countDocs = await countQuery;
      filteredProductsCount = countDocs.length;

      apiFilters.pagination(perPage);
      filteredProducts = await apiFilters.query.clone();

      if (isDistinctCategory === "true") {
        categories = await Product.distinct("category");
      }

      // Warm up cache
      try {
        const fullList = await Product.find({}).lean();
        await kv.set(FULL_CACHE_KEY, fullList, { ttl: TTL });
        console.log("Cache warmed with full product list");
      } catch (cacheSetError) {
        console.warn("Failed to warm cache:", cacheSetError.message);
      }
    }

    return res.status(200).json({
      success: true,
      resPerPage: perPage,
      source,
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
