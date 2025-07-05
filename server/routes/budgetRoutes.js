 const express = require('express');
const router = express.Router();
const {
  getBudgets,
  setBudget,
  deleteBudget,
  getBudgetComparison
} = require('../controllers/budgetController');

router.route('/')
  .get(getBudgets)
  .post(setBudget);

router.route('/:id')
  .delete(deleteBudget);

router.route('/comparison')
  .get(getBudgetComparison);

module.exports = router;