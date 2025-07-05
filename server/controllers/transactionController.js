const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const { getClientIp } = require('request-ip');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
exports.getTransactions = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { type, month, year, category } = req.query;
    
    let query = { userIp };
    
    if (type) query.type = type;
    if (month) query.date = { ...query.date, $month: parseInt(month) };
    if (year) query.date = { ...query.date, $year: parseInt(year) };
    if (category) query.category = category;
    
    const transactions = await Transaction.find(query)
      .populate('category')
      .sort({ date: -1 });
      
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Public
exports.addTransaction = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { amount, date, description, category, type } = req.body;
    
    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category not found' });
    }
    
    const transaction = new Transaction({
      amount,
      date: date || Date.now(),
      description,
      category,
      type: type || 'expense',
      userIp
    });
    
    await transaction.save();
    res.status(201).json(await transaction.populate('category'));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Public
exports.updateTransaction = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { id } = req.params;
    const { amount, date, description, category, type } = req.body;
    
    // Validate category exists if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ error: 'Category not found' });
      }
    }
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, userIp },
      { amount, date, description, category, type },
      { new: true }
    ).populate('category');
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Public
exports.deleteTransaction = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { id } = req.params;
    
    const transaction = await Transaction.findOneAndDelete({ _id: id, userIp });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};