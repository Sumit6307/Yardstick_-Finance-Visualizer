const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  userIp: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Ensure one budget per category per month per user
BudgetSchema.index({ category: 1, month: 1, year: 1, userIp: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);