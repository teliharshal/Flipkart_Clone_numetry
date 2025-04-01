const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Add a new user
router.post("/users", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ name, email, role });
    await newUser.save();
    
    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
});

// Edit user details
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
    res.json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
