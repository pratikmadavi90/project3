const express = require("express");
const router = express.Router();

// Controller import (IMPORTANT: path check)
const orderController = require("../controllers/orderController");


// ==============================
// 📦 ORDER ROUTES
// ==============================


// 🧾 Create Order
// POST /api/orders/create
router.post("/create", orderController.createOrder);


// 📋 Get All Orders (Admin)
/// GET /api/orders
router.get("/", orderController.getOrders);


// 🔍 Get Single Order
// GET /api/orders/:id
router.get("/:id", orderController.getSingleOrder);


// 🔄 Update Order Status
// PUT /api/orders/:id/status
router.put("/:id/status", orderController.updateStatus);


// 🚚 Assign Delivery Boy
// PUT /api/orders/:id/assign-delivery
router.put("/:id/assign-delivery", orderController.assignDelivery);


// ❌ Cancel Order
// PUT /api/orders/:id/cancel
router.put("/:id/cancel", orderController.cancelOrder);

// 🗑 Delete Order
router.delete("/:id", orderController.deleteOrder);

// 📊 Delivery Dashboard
router.get(
"/delivery-dashboard",
orderController.deliveryDashboard
);

// 🚚 Delivery Boy Current Order
router.get(
"/delivery-boy/:id",
orderController.getDeliveryOrder
);

// ==============================
module.exports = router;