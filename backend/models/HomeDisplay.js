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
  },
  { _id: false }
);

const HomeDisplaySchema = new mongoose.Schema(
  {
    personalCare: {
      type: [ItemSchema],
      default: Array(8).fill({
        name: "",
        image: "",
      }),
    },

    snacks: {
      type: [ItemSchema],
      default: Array(8).fill({
        name: "",
        image: "",
      }),
    },

    grocery: {
      type: [ItemSchema],
      default: Array(8).fill({
        name: "",
        image: "",
      }),
    },

    beverages: {
      type: [ItemSchema],
      default: Array(8).fill({
        name: "",
        image: "",
      }),
    },

    dairy: {
      type: [ItemSchema],
      default: Array(8).fill({
        name: "",
        image: "",
      }),
    },

    household: {
      type: [ItemSchema],
      default: Array(8).fill({
        name: "",
        image: "",
      }),
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