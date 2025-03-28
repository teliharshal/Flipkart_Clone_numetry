const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import your User model

exports.isAuthenticatedUser = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Fetch user from DB

        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
};
