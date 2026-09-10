const Otp = require("../models/Otp");
const User = require("../models/User");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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

await sns.send(
  new PublishCommand({
    Message: `Your HARZO OTP is ${otp}`,
    PhoneNumber: `+91${phone}`,
  })
);

console.log("SNS RESULT:", result);

    res.json({
      success: true,
      message: "OTP generated",
    });

  } catch (err) {

  console.log("SNS ERROR:", err);


    res.status(500).json({
      success: false,
      error: err.message,
    });

  }
};




exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const otpRecord = await Otp.findOne({ phone, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        userId: "USR" + Date.now(),
        name: "New User",
        phone
      });
    }

    await Otp.deleteMany({ phone });

    res.json({
      success: true,
      message: "Login Successful",
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};