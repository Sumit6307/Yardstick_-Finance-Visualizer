import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { useTransactions } from '../../contexts/TransactionsContext';
import { useDate } from '../../contexts/DateContext';
import { getMonthName } from '../../utils/dateUtils';

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.boxShadow};
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const MonthlyExpensesChart = () => {
  const { transactions } = useTransactions();
  const { currentYear } = useDate();

  // Safely handle transactions data
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  // Group transactions by month with error handling
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    
    try {
      const monthTransactions = safeTransactions.filter(t => {
        // Skip if transaction is invalid
        if (!t || !t.date || !t.type) return false;
        
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() + 1 === month &&
          transactionDate.getFullYear() === currentYear &&
          t.type === 'expense'
        );
      });

      const total = monthTransactions.reduce((sum, t) => {
        const amount = Number(t.amount) || 0;
        return sum + amount;
      }, 0);
      
      return {
        month,
        name: getMonthName(month),
        total: parseFloat(total.toFixed(2))
      };
    } catch (error) {
      console.error('Error processing transactions for month', month, error);
      return {
        month,
        name: getMonthName(month),
        total: 0
      };
    }
  });

  return (
    <ChartContainer>
      <ChartTitle>Monthly Expenses - {currentYear}</ChartTitle>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, 'Total']} />
          <Bar dataKey="total" fill="#8884d8" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MonthlyExpensesChart;