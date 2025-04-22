const express = require('express');
const router = express.Router();

const {
  getCustomers,
  updateCustomerStatus,
  addCustomer,
  deleteCustomer
} = require('../controllers/customerController');

// GET /api/customers
router.get('/', getCustomers);

// POST /api/customers
router.post('/', addCustomer);

// PUT /api/customers/:id/status
router.put('/:id/status', updateCustomerStatus);

// DELETE /api/customers/:id
router.delete('/:id', deleteCustomer);

module.exports = router;
