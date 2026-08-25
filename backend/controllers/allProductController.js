const AllProduct = require("../models/AllProduct");
const ProductCategory = require("../models/ProductCategory");


// Add Product
exports.addProduct = async (req, res) => {
  try {
    const {
      categoryId,
      categoryName,
      name,
      subCategory,
      mrp,
      sellingPrice,
      weight,
      maxOrderQuantity,
      stock,
      description,
      status,
      displayOrder,
    } = req.body;

const images =
  req.files?.map((file) => file.location) || [];

const category =
  await ProductCategory.findById(categoryId);

if (!category) {
  return res.status(404).json({
    success: false,
    message: "Category not found",
  });
}

const lastProduct =
  await AllProduct.findOne()
    .sort({ displayOrder: -1 });



    const product = await AllProduct.create({
      categoryId,
      categoryName: category.name,
      name,
      subCategory,
      mrp,
      sellingPrice,
      weight,
      stock,
      maxOrderQuantity,
      description,
      status: status || "Active",
      displayOrder: displayOrder || 9999,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
const products = await AllProduct.find()
  .populate("categoryId", "name image")
  .sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Products By Category
exports.getProductsByCategory = async (req, res) => {
  try {
const products = await AllProduct.find({
  categoryId: req.params.categoryId,
}).sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Category Products Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await AllProduct.findById(
      req.params.id
    ).populate("categoryId", "name image");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await AllProduct.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

const {
  categoryId,
  categoryName,
  name,
  subCategory,
  mrp,
  sellingPrice,
  weight,
  stock,
  maxOrderQuantity,
  description,
  status,
  displayOrder,
} = req.body;


// Category Update
if (categoryId) {
  const category = await ProductCategory.findById(categoryId);

  if (category) {
    product.categoryId = category._id;
    product.categoryName = category.name;
  }
}

    product.name =
      name || product.name;

    product.subCategory =
      subCategory || product.subCategory;

    product.mrp =
      mrp || product.mrp;

    product.sellingPrice =
      sellingPrice || product.sellingPrice;

    product.weight =
      weight || product.weight;

    product.stock =
      stock || product.stock;

    product.maxOrderQuantity =
      maxOrderQuantity ||
      product.maxOrderQuantity;     

    product.description =
      description || product.description;

    product.status =
      status || product.status;

    product.displayOrder =
      displayOrder || product.displayOrder;  

    // New Images Selected
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(
        (file) => file.location
      );
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await AllProduct.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};