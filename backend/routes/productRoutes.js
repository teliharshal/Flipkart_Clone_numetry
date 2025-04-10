const express = require("express");
const multer = require("multer");
const router = express.Router();
const productController = require("../controllers/productController");

// ✅ Setup Multer for Image & CSV Uploads
const upload = multer({ dest: "uploads/" });

// ✅ Product Routes
router.post("/add", upload.single("image"), productController.addProduct);  // Add product with image or URL
router.put("/update/:id", upload.single("image"), productController.updateProduct);  // Update product with image or URL
router.delete("/delete/:id", productController.deleteProduct);  // Delete single product
router.post("/delete-multiple", productController.deleteMultipleProducts);  // Delete multiple products
router.get("/", productController.getAllProducts);  // Fetch products with search & pagination
router.get("/analytics", productController.getProductAnalytics);  // Get analytics
router.post("/import", upload.single("file"), productController.importProducts);  // Bulk import from CSV

router.post("/api/generate-description", (req, res) => {
    const { title, category, keywords } = req.body;
  
    // Dummy description logic
    const description = `Introducing the ${title}, a premium choice in the ${category} category. Features include: ${keywords}. Designed to exceed expectations and deliver outstanding performance.`;
  
    res.json({ description });
  });
  

module.exports = router;
