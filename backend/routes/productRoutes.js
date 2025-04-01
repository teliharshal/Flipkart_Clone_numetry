const express = require("express");
const multer = require("multer");
const router = express.Router();
const productController = require("../controllers/productController");

// Setup Multer for CSV Upload
const upload = multer({ dest: "uploads/" });

router.post("/add", productController.addProduct);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.get("/", productController.getAllProducts);
router.get("/analytics", productController.getProductAnalytics);
router.post("/import", upload.single("file"), productController.importProducts);

module.exports = router;
