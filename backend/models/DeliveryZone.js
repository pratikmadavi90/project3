const mongoose = require("mongoose");

const deliveryZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  pincode: {
    type: String
  },

  // 💰 Delivery Charge
  charge: {
    type: Number,
    required: true
  },

  // ⏱️ Delivery Time
  time: {
    type: String
  },

  // 🎁 Free Delivery Above
  freeDeliveryAbove: {
    type: Number,
    default: 0
  },

  // 🛒 Minimum Order Value
  minimumOrder: {
    type: Number,
    default: 0
  },

  // 📍 Landmark (optional)
  landmark: {
    type: String
  },

  // 🏠 Full Address (optional)
  address: {
    type: String
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("DeliveryZone", deliveryZoneSchema);