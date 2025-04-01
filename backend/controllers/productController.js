const Product = require("../models/product");
const csv = require('csv-parser');
const fs = require("fs");

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

// ✅ Bulk Product Import from CSV
exports.importProducts = (req, res) => {
    const results = [];
    const file = req.file;  // Assuming you're using Multer for file upload
  
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data)) // Collect the CSV rows
        .on('end', async () => {
            try {
                // Process the data after parsing
                // Assuming you have a function to save these products to the database
                await saveProductsToDatabase(results); // Make sure this function is defined

                // Only send a response once the CSV data is processed
                res.status(200).json({
                    message: 'Products imported successfully',
                    importedProducts: results.length,
                });
            } catch (error) {
                // If any error occurs during processing or saving to DB
                console.error('Error processing CSV data:', error);
                res.status(500).send('Error importing products');
            }
        })
        .on('error', (error) => {
            // Handle file parsing errors
            console.error('Error reading CSV file:', error);
            res.status(500).send('Error reading CSV file');
        });
};

// ✅ Save products to database
const saveProductsToDatabase = async (products) => {
    try {
        for (let product of products) {
            // Example: Insert each product into the 'products' collection in MongoDB
            await Product.create({
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category,
                // Add other product fields here
            });
        }
        console.log('Products saved to database.');
    } catch (error) {
        console.error('Error saving products to database:', error);
        throw new Error('Database saving error');
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

// ✅ Fetch all products with Search, Filters, and Pagination
exports.getAllProducts = async (req, res) => {
    try {
        const { search, category, stock, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) query.name = { $regex: search, $options: "i" };
        if (category) query.category = { $regex: category, $options: "i" };
        if (stock) query.stock = { $gte: parseInt(stock) };

        const products = await Product.find(query)
            .limit(limit)
            .skip((page - 1) * limit);

        const totalProducts = await Product.countDocuments(query);

        res.json({ products, totalPages: Math.ceil(totalProducts / limit) });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
