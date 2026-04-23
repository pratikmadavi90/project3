require("dotenv").config();


const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3");
const bannerRoutes = require("./routes/bannerRoutes");

const app = express(); // ✅ PEHLE APP BANAA

app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://localhost:3000",
    "https://admin.harzo.in"
  ]
}));

// ✅ FIR USE KAR
app.use("/admin", express.static(path.join(__dirname, "../admin")));
app.use("/user", express.static(path.join(__dirname, "../user")));

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");


const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// multer S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "harzo-images-storage",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    }
  })
});

// upload route
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Upload failed" });
    }

    res.json({
      imageUrl: req.file.location
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================== SES CONFIG ==================
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json());
app.use("/", bannerRoutes);

// ================== STATIC FILES ==================
app.use("/admin", express.static(path.join(__dirname, "../admin")));
app.use("/user", express.static(path.join(__dirname, "../user")));

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.send("Harzo API running 🚀");
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin/pages/products.html"));
});

// ================= OTP SYSTEM =================

const otpStore = {};

// Generate OTP (6 digit)
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP using AWS SES
async function sendOTP(email, otp) {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "HARZO Admin Login OTP",
      },
      Body: {
        Text: {
          Data: `Your OTP is: ${otp}`,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log("OTP sent:", otp);
  } catch (err) {
    console.error("OTP send error:", err);
    throw err; // important
  }
}

// ADMIN SEND OTP
app.post("/api/admin/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const allowed = process.env.ADMIN_EMAILS.split(",");

  if (!allowed.includes(email)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const otp = generateOTP();

  otpStore[email] = {
    otp,
    expires: Date.now() + 2 * 60 * 1000, // 2 min
  };

  try {
    await sendOTP(email, otp);
    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ===== USER SEND OTP =====
app.post("/api/user/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email required" });
    }

    const otp = generateOTP();

    otpStore[email] = {
        otp,
        expires: Date.now() + 2 * 60 * 1000
    };

    try {
        await sendOTP(email, otp); // 🔥 same SES function
        res.json({ message: "OTP sent" });
    } catch (err) {
        res.status(500).json({ message: "Failed to send OTP" });
    }
});



// ADMIN VERIFY OTP
app.post("/api/admin/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const data = otpStore[email];

  // Owner bypass 🔥
  if (
    email === process.env.OWNER_EMAIL &&
    otp === process.env.OWNER_PASSWORD
  ) {
    return res.json({ message: "Login success (OWNER)" });
  }

  if (!data) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (Date.now() > data.expires) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (data.otp !== otp) {
    return res.status(400).json({ message: "Wrong OTP" });
  }

  delete otpStore[email];

  res.json({ message: "Login success" });
});

// ===== USER VERIFY OTP =====
app.post("/api/user/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore[email];

    if (!record) {
        return res.json({ message: "OTP not found" });
    }

    if (record.expires < Date.now()) {
        return res.json({ message: "OTP expired" });
    }

    if (record.otp != otp) {
        return res.json({ message: "Invalid OTP" });
    }

    delete otpStore[email];

    res.json({ message: "OTP verified" });
});

// ================== ROUTES ==================
const dashboardRoutes = require("./routes/dashboardRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);


// ================= SIGNUP API =================
app.post("/api/signup", (req, res) => {
    const { name, email, password } = req.body;

    if (!global.users) global.users = [];

    const userExists = global.users.find(u => u.email === email);

    if (userExists) {
        return res.json({ message: "User already exists" });
    }

    global.users.push({ name, email, password });

    res.json({ message: "Signup successful" });
});


// ===== VERIFY OTP =====
app.post("/api/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] == otp) {
        delete otpStore[email];
        return res.json({ message: "OTP verified" });
    }

    res.json({ message: "Invalid OTP" });
});

// ===== LOGIN API =====
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!global.users) global.users = [];

    const user = global.users.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return res.json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful" });
});



// ================== DATABASE ==================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================== SERVER ==================
const PORT = process.env.PORT || 5000;



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});