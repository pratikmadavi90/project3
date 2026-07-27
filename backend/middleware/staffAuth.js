const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");

const staffAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const staff = await Staff.findById(decoded.id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found.",
      });
    }

    if (staff.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: "Staff account is inactive.",
      });
    }

    req.staff = staff;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = staffAuth;