const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: String,

  user: {
    name: String,
    phone: String,
  },

  address: {
    fullAddress: String,
    city: String,
    pincode: String,
  },

items: [
  {
    productId: String,
    name: String,
    image: String,
    qty: Number,
    price: Number,

    weight: String
  }
],

  totalAmount: Number,
  finalAmount: Number, 

  payment: {
    method: String,
    status: String,
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Accepted",
      "Packed",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ],
    default: "Pending"
  },

  deliveryBoy: {
    name: String,
    phone: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);