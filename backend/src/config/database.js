const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("Configuration Error: MONGO_URI environment variable is missing.");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("Configuration Error: JWT_SECRET environment variable is missing.");
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;