require("dotenv").config();
const User = require("../models/users");
const generateId = require("../utils/userID");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redisClient = require("../redis_connect");

// User Registration Logic

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "Email Already Exists" });

  try {

    // Generate User ID
    const id = generateId(name);

    const newUser = await User.create({
      id,
      name,
      email,
      password,
    });

    // Generate Access and Refresh Token
    const accessToken = generateAccessToken({ id: newUser.id });
    const refreshToken = generateRefreshToken({ id: newUser.id });

    res
      .header("auth-token", accessToken)
      .status(200)
      .json({
        message: "Succesfully Registered",
        data: newUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// User Login Logic

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email does not exist" });

  //Compare passwords
  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword)
    return res.status(405).json({ message: "Incorrect Password" });

  try {
    // Generate Access and Refresh Token
    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });
    res
      .header("auth-token", accessToken)
      .status(200)
      .json({ message: "Succesfully Logged in", accessToken, refreshToken });
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error);
  }
};

// Generate a new refresh token

exports.getAccessToken = (req, res, next) => {
  const user = req.user.id;

  const accessToken = generateAccessToken({ id: user });
  const refreshToken = generateRefreshToken({ id: user });
  res
    .header("auth-token", accessToken)
    .status(200)
    .json({ message: "Succesfully Logged in", accessToken, refreshToken });
};

//User logout logic
exports.logout = async (req, res, next) => {
  const user = req.user.id;
  const token = req.token

  //Delete refresh token from redis
  await redisClient.del(user.toString());

  // Blacklist the refresh token 
  await redisClient.set(`bl_${user.toString()}`, token);

  res.status(200).json({ message: "Succesfully Logged Out" });
};
