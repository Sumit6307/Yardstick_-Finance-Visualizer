import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';
import { useBudgets } from '../../contexts/BudgetsContext';
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

const BudgetComparisonChart = () => {
  const { comparison } = useBudgets();
  const { currentMonth, currentYear } = useDate();

  // Safely handle comparison data
  const safeComparison = Array.isArray(comparison) ? comparison : [];
  
  // Transform data for the chart with null checks
  const chartData = safeComparison.map(item => {
    try {
      return {
        name: item?.category?.name || 'Uncategorized',
        budget: item?.budget || 0,
        actual: item?.actual || 0,
        difference: item?.difference || 0
      };
    } catch (error) {
      console.error('Error processing budget comparison item', item, error);
      return {
        name: 'Error',
        budget: 0,
        actual: 0,
        difference: 0
      };
    }
  });

  return (
    <ChartContainer>
      <ChartTitle>
        Budget vs Actual - {currentMonth}/{currentYear}
      </ChartTitle>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
          <Legend />
          <Bar dataKey="budget" fill="#8884d8" name="Budget" />
          <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BudgetComparisonChart;