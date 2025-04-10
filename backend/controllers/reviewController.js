const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    try {
      const { productName, userName, rating, comment } = req.body;
  
      if (!productName || !userName) {
        return res.status(400).json({ message: 'Product name and user name are required' });
      }
  
      const review = new Review({
        product: { name: productName },
        user: { name: userName },
        rating,
        comment,
        status: 'Pending',
      });
  
      await review.save();
  
      res.status(201).json(review);
    } catch (err) {
      console.error('Error creating review:', err.message);
      res.status(500).json({ message: 'Failed to create review' });
    }
  };
  

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('product').populate('user');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    review.status = req.body.status;
    await review.save();
    res.json({ message: 'Review status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

exports.respondToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    review.adminResponse = req.body.response;
    await review.save();
    res.json({ message: 'Response submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit response' });
  }
};
