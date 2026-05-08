const express = require("express");
const router = express.Router();

const {
  getStats,
  getLowStock,
  getRecentOrders,
  getRecentUsers
} = require("../controllers/dashboardController");

router.get("/stats", getStats);
router.get("/low-stock", getLowStock);
router.get("/orders", getRecentOrders);
router.get("/users", getRecentUsers);

module.exports = router;