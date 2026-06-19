const express=
require("express");

const router=
express.Router();

const controller=
require(
"../controllers/deliveryBoyController"
);
const authMiddleware =
require("../middleware/authMiddleware");

// Add
router.post(
"/add",
authMiddleware,
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
authMiddleware,
controller.getAllDeliveryBoys
);

// Delete
router.delete(
"/delete/:id",
authMiddleware,
controller.deleteDeliveryBoy
);

// Update
router.put(
"/update/:id",
authMiddleware,
controller.updateDeliveryBoy
);

module.exports=
router;