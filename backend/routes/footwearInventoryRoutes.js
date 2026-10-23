const express = require("express");
const router = express.Router();

const {
  getInventoryDashboard,
  getInventoryList,
  updateStock,
  getStockAlerts,
  getStockHistory,
} = require("../controllers/footwearInventoryController");

// Inventory Dashboard
router.get("/dashboard", getInventoryDashboard);

// Inventory Products List
router.get("/", getInventoryList);

// Add or Reduce Stock
router.patch("/update-stock", updateStock);

// Low Stock and Out of Stock Alerts
router.get("/alerts", getStockAlerts);

// Stock History
router.get("/history", getStockHistory);

module.exports = router;