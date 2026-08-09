const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  orderId: String,

  userId: String,

  userEmail: String,

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
  "Packing",
  "Packed",
  "Handed Over",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Delivery Rejected"
],

    default: "Pending"
  },

deliveryBoy: {
  name: String,
  phone: String
},

deliveryBoyId:String,

deliveryAssignedAt:{
  type:Date,
  default:null
},

deliveryAccepted:{
  type:Boolean,
  default:false
},

deliveryRejectedBy:[
  {
    type:String
  }
],

rejectionRound: {
  type: Number,
  default: 0
},

deliveredAt:{
  type:Date,
  default:null
},

packedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Staff",
  default: null
},

staffId: {
  type: String,
  default: null
},

packingStartedAt: {
  type: Date,
  default: null
},

packedAt: {
  type: Date,
  default: null
},

handoverAt: {
  type: Date,
  default: null
}

}, { timestamps: true });

module.exports =
mongoose.model("Order", orderSchema);