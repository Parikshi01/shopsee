const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const asyncHandler = require("../utils/asyncHandler");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "shopshee-secret", {
    expiresIn: "7d",
  });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email and password are required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: "Logged out. Remove token on client side." });
});

const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const makeAdmin = asyncHandler(async (req, res) => {
  const targetUser = await User.findById(req.params.userId);

  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  targetUser.role = "admin";
  await targetUser.save();

  const existing = await Admin.findOne({ user: targetUser._id });
  if (!existing) {
    await Admin.create({ user: targetUser._id });
  }

  res.json({ message: "User promoted to admin", userId: targetUser._id });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  makeAdmin,
};
