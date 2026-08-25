const mongoose = require("mongoose");

const allProductSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true,
    },

    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    weight: {
      type: String,
      default: "",
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

maxOrderQuantity: {
  type: Number,
  default: 50,
  min: 1,
},    

    description: {
      type: String,
      default: "",
      trim: true,
    },

    images: [
      {
        type: String, // S3 Image URL
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

displayOrder: {
  type: Number,
  default: 9999,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AllProduct",
  allProductSchema
);