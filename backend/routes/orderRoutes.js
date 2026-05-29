const express = require("express");
const router = express.Router();

const orderController =
require("../controllers/orderController");


// Create Order
router.post(
"/create",
orderController.createOrder
);


// Get All Orders
router.get(
"/",
orderController.getOrders
);


// 📊 Delivery Dashboard
router.get(
"/delivery-dashboard",
orderController.deliveryDashboard
);

// 📜 Delivery History
router.get(
"/delivery-history/:id",
orderController.deliveryHistory
);

// 🚚 Delivery Boy Current Order
router.get(
"/delivery-boy/:id",
orderController.getDeliveryOrder
);


// Get Single Order
router.get(
"/:id",
orderController.getSingleOrder
);


// Update Status
router.put(
"/:id/status",
orderController.updateStatus
);


// Assign Delivery Boy
router.put(
"/:id/assign-delivery",
orderController.assignDelivery
);


// Cancel Order
router.put(
"/:id/cancel",
orderController.cancelOrder
);


// Delete Order
router.delete(
"/:id",
orderController.deleteOrder
);

module.exports = router;