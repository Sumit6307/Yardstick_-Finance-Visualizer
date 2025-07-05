import React from 'react';
import styled from 'styled-components';
import { useTransactions } from '../contexts/TransactionsContext';
import { useDate } from '../contexts/DateContext';
import { formatCurrency } from '../utils/dateUtils';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi';

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardValue = styled.p`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SummaryCards = () => {
  const { transactions = [] } = useTransactions(); // Add default empty array
  const { currentMonth, currentYear } = useDate();

  // Ensure transactions is always an array before filtering
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  // Calculate totals with null checks
  const monthlyTransactions = safeTransactions.filter(t => {
    try {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() + 1 === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    } catch (e) {
      console.error('Invalid transaction date', t.date, e);
      return false;
    }
  });

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netSavings = totalIncome - totalExpenses;
  const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome * 100) : 0;

  return (
    <CardsContainer>
      <Card>
        <CardTitle>
          <FiDollarSign /> Total Income
        </CardTitle>
        <CardValue style={{ color: '#10b981' }}>
          {formatCurrency(totalIncome)}
        </CardValue>
      </Card>

      <Card>
        <CardTitle>
          <FiTrendingDown /> Total Expenses
        </CardTitle>
        <CardValue style={{ color: '#ef4444' }}>
          {formatCurrency(totalExpenses)}
        </CardValue>
      </Card>

      <Card>
        <CardTitle>
          <FiTrendingUp /> Net Savings
        </CardTitle>
        <CardValue style={{ color: netSavings >= 0 ? '#10b981' : '#ef4444' }}>
          {formatCurrency(netSavings)}
        </CardValue>
      </Card>

      <Card>
        <CardTitle>
          <FiPieChart /> Expense Ratio
        </CardTitle>
        <CardValue>
          {expensePercentage.toFixed(1)}%
        </CardValue>
      </Card>
    </CardsContainer>
  );
};

export default SummaryCards;