const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);

module.exports = router;
