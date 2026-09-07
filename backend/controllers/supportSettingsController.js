const SupportSettings = require("../models/SupportSettings");

// Get Settings
exports.getSupportSettings = async (req, res) => {
  try {

    let settings = await SupportSettings.findOne();

    if (!settings) {
      settings = await SupportSettings.create({
        callNumber1: "",
        callNumber2: ""
      });
    }

    res.json(settings);

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

// Update Settings
exports.updateSupportSettings = async (req, res) => {
  try {

    const {
      callNumber1,
      callNumber2
    } = req.body;

    let settings = await SupportSettings.findOne();

    if (!settings) {

      settings = await SupportSettings.create({
        callNumber1,
        callNumber2
      });

    } else {

      settings.callNumber1 = callNumber1;
      settings.callNumber2 = callNumber2;

      await settings.save();
    }

    res.json({
      success: true,
      settings
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false
    });
  }
};