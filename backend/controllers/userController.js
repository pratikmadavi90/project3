const User = require("../models/User");
const DeliveryZone = require("../models/DeliveryZone");

// GET all users
exports.getUsers = async (req, res) => {
  try {

    let users = await User.find()
      .sort({ createdAt: -1 });

    for (const user of users) {

      if (!user.userId) {

        user.userId =
          "USR" +
          user.createdAt.getTime();

        await user.save();
      }
    }

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

    // DELIVERY ZONE CHECK
//     const zoneExists = await DeliveryZone.findOne({
//       area: {
//         $regex: new RegExp(`^${city}$`, "i")
//       }
//     });

// if (!zoneExists) {
//   return res.status(400).json({
//     success: false,
//     message: "Delivery not available in this area"
//   });
// }

// YAHAN PASTE KARO 👇
const zoneExists = true;
const existingUser = await User.findOne({ email });

// if (
//   existingUser &&
//   existingUser.city &&
//   existingUser.city.toLowerCase() !== city.toLowerCase()
// ) {
//   return res.status(403).json({
//     success: false,
//     forceLogout: true,
//     message: "Location no longer available"
//   });
// }

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

if (
  existingUser &&
  existingUser.city &&
  !zoneExists
) {
  return res.status(403).json({
    success: false,
    forceLogout: true,
    message: "Location removed by admin"
  });
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