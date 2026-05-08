const express = require("express");
const router = express.Router();

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
// POST /api/orders/create
router.post("/create", createOrder);


// 📋 GET ALL ORDERS (Admin Panel)
// GET /api/orders
router.get("/", getOrders);


// 🔍 GET SINGLE ORDER
// GET /api/orders/:id
router.get("/:id", getSingleOrder);


// 🔄 UPDATE ORDER STATUS
// PUT /api/orders/:id/status
router.put("/:id/status", updateStatus);


// 🚚 ASSIGN DELIVERY BOY
// PUT /api/orders/:id/assign-delivery
router.put("/:id/assign-delivery", assignDelivery);


// ❌ CANCEL ORDER
// PUT /api/orders/:id/cancel
router.put("/:id/cancel", cancelOrder);


// =============================
// 🚀 FUTURE READY (OPTIONAL)
// =============================

// 📱 Delivery Boy ke liye (future)
// GET assigned orders
// router.get("/delivery/my-orders", getMyDeliveryOrders);


// =============================
module.exports = router;