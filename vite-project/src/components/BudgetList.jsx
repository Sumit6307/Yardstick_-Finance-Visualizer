import React from 'react';
import styled from 'styled-components';
import { useBudgets } from '../contexts/BudgetsContext';
import { formatCurrency } from '../utils/dateUtils';
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

const BudgetList = ({ onEdit }) => {
  const { budgets, deleteBudget } = useBudgets();

  // Safely handle budgets data
  const safeBudgets = Array.isArray(budgets) ? budgets : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  // Process budgets with error handling
  const processedBudgets = safeBudgets.map(budget => {
    try {
      return {
        ...budget,
        categoryName: budget.category?.name || 'Uncategorized',
        categoryColor: budget.category?.color || '#6b7280',
        formattedAmount: formatCurrency(budget.amount || 0)
      };
    } catch (error) {
      console.error('Error processing budget', budget, error);
      return {
        _id: Math.random().toString(),
        categoryName: 'Error',
        categoryColor: '#6b7280',
        formattedAmount: '$0.00'
      };
    }
  });

  return (
    <ListContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Budget Amount</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {processedBudgets.map((budget) => (
            <TableRow key={budget._id}>
              <TableCell>
                <CategoryBadge color={budget.categoryColor}>
                  {budget.categoryName}
                </CategoryBadge>
              </TableCell>
              <TableCell>{budget.formattedAmount}</TableCell>
              <TableCell>
                <ActionButton onClick={() => onEdit(budget)}>
                  <FiEdit />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(budget._id)}>
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

export default BudgetList;