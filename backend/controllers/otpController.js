const Otp = require("../models/Otp");

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number required",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await Otp.deleteMany({ phone });

    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(
        Date.now() + 5 * 60 * 1000
      ),
    });

    console.log("OTP:", otp);

    res.json({
      success: true,
      message: "OTP generated",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};