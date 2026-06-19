const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  updateStock,
  getLowStock,
  getOutOfStock,
  getProducts,
} = require("../controllers/stockController");

// Update Stock
router.post(
  "/update",
  authMiddleware,
  updateStock
);

// Low Stock Products
router.get(
  "/low",
  authMiddleware,
  getLowStock
);

// Out Of Stock Products
router.get(
  "/out",
  authMiddleware,
  getOutOfStock
);

// All Products Stock
router.get(
  "/all",
  authMiddleware,
  getProducts
);

module.exports = router;