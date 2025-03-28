const Product = require("../models/product");

// ✅ Add a product
exports.addProduct = async (req, res) => {
    try {
      const { name, price, stock, category } = req.body;
      if (!name || !price || !stock || !category) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const newProduct = new Product({ name, price, stock, category });
      await newProduct.save();
      res.status(201).json({ message: "✅ Product added successfully", product: newProduct });
    } catch (error) {
      console.error("❌ Error adding product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // ✅ Update a product
  exports.updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ message: "✅ Product updated", product: updatedProduct });
    } catch (error) {
      console.error("❌ Error updating product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // ✅ Delete a product
  exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ message: "✅ Product deleted" });
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  // ✅ Fetch analytics
  exports.getProductAnalytics = async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
      
      const totalStock = await Product.aggregate([
        { $group: { _id: null, totalStock: { $sum: "$stock" } } }
      ]);
  
      const totalStockValue = totalStock.length ? totalStock[0].totalStock : 0;
  
      const categoryCounts = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]);
  
      res.json({ totalProducts, totalStock: totalStockValue, categoryCounts });
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


// ✅ Fetch all products
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(); // Fetch all products from DB
      res.status(200).json(products);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };