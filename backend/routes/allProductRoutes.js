const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/allProductController");

const upload = require("../middleware/uploadProductImages");


// Add Product (Multiple Images)
router.post(
  "/add",
  upload.array("images", 10),
  addProduct
);


// Get All Products
router.get(
  "/",
  getAllProducts
);

// Search Products
router.get(
  "/search",
  searchProducts
);


// Get Products By Category
router.get(
  "/category/:categoryId",
  getProductsByCategory
);


// Get Single Product
router.get(
  "/:id",
  getProductById
);


// Update Product
router.put(
  "/:id",
  upload.array("images", 10),
  updateProduct
);


// Delete Product
router.delete(
  "/:id",
  deleteProduct
);

module.exports = router;