const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getStats,
  getLowStock,
  getRecentOrders,
  getRecentUsers
} = require("../controllers/dashboardController");

router.get("/stats", authMiddleware, getStats);

router.get("/low-stock", authMiddleware, getLowStock);

router.get("/orders", authMiddleware, getRecentOrders);

router.get("/users", authMiddleware, getRecentUsers);

module.exports = router;