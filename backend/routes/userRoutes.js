const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const User = require("../models/User");

// ================= GET ALL USERS =================
router.get("/", userController.getUsers);

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

    // ✅ ADDRESS VALIDATION
    if (
      !req.body.address ||
      !req.body.address.includes(",")
    ) {
      return res.status(400).json({
        message:
          "Use format: Village Name, Landmark",
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

    // ✅ ADDRESS VALIDATION
    if (
      !address ||
      !address.includes(",")
    ) {
      return res.status(400).json({
        message:
          "Use format: Village Name, Landmark",
      });
    }

    const user =
      await User.findOneAndUpdate(

        { email },

        {
          name,
          phone,

          // ✅ ADDRESS
          address,

          // ✅ FIXED CITY
          city: "Korpana",

          pincode,
        },

        {
          new: true,
          upsert: true,
        }
      );

    res.json({
      message: "Profile updated",
      user,
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
});

// ================= BLOCK / UNBLOCK =================
router.put(
  "/block/:id",
  userController.toggleBlockUser
);

// ================= DELETE USER =================
router.delete(
  "/:id",
  userController.deleteUser
);

module.exports = router;