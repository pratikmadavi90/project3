const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const authMiddleware = require("../middleware/authMiddleware");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});


// ADD BANNER
router.post("/add-banner", authMiddleware, async (req, res) => {
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

    const section = req.query.section;

    let filter = {
      isActive: true
    };

    if (section) {
      filter.section = section;
    }

    const banners = await Banner.find(filter)
      .sort({ position: 1 });

    res.json(banners);

  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE BANNER
router.delete("/delete-banner/:id", authMiddleware, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    if (banner.image) {
      const key = banner.image.split(".amazonaws.com/")[1];

      if (key) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: "harzo-images-storage",
            Key: key
          })
        );
      }
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Banner + S3 Image Deleted ✅"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;