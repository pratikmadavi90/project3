const HomeDisplay = require("../models/HomeDisplay");

// GET HOME DISPLAY
exports.getHomeDisplay = async (req, res) => {
  try {
    let data = await HomeDisplay.findOne();

    if (!data) {
      data = await HomeDisplay.create({
        featured: [],
        personalCare: [],
        household: [],
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Home Display",
    });
  }
};

// SAVE HOME DISPLAY
exports.saveHomeDisplay = async (req, res) => {
  try {

    const {
      featured,
      personalCare,
      household,
    } = req.body;

    let data = await HomeDisplay.findOne();

    if (data) {

      data.featured =
        featured || [];

      data.personalCare =
        personalCare || [];

      data.household =
        household || [];

      await data.save();

      return res.status(200).json({
        success: true,
        message:
          "Home Display Updated",
        data,
      });
    }

    data = await HomeDisplay.create({
      featured:
        featured || [],
      personalCare:
        personalCare || [],
      household:
        household || [],
    });

    res.status(201).json({
      success: true,
      message:
        "Home Display Created",
      data,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to save Home Display",
    });
  }
};

// CLEAR HOME DISPLAY
exports.clearHomeDisplay = async (
  req,
  res
) => {
  try {

    await HomeDisplay.updateMany(
      {},
      {
        featured: [],
        personalCare: [],
        household: [],
      }
    );

    res.status(200).json({
      success: true,
      message:
        "Home Display Cleared",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to clear data",
    });
  }
};