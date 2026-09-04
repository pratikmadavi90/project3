const express = require("express");
const router = express.Router();

const { sendOtp } = require("../controllers/otpController");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "OTP Route Working"
  });
});

router.post("/send-otp", sendOtp);

module.exports = router;