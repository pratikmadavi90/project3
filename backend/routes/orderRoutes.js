const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
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
authMiddleware,
orderController.getOrders
);


// 📊 Delivery Dashboard
router.get(
"/delivery-dashboard",
authMiddleware,
orderController.deliveryDashboard
);

// 📜 Delivery History
router.get(
"/delivery-history/:id",
authMiddleware,
orderController.deliveryHistory
);

// 🚚 Delivery Boy Current Order
router.get(
"/delivery-boy/:id",
authMiddleware,
orderController.getDeliveryOrder
);

// Customer Orders
router.get(
  "/user/:email",
  orderController.getUserOrders
);

router.get(
  "/user/:email/:id",
  orderController.getUserOrderDetails
);


// Get Single Order
router.get(
"/:id",
authMiddleware,
orderController.getSingleOrder
);


// Update Status
router.put(
"/:id/status",
authMiddleware,
orderController.updateStatus
);


// Assign Delivery Boy
router.put(
"/:id/assign-delivery",
authMiddleware,
orderController.assignDelivery
);



// Cancel Order
router.put(
"/:id/cancel",
authMiddleware,
orderController.cancelOrder
);


// Delete Order
router.delete(
"/:id",
authMiddleware,
orderController.deleteOrder
);

module.exports = router;