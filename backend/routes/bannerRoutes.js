const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");

// ADD BANNER
router.post("/add-banner", async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET BANNERS
router.get("/banners", async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ position: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE BANNER
router.delete("/delete-banner/:id", async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;