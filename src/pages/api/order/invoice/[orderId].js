import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import dbConnect from "@/lib/connection/connection";
import { uploadToS3 } from "@/utils/uploadToS3";
import Order from "@/lib/models/Orders";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    Product;
    User;
    await dbConnect();

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if invoiceURL already exists
    if (order.invoiceURL) {
      return res.status(200).json({ invoiceURL: order.invoiceURL });
    }

    // Render EJS to HTML
    const templatePath = path.join(
      process.cwd(),
      "src",
      "lib",
      "others",
      "invoice.ejs"
    );
    const html = await ejs.renderFile(templatePath, { order });

    // Generate PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser", // Fallback to system Chromium if bundled fails
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });
    await browser.close();

    // Upload to S3 and get URL
    const fileKey = `invoices/invoice-${orderId}.pdf`;
    const invoiceURL = await uploadToS3(pdfBuffer, fileKey);

    // Update order with invoiceURL
    order.invoiceURL = invoiceURL;
    await order.save();

    // Return the invoiceURL as JSON
    return res.status(200).json({ invoiceURL });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
