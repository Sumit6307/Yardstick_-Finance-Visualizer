import React from 'react';
import styled from 'styled-components';
import { useTransactions } from '../contexts/TransactionsContext';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ListContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.background};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
`;

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: ${({ color }) => color}20;
  color: ${({ color }) => color};
  font-size: 0.875rem;
`;

const AmountCell = styled.td`
  padding: 1rem;
  text-align: right;
  font-weight: 600;
  color: ${({ theme, type }) => 
    type === 'income' ? theme.colors.secondary : theme.colors.danger};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  margin-left: 0.5rem;
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TransactionList = ({ onEdit }) => {
  const { transactions, deleteTransaction } = useTransactions();

  // Safely handle transactions data
  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  // Process transactions with error handling
  const processedTransactions = safeTransactions.map(transaction => {
    try {
      return {
        ...transaction,
        categoryName: transaction.category?.name || 'Uncategorized',
        categoryColor: transaction.category?.color || '#6b7280',
        formattedDate: formatDate(transaction.date),
        formattedAmount: formatCurrency(transaction.amount || 0),
        amountType: transaction.type || 'expense'
      };
    } catch (error) {
      console.error('Error processing transaction', transaction, error);
      return {
        _id: Math.random().toString(),
        categoryName: 'Error',
        categoryColor: '#6b7280',
        formattedDate: 'Invalid Date',
        formattedAmount: '$0.00',
        amountType: 'expense',
        description: 'Error processing transaction'
      };
    }
  });

  return (
    <ListContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {processedTransactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell>{transaction.formattedDate}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <CategoryBadge color={transaction.categoryColor}>
                  {transaction.categoryName}
                </CategoryBadge>
              </TableCell>
              <AmountCell type={transaction.amountType}>
                {transaction.amountType === 'income' ? '+' : '-'}
                {transaction.formattedAmount}
              </AmountCell>
              <TableCell>
                <ActionButton onClick={() => onEdit(transaction)}>
                  <FiEdit />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(transaction._id)}>
                  <FiTrash2 />
                </ActionButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ListContainer>
  );
};

export default TransactionList;