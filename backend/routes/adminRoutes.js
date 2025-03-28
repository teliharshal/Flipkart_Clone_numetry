const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// Route to fetch total number of products
router.get("/total-products", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.status(200).json({ totalProducts });
  } catch (error) {
    console.error("Error fetching total products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
