import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { useTransactions } from '../../contexts/TransactionsContext';
import { useDate } from '../../contexts/DateContext';

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

const CategoryPieChart = () => {
  const { transactions } = useTransactions();
  const { currentMonth, currentYear } = useDate();

  // Safely handle transactions data
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Process data with error handling
  const categoryData = safeTransactions
    .filter(t => {
      try {
        return (
          t && 
          t.type === 'expense' &&
          new Date(t.date).getMonth() + 1 === currentMonth &&
          new Date(t.date).getFullYear() === currentYear
        );
      } catch (error) {
        console.error('Error processing transaction', t, error);
        return false;
      }
    })
    .reduce((acc, t) => {
      try {
        const categoryId = t.category?._id || 'uncategorized';
        const categoryName = t.category?.name || 'Uncategorized';
        const categoryColor = t.category?.color || '#6b7280';
        
        const existing = acc.find(item => item.categoryId === categoryId);
        const amount = Number(t.amount) || 0;

        if (existing) {
          existing.total += amount;
        } else {
          acc.push({
            categoryId,
            name: categoryName,
            total: amount,
            color: categoryColor
          });
        }
        return acc;
      } catch (error) {
        console.error('Error aggregating transaction', t, error);
        return acc;
      }
    }, [])
    .map(item => ({
      ...item,
      total: parseFloat(item.total.toFixed(2))
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <ChartContainer>
      <ChartTitle>
        Category Breakdown - {currentMonth}/{currentYear}
      </ChartTitle>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={150}
            fill="#8884d8"
            dataKey="total"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default CategoryPieChart;