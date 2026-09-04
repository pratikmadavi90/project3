const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// 💳 CREATE RAZORPAY ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {

    const { amount, userEmail } = req.body;

    const user = await User.findOne({
  email: userEmail
});

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found"
  });
}

if (user.isBlocked) {
  return res.status(403).json({
    success: false,
    message: "Your account has been blocked by admin"
  });
}

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount required",
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `HARZO_${Date.now()}`,
    });

    res.status(201).json({
      success: true,

      order: razorpayOrder,

      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {

    console.log("RAZORPAY CREATE ORDER ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
      error: err.message,
    });

  }
};



// 🔐 VERIFY RAZORPAY PAYMENT
exports.verifyRazorpayPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;


    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details missing",
      });
    }


    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          razorpay_order_id +
          "|" +
          razorpay_payment_id
        )
        .digest("hex");


    const isValid =
      generatedSignature === razorpay_signature;


    if (!isValid) {

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });

    }


    res.json({
      success: true,
      message: "Payment verified successfully",
      razorpay_order_id,
      razorpay_payment_id,
    });


  } catch (err) {

    console.log("RAZORPAY VERIFY ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: err.message,
    });

  }
};