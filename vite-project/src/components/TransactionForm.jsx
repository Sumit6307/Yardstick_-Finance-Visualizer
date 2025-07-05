import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransactions } from '../contexts/TransactionsContext';
import { useCategories } from '../contexts/CategoriesContext';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TransactionForm = ({ transaction, onClose }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const { categories } = useCategories();

  // Safely handle categories data
  const safeCategories = Array.isArray(categories) ? categories : [];

  const [formData, setFormData] = useState({
    amount: '',
    date: new Date(),
    description: '',
    category: safeCategories[0]?._id || '',
    type: 'expense'
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount?.toString() || '',
        date: transaction.date ? new Date(transaction.date) : new Date(),
        description: transaction.description || '',
        category: transaction.category?._id || safeCategories[0]?._id || '',
        type: transaction.type || 'expense'
      });
    }
  }, [transaction, safeCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      date: formData.date.toISOString()
    };

    if (transaction) {
      await updateTransaction(transaction._id, data);
    } else {
      await addTransaction(data);
    }
    onClose();
  };

  return (
    <Modal 
      title={transaction ? 'Edit Transaction' : 'Add Transaction'} 
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <FormContainer>
          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>

          <Input
            type="number"
            label="Amount"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          <div>
            <label>Date</label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
              dateFormat="MMMM d, yyyy"
              className="date-picker-input"
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

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

          <Button type="submit" variant="primary">
            {transaction ? 'Update' : 'Add'} Transaction
          </Button>
        </FormContainer>
      </form>
    </Modal>
  );
};

export default TransactionForm;