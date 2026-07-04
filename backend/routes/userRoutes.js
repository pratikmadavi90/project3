const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// ================= GET ALL USERS =================
router.get("/", authMiddleware, userController.getUsers);

// ================= ADD USER =================
router.post("/", async (req, res) => {

  try {

    const existingUser =
      await User.findOne({
        email: req.body.email,
      });

    if (existingUser) {

      return res.json({
        message: "User already exists",
      });
    }

    // ✅ SIMPLE ADDRESS VALIDATION
    if (
      !req.body.address ||
      req.body.address.trim().length < 8
    ) {

      return res.status(400).json({
        message:
          "Please enter full address",
      });
    }

    // ✅ EMAIL CHECK
    if (!req.body.email) {

      return res.status(400).json({
        message: "Email required",
      });
    }

    const user = new User({

      name: req.body.name,

      email: req.body.email,

      phone: req.body.phone,

      // ✅ ADDRESS
      address: req.body.address,

      // ✅ FIXED CITY
      city: "Korpana",

      pincode: req.body.pincode,
    });

    await user.save();

    res.json({
      message: "User added successfully",
      user,
    });

  } catch (err) {

    console.log("ADD USER ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= UPDATE PROFILE =================
router.put("/update", async (req, res) => {

  try {

    const {
      email,
      name,
      phone,
      address,
      pincode,
    } = req.body;

    // ✅ EMAIL CHECK
    if (!email) {

      return res.status(400).json({
        message: "Email required",
      });
    }

    // ✅ SIMPLE ADDRESS VALIDATION
    if (
      !address ||
      address.trim().length < 8
    ) {

      return res.status(400).json({
        message:
          "Please enter full address",
      });
    }

    // ✅ CREATE OR UPDATE USER
let user = await User.findOne({ email });

if (!user) {
  user = await User.create({
    userId: "USR" + Date.now(),
    name,
    email,
    phone,
    address,
    city: "Korpana",
    pincode,
  });
} else {
  user.name = name;
  user.phone = phone;
  user.address = address;
  user.city = "Korpana";
  user.pincode = pincode;

  await user.save();
}

    res.json({
      message: "Profile updated",
      user,
    });

  } catch (err) {

    console.log(
      "UPDATE PROFILE ERROR:",
      err
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= BLOCK / UNBLOCK =================
router.put(
  "/block/:id",
  authMiddleware,
  userController.toggleBlockUser
);

// ================= DELETE USER =================
router.delete(
  "/:id",
  authMiddleware,
  userController.deleteUser
);

module.exports = router;