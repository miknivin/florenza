import dbConnect from "@/lib/connection/connection";
import Order from "@/lib/models/Orders";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import APIFilters from "@/utils/apiFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Ensure models are imported (Order and User seem unused, consider removing)
      await dbConnect();

      const { resPerPage = 50, ...queryParams } = req.query;

      // Apply filters, search, and sorting
      const apiFilters = new APIFilters(Product, queryParams)
        .search()
        .filter()
        .sort();

      let filteredProducts = await apiFilters.query;
      const filteredProductsCount = filteredProducts.length;

      // Apply pagination
      apiFilters.pagination(parseInt(resPerPage));
      filteredProducts = await apiFilters.query.clone();

      // Fetch unique categories
      const categories = await Product.distinct("category");

      return res.status(200).json({
        success: true,
        resPerPage: parseInt(resPerPage),
        filteredProductsCount,
        filteredProducts,
        filters: {
          categories: categories || [], // e.g., ["Floral", "Woody", "Citrus"]
          prices: [[0, 1000], [1000, 5000], [5000, 10000]], // Adjust as needed
        },
      });
    } catch (error) {
      console.error("Error in /api/product/products:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }
}