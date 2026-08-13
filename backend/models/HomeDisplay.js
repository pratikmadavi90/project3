const mongoose = require("mongoose");

const HomeDisplaySchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "Daily Grocery",
        "Chips & Namkeen",
        "Drinks",
        "Dairy, Bread & Eggs",
        "Personal Care",
        "Household",
      ],
      unique: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "HomeDisplay",
  HomeDisplaySchema
);