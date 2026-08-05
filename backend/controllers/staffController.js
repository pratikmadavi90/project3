const Staff = require("../models/Staff");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateStaffId = require("../utils/staffIdGenerator");

// =======================
// ADD STAFF
// =======================

exports.addStaff = async (req, res) => {
  try {
    const { name, phone, password, status } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone and Password are required."
      });
    }

    const phoneExists = await Staff.findOne({ phone });

    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists."
      });
    }

    const staffId = await generateStaffId(name, phone);

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name,
      phone,
      staffId,
      password: hashedPassword,
      status
    });

    res.status(201).json({
      success: true,
      message: "Staff added successfully.",
      staff
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};


// =======================
// STAFF LOGIN
// =======================

exports.loginStaff = async (req, res) => {

 console.log("===== STAFF LOGIN API HIT =====");
console.log(req.body);

  try {

    const { staffId, password } = req.body;

    const staff = await Staff.findOne({ staffId });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found."
      });
    }

    const match = await bcrypt.compare(
      password,
      staff.password
    );

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid password."
      });
    }

    if (staff.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Staff account inactive."
      });
    }

    staff.isOnline = true;
    staff.lastLogin = new Date();

    await staff.save();

    const token = jwt.sign(
      {
        id: staff._id,
        staffId: staff.staffId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d"
      }
    );

    res.json({
      success: true,
      message: "Login successful.",
      token,
      staff
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// STAFF LOGOUT
// =======================

exports.logoutStaff = async (req, res) => {

  try {

    const staff = await Staff.findById(req.staff._id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found."
      });
    }

    staff.isOnline = false;
    staff.lastLogout = new Date();

    await staff.save();

    res.json({
      success: true,
      message: "Logout successful."
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// GET ALL STAFF
// =======================

exports.getAllStaff = async (req, res) => {

  try {

    const staff = await Staff.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: staff.length,
      staff
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// GET SINGLE STAFF
// =======================

exports.getStaffById = async (req, res) => {

  try {

    const staff = await Staff.findById(req.params.id)
      .select("-password");

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found."
      });
    }

    res.json({
      success: true,
      staff
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// UPDATE STAFF
// =======================

exports.updateStaff = async (req, res) => {

  try {

    const { name, phone, password, status } = req.body;

    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found."
      });
    }

    if (name) staff.name = name;

    if (phone) staff.phone = phone;

    if (status) staff.status = status;

    if (password) {
      staff.password = await bcrypt.hash(password, 10);
    }

    await staff.save();

    res.json({
      success: true,
      message: "Staff updated successfully.",
      staff
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// DELETE STAFF
// =======================

exports.deleteStaff = async (req, res) => {

  try {

    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found."
      });
    }

    res.json({
      success: true,
      message: "Staff deleted successfully."
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// STAFF DASHBOARD
// =======================

exports.staffDashboard = async (req, res) => {

  try {

    const staffId = req.staff.staffId;

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);

const pendingOrders = await Order.find({
  staffId: req.staff.staffId,
  status: {
    $in: [
      "Accepted",
      "Packing"
    ]
  }
}).sort({ createdAt: 1 });

    const packedToday = await Order.countDocuments({
      staffId,
      packedAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    const totalPacked = await Order.countDocuments({
      staffId,
      status: {
        $in: [
          "Packed",
          "Handed Over",
          "Out for Delivery",
          "Delivered"
        ]
      }
    });

    res.json({
      success: true,
      pendingOrders,
      todayPacking: packedToday,
      totalPacking: totalPacked
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// TODAY PACKING
// =======================

exports.todayPacking = async (req, res) => {

  try {

    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);

    const orders = await Order.find({

      staffId: req.staff.staffId,

      packedAt: {
        $gte: todayStart,
        $lte: todayEnd
      }

    }).sort({ packedAt: -1 });

    res.json({
      success: true,
      total: orders.length,
      orders
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// MONTHLY PACKING
// =======================

exports.monthlyPacking = async (req, res) => {

  try {

    const now = new Date();

    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const end = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const orders = await Order.find({

      staffId: req.staff.staffId,

      packedAt: {
        $gte: start,
        $lte: end
      }

    }).sort({ packedAt: -1 });

    res.json({
      success: true,
      total: orders.length,
      orders
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


// =======================
// PACKING HISTORY
// =======================

exports.packingHistory = async (req, res) => {

  try {

    const orders = await Order.find({

      staffId: req.staff.staffId,

      status: {
        $in: [
          "Packed",
          "Handed Over",
          "Out for Delivery",
          "Delivered"
        ]
      }

    }).sort({
      packedAt: -1
    });

    res.json({
      success: true,
      total: orders.length,
      orders
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};


exports.toggleAvailability = async (req, res) => {
  try {

    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.json({
        success: false,
        message: "Staff not found"
      });
    }

    staff.available = !staff.available;

    await staff.save();

    res.json({
      success: true,
      message: staff.available
        ? "Staff Available"
        : "Staff Unavailable"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};