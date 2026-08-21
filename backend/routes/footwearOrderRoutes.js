const express = require("express");

const router = express.Router();

const {
  createFootwearOrder,
  getAllFootwearOrders,
  getFootwearOrderById,
  updateFootwearOrderStatus,
} = require("../controllers/footwearOrderController");


// Create Order
router.post(
  "/create",
  createFootwearOrder
);

// Get All Orders
router.get(
  "/all",
  getAllFootwearOrders
);

// Get Single Order
router.get(
  "/:id",
  getFootwearOrderById
);

// Update Status
router.put(
  "/:id/status",
  updateFootwearOrderStatus
);

module.exports = router;