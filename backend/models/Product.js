const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  subCategory: {
    type: String,
  },

  brand: {
    type: String,
    default: ""
  },

  weight: {
    type: String,
    default: ""
  },

  sku: String,
  barcode: String,

  images: {
    thumbnail: String,
    gallery: [String]
  },

  variants: [
    {
      size: String,
      color: String,
      weight: String
    }
  ],

  pricing: {
    mrp: Number,
    sellingPrice: Number,
    discount: Number
  },

  // ✅ UPDATED STOCK SYSTEM
  stock: {
    quantity: {
      type: Number,
      default: 0
    },

    inStock: {
      type: Boolean,
      default: true
    },

    lowStockLimit: {
      type: Number,
      default: 5
    }
  },

  // ✅ NEW: Warehouse + Location
  warehouse: {
    type: String,
    default: "Main"
  },

  location: {
    type: String,
    default: ""
  },

  tags: [String],

  seo: {
    title: String,
    description: String
  },

  isFeatured: Boolean,
  isTrending: Boolean,

  isApproved: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);