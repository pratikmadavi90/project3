const express = require("express");

const router = express.Router();

const paymentController =
  require("../controllers/paymentController");


// 💳 Create Razorpay Order
router.post(
  "/create-order",
  paymentController.createRazorpayOrder
);


// 🔐 Verify Razorpay Payment
router.post(
  "/verify",
  paymentController.verifyRazorpayPayment
);


module.exports = router;