const mongoose = require("mongoose");

const footwearOrderSchema = new mongoose.Schema(
{
  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: String,
    required: true,
  },

 email: {
  type: String,
  required: true,
}, 

  customerName: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    default: "",
  },

  city: {
    type: String,
    default: "",
  },

  pincode: {
    type: String,
    default: "",
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FootwearProduct",
    required: true,
  },

  productName: {
    type: String,
    required: true,
  },

  productImage: {
    type: String,
    default: "",
  },

  size: {
    type: String,
    default: "",
  },

  mrp: {
    type: Number,
    default: 0,
  },

  sellingPrice: {
    type: Number,
    default: 0,
  },

  discount: {
    type: Number,
    default: 0,
  },

  paymentMethod: {
    type: String,
    enum: ["Cash On Delivery", "Pay Online"],
    default: "Cash On Delivery",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },

  totalAmount: {
    type: Number,
    required: true,
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model(
  "FootwearOrder",
  footwearOrderSchema
);