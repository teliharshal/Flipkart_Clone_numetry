const Product = require("../models/product");
const csv = require('csv-parser');
const fs = require("fs");
const multer = require("multer");

// ✅ Configure Multer for Image Upload
const upload = multer({ dest: "uploads/" });

// ✅ Add a product (with Image)
exports.addProduct = async (req, res) => {
    try {
        const { name, price, stock, category, imageUrl ,description,aiGeneratedPrompt} = req.body;
        const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : imageUrl;

        if (!name || !price || !stock || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newProduct = new Product({
            name,
            price,
            stock,
            category,
            image,
            description,
            createdAt: new Date(),
            aiGenerated: aiGeneratedPrompt ? {
                prompt: aiGeneratedPrompt.prompt,
                description: aiGeneratedPrompt.description
              } : null // ✅ Explicitly adding date (optional)
        });

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
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                await saveProductsToDatabase(results);
                res.status(200).json({ message: 'Products imported successfully', importedProducts: results.length });
            } catch (error) {
                console.error('❌ Error processing CSV:', error);
                res.status(500).send('Error importing products');
            }
        })
        .on('error', (error) => {
            console.error('❌ Error reading CSV:', error);
            res.status(500).send('Error reading CSV file');
        });
};

// ✅ Save products to database
const saveProductsToDatabase = async (products) => {
    try {
        for (let product of products) {
            await Product.create({
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category,
                image: product.image || null,
                createdAt: product.createdAt ? new Date(product.createdAt) : new Date()  // ✅ Handle date from CSV or add current date
            });
        }
        console.log('✅ Products saved to database.');
    } catch (error) {
        console.error('❌ Error saving products:', error);
        throw new Error('Database error');
    }
};


// ✅ Update a product (with Image)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body; // Accept imageUrl from body
        const updatedData = req.body;

        if (req.file) {
            updatedData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        } else if (imageUrl) {
            updatedData.image = imageUrl;
        }        

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "✅ Product updated", product: updatedProduct });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// ✅ Delete a single product
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

// ✅ Delete multiple selected products
exports.deleteMultipleProducts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: "No product IDs provided" });
        }

        const deletedProducts = await Product.deleteMany({ _id: { $in: ids } });

        if (deletedProducts.deletedCount === 0) {
            return res.status(404).json({ message: "No products found to delete" });
        }

        res.status(200).json({ message: `✅ Deleted ${deletedProducts.deletedCount} products` });
    } catch (error) {
        console.error("❌ Error deleting products:", error);
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
        const { search, category, stock, page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;
        const query = {};

        if (search) query.name = { $regex: search, $options: "i" };
        if (category) query.category = { $regex: category, $options: "i" };
        if (stock) query.stock = { $gte: parseInt(stock) };

        const products = await Product.find(query)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })  // ✅ Sorting by date
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        const totalProducts = await Product.countDocuments(query);

        res.json({ products, totalPages: Math.ceil(totalProducts / limit) });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

