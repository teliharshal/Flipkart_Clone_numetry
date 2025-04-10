const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers); // Get all users
router.post("/", createUser); // Add a new user
router.put("/users/:id", updateUser);  // Edit user
router.delete("/:id", deleteUser); // Delete user

module.exports = router;
