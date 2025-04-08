const express = require("express");
const router = express.Router();
const {
  getAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin
} = require("../controllers/adminController");

router.get("/", getAdmins);
router.post("/", addAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin); // Assuming you have a deleteAdmin function

module.exports = router;
