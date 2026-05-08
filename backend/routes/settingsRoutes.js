const express = require("express");
const router = express.Router();

const {
  getSettings,
  updateSettings
} = require("../controllers/settingsController");

router.get("/", getSettings);
router.post("/update", updateSettings);

module.exports = router;