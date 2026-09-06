const tokenBlacklistModel= require("../models/blacklist.model");

const jwt= require("jsonwebtoken");

async function authUser(req, res, next) {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });
        if (isTokenBlacklisted) {
            return res.status(401).json({ message: "Unauthorized: Token is invalid or expired" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
    }
}

module.exports= authUser;