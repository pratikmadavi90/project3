const mongoose = require("mongoose");

const staffPackingSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    staffId: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      default: "",
    },

    orderNumber: {
      type: String,
      default: "",
    },

    items: {
      type: Number,
      default: 0,
    },

    packedItems: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Packing", "Completed"],
      default: "Pending",
    },

    packingTime: {
      type: Number,
      default: 0, // Minutes
    },

    packedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StaffPacking", staffPackingSchema);