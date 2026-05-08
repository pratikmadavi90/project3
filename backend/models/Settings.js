const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  storeName: String,
  storeEmail: String,
  storePhone: String,

  currency: {
    type: String,
    default: "₹"
  },

  address: String,

  gstNumber: String,

  invoicePrefix: {
    type: String,
    default: "INV"
  },

  logo: String

}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);