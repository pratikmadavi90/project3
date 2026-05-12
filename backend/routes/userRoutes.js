const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const User = require("../models/User");

// ================= GET ALL USERS =================
router.get("/", userController.getUsers);

// ================= ADD USER =================
router.post("/", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,        // ✅ ADD
      pincode: req.body.pincode,  // ✅ ADD
    });

    await user.save();

    res.json({
      message: "User added successfully",
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE PROFILE =================
router.put("/update", async (req, res) => {
  try {
    const { email, name, phone, address, city, pincode } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { name, phone, address, city, pincode }, // ✅ ADD
      { new: true, upsert: true }
    );

    res.json({
      message: "Profile updated",
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= BLOCK / UNBLOCK =================
router.put("/block/:id", userController.toggleBlockUser);

// ================= DELETE USER =================
router.delete("/:id", userController.deleteUser);

module.exports = router;