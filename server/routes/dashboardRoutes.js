const express = require('express');
const router = express.Router();
const { getClientIp } = require('request-ip');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const userIp = getClientIp(req);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    // Total expenses this month
    const totalExpenses = await Transaction.aggregate([
      { 
        $match: { 
          userIp,
          type: 'expense',
          $expr: { 
            $and: [
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $eq: [{ $year: "$date" }, currentYear] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);
    
    // Category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { 
        $match: { 
          userIp,
          type: 'expense',
          $expr: { 
            $and: [
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $eq: [{ $year: "$date" }, currentYear] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    // Recent transactions
    const recentTransactions = await Transaction.find({ userIp })
      .populate('category')
      .sort({ date: -1 })
      .limit(5);
    
    res.json({
      totalExpenses: totalExpenses.length ? totalExpenses[0].total : 0,
      categoryBreakdown,
      recentTransactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;