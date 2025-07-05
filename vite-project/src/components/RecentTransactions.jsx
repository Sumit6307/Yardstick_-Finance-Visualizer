import React from 'react';
import styled from 'styled-components';
import { useTransactions } from '../contexts/TransactionsContext';
import { formatDate, formatCurrency } from '../utils/dateUtils';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TransactionItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const TransactionCategory = styled.span`
  font-weight: 500;
`;

const TransactionAmount = styled.span`
  font-weight: 600;
  color: ${({ theme, type }) => type === 'income' ? theme.colors.secondary : theme.colors.danger};
`;

const RecentTransactions = () => {
  const { transactions } = useTransactions();

  // Safely handle transactions data
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  // Get most recent 5 transactions with error handling
  const recentTransactions = safeTransactions
    .slice(0, 5)
    .map(transaction => {
      try {
        return {
          ...transaction,
          categoryName: transaction.category?.name || 'Uncategorized',
          formattedDate: formatDate(transaction.date),
          formattedAmount: formatCurrency(transaction.amount),
          amountType: transaction.type
        };
      } catch (error) {
        console.error('Error processing transaction', transaction, error);
        return {
          _id: Math.random().toString(),
          categoryName: 'Error',
          formattedDate: 'Invalid Date',
          formattedAmount: '$0.00',
          amountType: 'expense',
          description: 'Error processing transaction'
        };
      }
    });

  return (
    <Container>
      <Title>Recent Transactions</Title>
      <TransactionList>
        {recentTransactions.map(transaction => (
          <TransactionItem key={transaction._id}>
            <TransactionInfo>
              <TransactionCategory>
                {transaction.categoryName}
              </TransactionCategory>
              <TransactionDate>
                {transaction.formattedDate} - {transaction.description}
              </TransactionDate>
            </TransactionInfo>
            <TransactionAmount type={transaction.amountType}>
              {transaction.amountType === 'expense' ? '-' : '+'}
              {transaction.formattedAmount}
            </TransactionAmount>
          </TransactionItem>
        ))}
      </TransactionList>
    </Container>
  );
};

export default RecentTransactions;