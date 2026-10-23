const mongoose = require("mongoose");

const footwearInventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FootwearProduct",
      required: true,
      index: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    transactionType: {
      type: String,
      enum: [
        "STOCK_IN",
        "STOCK_OUT",
        "SALE",
        "RETURN",
        "CANCELLATION",
        "ADJUSTMENT",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },

    newStock: {
      type: Number,
      required: true,
      min: 0,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    referenceId: {
      type: String,
      default: "",
      trim: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    updatedByName: {
      type: String,
      default: "System",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

footwearInventorySchema.index({ product: 1, createdAt: -1 });
footwearInventorySchema.index({ transactionType: 1, createdAt: -1 });

module.exports = mongoose.model(
  "FootwearInventory",
  footwearInventorySchema
);