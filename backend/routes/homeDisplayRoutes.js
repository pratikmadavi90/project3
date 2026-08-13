const express = require("express");

const router = express.Router();

const {
  getHomeDisplay,
  getSection,
  saveSection,
  deleteSection,
} = require("../controllers/homeDisplayController");

// GET ALL SECTIONS
router.get("/", getHomeDisplay);

// GET SINGLE SECTION
router.get("/:section", getSection);

// CREATE / UPDATE SECTION
router.post("/save", saveSection);

// DELETE SECTION
router.delete("/:id", deleteSection);

module.exports = router;