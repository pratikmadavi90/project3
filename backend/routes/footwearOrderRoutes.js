const express = require("express");

const router = express.Router();

const {
  createFootwearOrder,
  getAllFootwearOrders,
  getFootwearOrderById,
  getUserFootwearOrders,
  getUserFootwearOrderDetails,
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

router.get(
  "/user/:email",
  getUserFootwearOrders
);

router.get(
  "/user/:email/:id",
  getUserFootwearOrderDetails
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