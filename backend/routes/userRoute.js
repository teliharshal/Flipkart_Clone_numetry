const express = require("express");
const { getAllUsers, addUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// Routes for managing users
router.get("/", getAllUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;