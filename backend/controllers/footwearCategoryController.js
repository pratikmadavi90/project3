const FootwearCategory = require("../models/FootwearCategory");

// Add Category
exports.addCategory = async (req, res) => {
  try {
    const {
  name,
  displayOrder
} = req.body;

    const existing = await FootwearCategory.findOne({ name });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

  const category = await FootwearCategory.create({
  name,
  displayOrder,
});

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
const categories = await FootwearCategory.find()
  .sort({ displayOrder: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const category = await FootwearCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    await FootwearCategory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};