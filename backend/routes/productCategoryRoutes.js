const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/productCategoryController");

const upload = require("../middleware/uploadProductImages");

// Add Category
router.post(
  "/add",
  upload.single("image"),
  addCategory
);

// Get All Categories
router.get(
  "/",
  getCategories
);

// Get Single Category
router.get(
  "/:id",
  getCategoryById
);

// Update Category
router.put(
  "/:id",
  upload.single("image"),
  updateCategory
);

// Delete Category
router.delete(
  "/:id",
  deleteCategory
);

module.exports = router;