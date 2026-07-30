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

// =====================
// Admin Analytics
// =====================

router.get(
  "/admin-dashboard",
  authMiddleware,
  controller.getAdminDashboard
);

router.get(
  "/top-performers",
  authMiddleware,
  controller.getTopPerformers
);

router.get(
  "/details/:deliveryBoyId",
  authMiddleware,
  controller.getDeliveryBoyDetails
);

router.get(
  "/weekly-chart",
  authMiddleware,
  controller.getWeeklyChart
);

router.get(
  "/monthly-earnings",
  authMiddleware,
  controller.getMonthlyEarnings
);

router.put(
  "/online-status",
  deliveryBoyAuth,
  deliveryBoyController.updateOnlineStatus
);

module.exports = router;