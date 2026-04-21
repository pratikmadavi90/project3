const jwt = require("jsonwebtoken");

// Access Token (short time)
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m", // short expiry
    }
  );
};

// Refresh Token (long time)
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d", // long expiry
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
