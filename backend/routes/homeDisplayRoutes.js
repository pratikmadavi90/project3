const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const {
  getHomeDisplay,
  saveHomeDisplay,
  clearHomeDisplay,
  saveSingleBox,
} = require("../controllers/homeDisplayController");

// ================= S3 =================

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ================= Upload =================

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "harzo-images-storage",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);

      const fileName = file.originalname
        .replace(ext, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      cb(
        null,
        `home-display/${Date.now()}-${fileName}${ext.toLowerCase()}`
      );
    },
  }),
});

// ================= GET =================

router.get("/", getHomeDisplay);

// ================= SAVE =================

router.post(
  "/save",
  upload.any(),
  saveHomeDisplay
);

router.post(
  "/save-single",
  upload.any(),
  saveSingleBox
);

// ================= CLEAR =================

router.post(
  "/clear",
  clearHomeDisplay
);

module.exports = router;