const Admin = require("../models/Admin");

// GET all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// POST add new admin
exports.addAdmin = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailExists = await Admin.findOne({ email });
  if (emailExists) {
    return res.status(409).json({ error: "Email already exists" });
  }

  try {
    const newAdmin = new Admin({
      name,
      email,
      password,
      role,
      status: status || "Active", // Default to Active if not provided
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// PUT update status or role
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { status, role } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    if (status) admin.status = status;
    if (role) admin.role = role;

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// DELETE remove admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
