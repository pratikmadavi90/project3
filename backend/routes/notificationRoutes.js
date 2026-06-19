const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { sendNotification } =
require("../controllers/notificationController");

router.post(
  "/send",
  authMiddleware,
  sendNotification
);

module.exports = router;