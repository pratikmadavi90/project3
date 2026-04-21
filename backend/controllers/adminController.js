const nodemailer = require("nodemailer");

let otpStore = {};

// ✅ SES transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 📩 SEND OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  // ✅ OPTIONAL: whitelist (sirf admin login)
 const allowedEmails = [
  "pratikmadavi11@gmail.com",
  "vaibhavturankar350@gmail.com",
  "madavip188@gmail.com",
  "pawanbomapalliwa9657@gmail.com",
  "jagdishthakare586@gmail.com"
]; 

  if (!allowedEmails.includes(email)) {
    return res.json({ success: false, message: "Not allowed" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  try {
   await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: email,
  subject: "HARZO Admin OTP",
  html: `
    <div style="font-family: Arial; padding: 20px;">
      <h2>HARZO Admin Login</h2>
      <p>Your OTP code is:</p>
      <h1 style="color: blue;">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <hr/>
      <small>Do not share this OTP with anyone.</small>
    </div>
  `
});

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "OTP failed" });
  }
};

// ✅ VERIFY OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.json({ success: false, message: "OTP expired or not found" });
  }

  if (otpStore[email].toString() !== otp.toString()) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  // OTP correct → delete
  delete otpStore[email];

  res.json({ success: true, message: "Login successful" });
};