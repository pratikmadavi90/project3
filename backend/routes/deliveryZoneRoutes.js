const express = require("express");
const router = express.Router();

const {
  addZone,
  getZones,
  deleteZone,
  checkDelivery,
  updateZone
} = require("../controllers/deliveryZoneController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add",
  authMiddleware,
  addZone
);

router.get("/all",
  getZones
);

router.delete("/delete/:id",
  authMiddleware,
  deleteZone
);

router.post("/check",
  checkDelivery
);

router.put(
  "/update/:id",
  authMiddleware,
  updateZone
);

module.exports = router;