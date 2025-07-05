import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDate } from './DateContext';

const BudgetsContext = createContext();

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparison, setComparison] = useState([]);
  const { currentMonth, currentYear } = useDate();

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/budgets', {
        params: { month: currentMonth, year: currentYear }
      });
      setBudgets(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetComparison = async () => {
    try {
      const { data } = await axios.get('/api/budgets/comparison', {
        params: { month: currentMonth, year: currentYear }
      });
      setComparison(data);
    } catch (err) {
      console.error('Failed to fetch budget comparison:', err);
    }
  };

  const setBudget = async (budgetData) => {
    try {
      const { data } = await axios.post('/api/budgets', {
        ...budgetData,
        month: currentMonth,
        year: currentYear
      });
      
      setBudgets(prev => {
        const existing = prev.find(b => b._id === data._id);
        return existing 
          ? prev.map(b => b._id === data._id ? data : b)
          : [...prev, data];
      });
      
      return { success: true, budget: data };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`/api/budgets/${id}`);
      setBudgets(budgets.filter(b => b._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || err.message };
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchBudgetComparison();
  }, [currentMonth, currentYear]);

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        comparison,
        loading,
        error,
        fetchBudgets,
        setBudget,
        deleteBudget,
        fetchBudgetComparison
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
};

export const useBudgets = () => useContext(BudgetsContext);