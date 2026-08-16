const express = require("express");

const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/footwearProductController");

// yaha apna existing S3 upload middleware lagana
const upload = require("../middleware/uploadFootwearImages");

router.post(
  "/add",
  upload.array("images", 10),
  addProduct
);

router.get("/", getProducts);

router.get(
  "/category/:categoryId",
  getProductsByCategory
);

router.get("/search", searchProducts);

router.put(
  "/update/:id",
  upload.array("images", 10),
  updateProduct
);

router.delete(
  "/delete/:id",
  deleteProduct
);

module.exports = router;