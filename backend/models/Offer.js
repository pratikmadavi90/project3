const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: String,

  type: {
    type: String,
    enum: ["percentage", "flat", "bogo"], // Buy 1 Get 1
  },

  value: Number, // % ya ₹

  minOrderAmount: Number,

  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  startDate: Date,
  endDate: Date,

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Offer", offerSchema);