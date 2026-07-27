const express = require("express");
const router = express.Router();

const staffController = require("../controllers/staffController");
const staffAuth = require("../middleware/staffAuth");
const authMiddleware = require("../middleware/authMiddleware");


// =======================
// LOGIN
// =======================

router.post(
  "/login",
  staffController.loginStaff
);


// =======================
// LOGOUT
// =======================

router.post(
  "/logout",
  staffAuth,
  staffController.logoutStaff
);


// =======================
// ADD STAFF (Admin)
// =======================

router.post(
  "/add",
  authMiddleware,
  staffController.addStaff
);


// =======================
// GET ALL STAFF
// =======================

router.get(
  "/all",
  authMiddleware,
  staffController.getAllStaff
);


// =======================
// STAFF DASHBOARD
// =======================

router.get(
  "/dashboard",
  staffAuth,
  staffController.staffDashboard
);


// =======================
// TODAY PACKING
// =======================

router.get(
  "/today-packing",
  staffAuth,
  staffController.todayPacking
);


// =======================
// MONTHLY PACKING
// =======================

router.get(
  "/monthly-packing",
  staffAuth,
  staffController.monthlyPacking
);


// =======================
// PACKING HISTORY
// =======================

router.get(
  "/packing-history",
  staffAuth,
  staffController.packingHistory
);


// =======================
// GET SINGLE STAFF
// =======================

router.get(
  "/:id",
  authMiddleware,
  staffController.getStaffById
);


// =======================
// UPDATE STAFF
// =======================

router.put(
  "/:id",
  authMiddleware,
  staffController.updateStaff
);


// =======================
// DELETE STAFF
// =======================

router.delete(
  "/:id",
  authMiddleware,
  staffController.deleteStaff
);

module.exports = router;