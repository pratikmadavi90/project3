const express = require("express");
const router = express.Router();

const {
  addZone,
  getZones,
  deleteZone,
  checkDelivery
} = require("../controllers/deliveryZoneController");

// ✅ Add new delivery zone
router.post("/add", addZone);

// ✅ Get all zones
router.get("/all", getZones);

// ✅ Delete zone
router.delete("/delete/:id", deleteZone);

// ✅ Check delivery availability
router.post("/check", checkDelivery);

module.exports = router;