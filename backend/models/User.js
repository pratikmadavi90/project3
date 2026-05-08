const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, unique: true },

  phone: { type: String, unique: true },

  address: { type: String },

  city: { type: String },        // ✅ ADD
  pincode: { type: String },     // ✅ ADD

  isBlocked: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);