const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },

    image: {
      type: String, // S3 URL
      default: "",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Unique category name
productCategorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model(
  "ProductCategory",
  productCategorySchema
);