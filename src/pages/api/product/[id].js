import dbConnect from "@/lib/connection/connection";
import Product from "@/lib/models/Product";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await dbConnect();

      const { id } = req.query; // Extract id from query (Pages Router)

      // Validate ID format (MongoDB ObjectId)
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          error: "Invalid or missing product ID",
        });
      }

      // Fetch the product by ID
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  } else {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }
}
