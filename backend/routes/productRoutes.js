const express = require("express");
const router = express.Router();
const { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getProductAnalytics,
  getAllProducts // ✅ Ensure this function is imported
} = require("../controllers/productController");

router.post("/add", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/analytics", getProductAnalytics);
router.get("/", getAllProducts); // ✅ Add route to fetch all products

module.exports = router;
