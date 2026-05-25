const express =
require("express");

const router =
express.Router();

const controller =
require(
"../controllers/deliveryAuthController"
);


// Login
router.post(
"/login",
controller.loginDeliveryBoy
);


// Logout
router.post(
"/logout",
controller.logoutDeliveryBoy
);

module.exports =
router;