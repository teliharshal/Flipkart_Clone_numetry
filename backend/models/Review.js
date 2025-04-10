// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    name: { type: String, required: true },
  },
  user: {
    name: { type: String, required: true },
  },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  adminResponse: { type: String }
});

module.exports = mongoose.model('Review', reviewSchema);
