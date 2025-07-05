const Budget = require('../models/Budget');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const { getClientIp } = require('request-ip');

// @desc    Get budgets for a specific month and year
// @route   GET /api/budgets
// @access  Public
exports.getBudgets = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }
    
    const budgets = await Budget.find({ 
      userIp,
      month: parseInt(month),
      year: parseInt(year)
    }).populate('category');
    
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Set a budget for a category
// @route   POST /api/budgets
// @access  Public
exports.setBudget = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { category, amount, month, year } = req.body;
    
    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category not found' });
    }
    
    let budget = await Budget.findOneAndUpdate(
      { category, month, year, userIp },
      { amount },
      { new: true, upsert: true }
    ).populate('category');
    
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Public
exports.deleteBudget = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { id } = req.params;
    
    const budget = await Budget.findOneAndDelete({ _id: id, userIp });
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get budget vs actual comparison
// @route   GET /api/budgets/comparison
// @access  Public
exports.getBudgetComparison = async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }
    
    // Get all budgets for this month/year
    const budgets = await Budget.find({ 
      userIp,
      month: parseInt(month),
      year: parseInt(year)
    }).populate('category');
    
    // Get actual spending per category
    const transactions = await Transaction.aggregate([
      { 
        $match: { 
          userIp,
          type: 'expense',
          $expr: { 
            $and: [
              { $eq: [{ $month: "$date" }, parseInt(month)] },
              { $eq: [{ $year: "$date" }, parseInt(year)] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);
    
    // Combine budget and actual data
    const comparison = budgets.map(budget => {
      const actual = transactions.find(t => t._id.equals(budget.category._id));
      return {
        category: budget.category,
        budget: budget.amount,
        actual: actual ? actual.total : 0,
        difference: budget.amount - (actual ? actual.total : 0)
      };
    });
    
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};