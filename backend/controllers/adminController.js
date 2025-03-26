const User = require("../models/userModel");

// Fetch all users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a user (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};
