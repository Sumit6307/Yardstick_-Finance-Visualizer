import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useBudgets } from '../contexts/BudgetsContext';
import { useCategories } from '../contexts/CategoriesContext';
import { useDate } from '../contexts/DateContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BudgetForm = ({ budget, onClose }) => {
  const { setBudget } = useBudgets();
  const { categories } = useCategories();
  const { currentMonth, currentYear } = useDate();

  // Safely handle categories data
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [formData, setFormData] = useState({
    category: safeCategories[0]?._id || '',
    amount: ''
  });

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category?._id || safeCategories[0]?._id || '',
        amount: budget.amount?.toString() || ''
      });
    }
  }, [budget, safeCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await setBudget({
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      month: currentMonth,
      year: currentYear
    });
    onClose();
  };

  return (
    <Modal 
      title={budget ? 'Edit Budget' : 'Set Budget'} 
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <FormContainer>
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {safeCategories.length > 0 ? (
              safeCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No categories available</option>
            )}
          </Select>

          <Input
            type="number"
            label="Amount"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          <Button type="submit" variant="primary">
            {budget ? 'Update' : 'Set'} Budget
          </Button>
        </FormContainer>
      </form>
    </Modal>
  );
};

export default BudgetForm;