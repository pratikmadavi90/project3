const ProductCategory = require("../models/ProductCategory");


// Add Category
exports.addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;

    const existingCategory = await ProductCategory.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await ProductCategory.create({
      name: name.trim(),
      image: req.file?.location || "",
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.error("Add Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Single Category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await ProductCategory.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.name =
      req.body.name || category.name;

    category.status =
      req.body.status || category.status;

    if (req.file?.location) {
      category.image = req.file.location;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(
      req.params.id
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};