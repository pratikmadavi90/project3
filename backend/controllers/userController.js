const User = require("../models/User");

// GET all users
exports.getUsers = async (req, res) => {
  try {

    let users = await User.find()
      .sort({ createdAt: -1 });

    // old users ke liye auto userId
    for (const user of users) {

      if (!user.userId) {

        user.userId =
          "USR" +
          user.createdAt.getTime();

        await user.save();
      }
    }

    // refresh data
    users = await User.find()
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};

// BLOCK / UNBLOCK user
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: "User status updated",
      user
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "User deleted"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
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

    // existing user check
    let user = await User.findOne({
      email
    });

    // NEW USER
    if (!user) {

      const userId =
        "USR" + Date.now();

      user = await User.create({
        userId,
        name,
        phone,
        email,
        address,
        city,
        pincode
      });

    } else {

      // UPDATE OLD USER
      user.name = name;
      user.phone = phone;
      user.email = email;
      user.address = address;
      user.city = city;
      user.pincode = pincode;

      await user.save();
    }

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