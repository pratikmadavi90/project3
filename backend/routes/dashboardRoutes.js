const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

  const {
  getStats,
  getLowStock,
  getRecentOrders,
  getRecentUsers,
  getWeeklyStats,
  getDayOrders
} = require("../controllers/dashboardController");

router.get("/stats", authMiddleware, getStats);

router.get("/low-stock", authMiddleware, getLowStock);

router.get("/orders", authMiddleware, getRecentOrders);

router.get("/users", authMiddleware, getRecentUsers);

router.get(
  "/weekly-stats",
  authMiddleware,
  getWeeklyStats
);

router.get(
  "/day-orders",
  authMiddleware,
  getDayOrders
);

module.exports = router;