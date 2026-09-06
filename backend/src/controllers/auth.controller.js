const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 1. REGISTER - Create a new user
const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password (so it's not stored as plain text)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // Create a JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Send token in a cookie
        res.cookie("token", token, { 
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(201).json({ 
            message: "User registered successfully", 
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            token 
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// 2. LOGIN - Log in an existing user
const loginUserConroller = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare the entered password with the hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // Send token in a cookie
        res.cookie("token", token, { 
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({ 
            message: "Login successful", 
            user: { id: user._id, username: user.username, email: user.email },
            token 
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// 3. LOGOUT - Log out the user
const logoutUserConroller = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: "No token found" });
        }

        // Add token to blacklist so it can't be used again
        await tokenBlacklistModel.create({ token });

        // Clear the cookie from browser
        res.clearCookie("token");

        return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


// 4. GET ME - Get the currently logged-in user's info
const getMeController = async (req, res) => {
    try {
        // req.user is set by the auth middleware (it has the decoded token)
        const user = await userModel.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};


module.exports = {
    registerController,
    loginUserConroller,
    logoutUserConroller,
    getMeController,
};
