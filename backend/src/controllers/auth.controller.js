const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../middleware");

// Helper to sign JWT and set HTTP-only cookie
const sendAuthResponse = (res, user, statusCode, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(statusCode).json({
    message,
    user: { id: user._id, username: user.username, email: user.email },
    token,
  });
};

// 1. REGISTER - Create a new user
const registerController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  const existingUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    const isEmailDup = existingUser.email === email;
    return res.status(409).json({
      message: isEmailDup ? "User with this email already exists" : "Username is already taken",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  return sendAuthResponse(res, newUser, 201, "User registered successfully");
});

// 2. LOGIN - Log in an existing user
const loginUserController = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  return sendAuthResponse(res, user, 200, "Login successful");
});

// 3. LOGOUT - Log out the user
const logoutUserController = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
});

// 4. GET ME - Get the currently logged-in user's info
const getMeController = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ user });
});

module.exports = {
  registerController,
  loginUserController,
  logoutUserController,
  getMeController,
};

