const Settings = require("../models/Settings");

// 🔹 Get settings
exports.getSettings = async (req, res) => {
  let data = await Settings.findOne();

  if (!data) {
    data = await Settings.create({});
  }

  res.json(data);
};

// 🔹 Update settings
exports.updateSettings = async (req, res) => {
  let data = await Settings.findOne();

  if (!data) {
    data = new Settings(req.body);
  } else {
    Object.assign(data, req.body);
  }

  await data.save();

  res.json(data);
};