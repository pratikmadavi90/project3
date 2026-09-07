const mongoose = require("mongoose");

const footwearSettingsSchema =
new mongoose.Schema({

  enabled: {
    type: Boolean,
    default: false
  }

});

module.exports =
mongoose.model(
  "FootwearSettings",
  footwearSettingsSchema
);