const User = require("../models/User");

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// BLOCK / UNBLOCK user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      city,
      pincode
    } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      {
        name,
        phone,
        email,
        address,
        city,
        pincode
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "User updated",
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};