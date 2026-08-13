const HomeDisplay = require("../models/HomeDisplay");

// GET ALL HOME DISPLAY
exports.getHomeDisplay = async (req, res) => {
  try {
    const data = await HomeDisplay.find()
      .populate("products");

    res.status(200).json(data);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch home display",
    });
  }
};

// GET SINGLE SECTION
exports.getSection = async (req, res) => {
  try {
    const section = await HomeDisplay.findOne({
      section: req.params.section,
    }).populate("products");

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.status(200).json(section);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch section",
    });
  }
};

// CREATE OR UPDATE SECTION
exports.saveSection = async (req, res) => {
  try {
    const {
      section,
      products,
      isActive,
    } = req.body;

    let existing = await HomeDisplay.findOne({
      section,
    });

    if (existing) {
      existing.products = products;
      existing.isActive = isActive;

      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Section updated",
        data: existing,
      });
    }

    const newSection =
      await HomeDisplay.create({
        section,
        products,
        isActive,
      });

    res.status(201).json({
      success: true,
      message: "Section created",
      data: newSection,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to save section",
    });
  }
};

// DELETE SECTION
exports.deleteSection = async (req, res) => {
  try {
    await HomeDisplay.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Section deleted",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete section",
    });
  }
};