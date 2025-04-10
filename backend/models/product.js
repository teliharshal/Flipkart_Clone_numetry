const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  price: Number,
  aiGenerated: {
    prompt: String,
    description: String
  }
});

module.exports = mongoose.model('Product', productSchema);
