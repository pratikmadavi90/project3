const mongoose = require("mongoose");

const footwearCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    displayOrder: {
  type: Number,
  default: 0,
},

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "FootwearCategory",
  footwearCategorySchema
);