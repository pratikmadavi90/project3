const User = require("../models/User");
const Session = require("../models/Session");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// 🔐 LOGIN FUNCTION
const loginUser = async (email, password, req) => {
  // 1. user check
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // 2. password check
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  // 3. token generate
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 4. session create
  await Session.create({
    userId: user._id,
    device: req.headers["user-agent"],
    ip: req.ip,
    refreshToken: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user,
  };
};

module.exports = {
  loginUser,
};
