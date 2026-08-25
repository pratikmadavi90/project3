const FootwearProduct = require("../models/FootwearProduct");
const FootwearCategory = require("../models/FootwearCategory");

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const {
      category,
      name,
      brand,
      size,
      mrp,
      sellingPrice,
      stock,
      sizeStock,
      description,
      featured,
      newArrival,
      displayOrder,
    } = req.body;

    const categoryExists =
      await FootwearCategory.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const images =
      req.files?.map((file) => file.location) || [];

    const product = await FootwearProduct.create({
      category,
      name,
      brand,
      size: Array.isArray(size)
        ? size
        : size.split(","),
      mrp,
      sellingPrice,
      stock,
      sizeStock: sizeStock
       ? JSON.parse(sizeStock)
       : {},
      description,
      images,
      featured,
      newArrival,
      displayOrder,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Products
exports.getProducts = async (req, res) => {
  try {
    const products = await FootwearProduct.find()
      .populate("category")
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Products By Category
exports.getProductsByCategory = async (
  req,
  res
) => {
  try {
    const products =
      await FootwearProduct.find({
        category: req.params.categoryId,
      })
        .populate("category")
        .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {

const existingProduct =
  await FootwearProduct.findById(req.params.id);

const updateData = {
  category:
    req.body.category ||
    existingProduct.category,

  name:
    req.body.name ||
    existingProduct.name,

  brand:
    req.body.brand ||
    existingProduct.brand,

  mrp:
    req.body.mrp ||
    existingProduct.mrp,

  sellingPrice:
    req.body.sellingPrice ||
    existingProduct.sellingPrice,

  description:
    req.body.description ||
    existingProduct.description,

  displayOrder:
    req.body.displayOrder ||
    existingProduct.displayOrder,

  sizeStock:
    req.body.sizeStock
      ? JSON.parse(req.body.sizeStock)
      : existingProduct.sizeStock,
};

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(
        (file) => file.location
      );
    }

    const product =
      await FootwearProduct.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

    res.status(200).json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await FootwearProduct.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Product
exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const products =
      await FootwearProduct.find({
        $or: [
          {
            name: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            brand: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};