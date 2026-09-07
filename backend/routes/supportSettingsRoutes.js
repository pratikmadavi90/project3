const express = require("express");
const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
  getSupportSettings,
  updateSupportSettings
} = require("../controllers/supportSettingsController");

router.get("/", getSupportSettings);

router.put(
  "/",
  authMiddleware,
  updateSupportSettings
);

module.exports = router;