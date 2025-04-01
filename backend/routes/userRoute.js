const express = require("express");
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers); // Get all users
router.post("/", addUser); // Add a new user
router.put("/users/:id", updateUser);  // Edit user
router.delete("/:id", deleteUser); // Delete user

module.exports = router;
