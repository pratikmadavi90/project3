const Otp = require("../models/Otp");
const User = require("../models/User");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const sns = new SNSClient({
  region: "us-east-2",
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

    console.log("========== VERIFY OTP START ==========");
    console.log("REQ BODY:", req.body);

    const { phone, otp } = req.body;

    console.log("PHONE:", phone);
    console.log("OTP:", otp);

    // DB me us phone ke sab OTP dekho
    const allOtp = await Otp.find({ phone });
    console.log("DB OTP RECORDS:", JSON.stringify(allOtp, null, 2));

    // Exact OTP match
    const otpRecord = await Otp.findOne({ phone, otp });

    console.log("MATCHED OTP RECORD:", otpRecord);

    if (!otpRecord) {
      console.log("❌ OTP NOT FOUND");

      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    console.log("CURRENT TIME:", new Date());
    console.log("OTP EXPIRES:", otpRecord.expiresAt);

    if (otpRecord.expiresAt < new Date()) {
      console.log("❌ OTP EXPIRED");

      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    console.log("✅ OTP VERIFIED");

    let user = await User.findOne({ phone });

    console.log("EXISTING USER:", user);

    if (!user) {

      console.log("CREATING NEW USER...");

      user = await User.create({
        userId: "USR" + Date.now(),
        name: "New User",
        phone
      });

      console.log("NEW USER CREATED:", user);
    }

    await Otp.deleteMany({ phone });

    console.log("OTP DELETED");

    console.log("✅ LOGIN SUCCESS");
    console.log("========== VERIFY OTP END ==========");

    res.json({
      success: true,
      message: "Login Successful",
      user
    });

  } catch (err) {

    console.log("🚨 VERIFY OTP ERROR 🚨");
    console.log(err);
    console.log(err.message);
    console.log(err.stack);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};