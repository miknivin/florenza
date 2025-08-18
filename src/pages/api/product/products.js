import dbConnect from "@/lib/connection/connection";
import Product from "@/lib/models/Product";
import APIFilters from "@/utils/apiFilter";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await dbConnect();

      const { resPerPage = 50, ...queryParams } = req.query;

      const apiFilters = new APIFilters(Product, queryParams)
        .search()
        .filter()
        .sort();

      let filteredProducts = await apiFilters.query;
      const filteredProductsCount = filteredProducts.length;

      apiFilters.pagination(parseInt(resPerPage));
      filteredProducts = await apiFilters.query.clone();

      return res.status(200).json({
        success: true,
        resPerPage: parseInt(resPerPage),
        filteredProductsCount,
        filteredProducts,
      });
    } catch (error) {
      console.log(error);
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
