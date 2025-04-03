const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }  // ✅ Auto add creation date
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
