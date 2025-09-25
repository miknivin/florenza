import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: [230, "Short description cannot exceed 230 characters"],
  },
  features: {
    type: [{ type: String, trim: true }],
    validate: {
      validator: (features) => features.length <= 10,
      message: "Maximum 10 features allowed",
    },
    default: [],
  },
  variants: [
    {
      size: {
        type: String,
        required: true,
        enum: ["30ml", "50ml", "100ml", "150ml"], // Restrict to common perfume sizes
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      discountPrice: {
        type: Number,
        min: 0,
        default: null,
      },
    },
  ],
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
  fragranceNotes: {
    top: [{ type: String, trim: true }], // e.g., ["Bergamot", "Lemon"]
    heart: [{ type: String, trim: true }], // e.g., ["Jasmine", "Rose"]
    base: [{ type: String, trim: true }], // e.g., ["Sandalwood", "Musk"]
  },
  gender: {
    type: String,
    enum: ["Unisex", "Male", "Female"],
    default: "Unisex",
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Floral",
      "Woody",
      "Citrus",
      "Oriental",
      "Fresh",
      "Spicy",
      "Aquatic",
      "Gourmand",
      "Combo",
    ], // Common perfume categories
  },
  images: [
    {
      url: { type: String, required: true },
      alt: { type: String, default: "" },
    },
  ],
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
