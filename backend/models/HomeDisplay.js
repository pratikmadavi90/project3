const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    subCategory: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const FeaturedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const HomeDisplaySchema = new mongoose.Schema(
  {
    featured: [FeaturedSchema],

    personalCare: [ItemSchema],

    snacks: [ItemSchema],

    grocery: [ItemSchema],

    beverages: [ItemSchema],

    dairy: [ItemSchema],

    

    household: [ItemSchema],

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
  "HomeDisplay",
  HomeDisplaySchema
);