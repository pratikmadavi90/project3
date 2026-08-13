const express = require("express");

const router = express.Router();

const {
  getHomeDisplay,
  saveHomeDisplay,
  clearHomeDisplay,
} = require("../controllers/homeDisplayController");

// GET HOME DISPLAY
router.get("/", getHomeDisplay);

// CREATE / UPDATE HOME DISPLAY
router.post("/save", saveHomeDisplay);

// CLEAR ALL DATA
router.delete("/clear", clearHomeDisplay);

module.exports = router;