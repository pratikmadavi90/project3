const mongoose = require("mongoose");

const supportSettingsSchema = new mongoose.Schema(
{
  callNumber1: {
    type: String,
    default: ""
  },

  callNumber2: {
    type: String,
    default: ""
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model(
  "SupportSettings",
  supportSettingsSchema
);