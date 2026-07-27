const Staff = require("../models/Staff");

const generateStaffId = async (name, phone) => {
  // First name lowercase
  const firstName = name
    .trim()
    .split(" ")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const staffId = `${firstName}@${phone}`;

  // Check duplicate
  const exists = await Staff.findOne({ staffId });

  if (exists) {
    throw new Error("Staff ID already exists. Phone number must be unique.");
  }

  return staffId;
};

module.exports = generateStaffId;