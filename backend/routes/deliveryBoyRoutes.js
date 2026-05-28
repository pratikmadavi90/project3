const express=
require("express");

const router=
express.Router();

const controller=
require(
"../controllers/deliveryBoyController"
);


// Add
router.post(
"/add",
controller.addDeliveryBoy
);


// Login
router.post(
"/login",
controller.loginDeliveryBoy
);

// Logout
router.put(
"/logout/:id",
controller.logoutDeliveryBoy
);


// Get All
router.get(
"/all",
controller.getAllDeliveryBoys
);


// Delete
router.delete(
"/delete/:id",
controller.deleteDeliveryBoy
);


// Update
router.put(
"/update/:id",
controller.updateDeliveryBoy
);

module.exports=
router;