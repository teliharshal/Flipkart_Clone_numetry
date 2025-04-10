const express = require('express');
const router = express.Router();
const {
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
  respondToReview
} = require('../controllers/reviewController');


// Get all reviews
router.get('/', getAllReviews);

// Create a new review
router.post('/', createReview);

// Update review status
router.put('/:id/status', updateReviewStatus);

// Delete a review
router.delete('/:id', deleteReview);

// Respond to a review
router.post('/:id/respond', respondToReview);

module.exports = router;
