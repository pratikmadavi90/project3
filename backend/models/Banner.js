const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: String,
  image: String,
  type: String, 
  position: Number,
  isActive: { type: Boolean, default: true },

  
  redirectType: String,
  redirectValue: String

}, { timestamps: true });

module.exports = mongoose.model("Banner", bannerSchema);