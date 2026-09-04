const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

userId: {
  type: String,
  unique: true,
},

  name: { type: String, required: true },

  email: { type: String, unique: true },

  phone: {
  type: String,
  unique: true,
  sparse: true
},

  address: { type: String },

  city: { type: String },        
  pincode: { type: String },     

  isBlocked: { type: Boolean, default: false },

 cancelStreak: {
  type: Number,
  default: 0
},

codBlocked: {
  type: Boolean,
  default: false
}, 

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);