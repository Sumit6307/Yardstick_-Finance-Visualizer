import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDate } from './DateContext';

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentMonth, currentYear } = useDate();

  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/transactions', { params });
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const { data } = await axios.post('/api/transactions', transaction);
      setTransactions([data, ...transactions]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const { data } = await axios.put(`/api/transactions/${id}`, updates);
      setTransactions(transactions.map(t => t._id === id ? data : t));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  useEffect(() => {
    fetchTransactions({ month: currentMonth, year: currentYear });
  }, [currentMonth, currentYear]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        error,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);