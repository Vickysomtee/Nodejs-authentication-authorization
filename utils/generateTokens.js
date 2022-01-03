require("dotenv").config();

const jwt = require("jsonwebtoken");
const redisClient = require("../redis_connect")

// Generate Access Token

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY
  });

    redisClient.set(user.id.toString(), JSON.stringify({token: refreshToken}))

  return refreshToken;
  
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
