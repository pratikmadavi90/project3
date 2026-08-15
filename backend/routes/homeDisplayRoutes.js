const express =
  require("express");

const router =
  express.Router();

const {
  getHomeDisplay,
  saveHomeDisplay,
  clearHomeDisplay,
} = require(
  "../controllers/homeDisplayController"
);

const upload =
  require(
    "../middleware/upload"
  );

// GET DATA

router.get(
  "/",
  getHomeDisplay
);

// SAVE DATA

router.post(
  "/save",
  upload.any(),
  saveHomeDisplay
);

// CLEAR DATA

router.post(
  "/clear",
  clearHomeDisplay
);

module.exports =
  router;