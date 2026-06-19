const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// Controllers import
const {
  createOrder,
  getOrders,
  getSingleOrder,
  updateStatus,
  assignDelivery,
  cancelOrder
} = require("../controllers/orderController");


// =============================
// 📦 ORDER ROUTES
// =============================


// 🧾 CREATE ORDER
// User order place kar sake
router.post(
  "/create",
  createOrder
);


// 📋 GET ALL ORDERS (Admin)
router.get(
  "/",
  authMiddleware,
  getOrders
);


// 🔍 GET SINGLE ORDER (Admin)
router.get(
  "/:id",
  authMiddleware,
  getSingleOrder
);


// 🔄 UPDATE ORDER STATUS (Admin)
router.put(
  "/:id/status",
  authMiddleware,
  updateStatus
);


// 🚚 ASSIGN DELIVERY BOY (Admin)
router.put(
  "/:id/assign-delivery",
  authMiddleware,
  assignDelivery
);


// ❌ CANCEL ORDER (Admin)
router.put(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);


module.exports = router;