const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    device: {
      type: String,
      default: "unknown",
    },

    ip: {
      type: String,
      default: "unknown",
    },

    userAgent: {
      type: String,
    },

    refreshToken: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
