const Customer = require('../models/customer');

exports.addCustomer = async (req, res) => {
    const { name, email, phone, status } = req.body;
  
    try {
      // Check if email already exists
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      const newCustomer = new Customer({
        name,
        email,
        phone,
        status: status || 'Active',
      });
  
      const savedCustomer = await newCustomer.save();
      res.status(201).json(savedCustomer);
    } catch (error) {
      res.status(500).json({ message: 'Error adding customer', error });
    }
  };

// @desc    Get all customers (with optional search and filter)
exports.getCustomers = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const customers = await Customer.find(query).sort({ created_at: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

// @desc    Update customer status
exports.updateCustomerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const customer = await Customer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer status', error });
  }
};


exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await Customer.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting customer', error });
    }
  };
