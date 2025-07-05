import React from 'react';
import styled from 'styled-components';
import { useCategories } from '../contexts/CategoriesContext';
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

const ColorIndicator = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  margin-right: 0.5rem;
  vertical-align: middle;
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

const CategoryList = ({ onEdit }) => {
  const { categories, deleteCategory } = useCategories();

  // Safely handle categories data
  const safeCategories = Array.isArray(categories) ? categories : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  // Process categories with error handling
  const processedCategories = safeCategories.map(category => {
    try {
      return {
        ...category,
        name: category.name || 'Unnamed Category',
        color: category.color || '#6b7280'
      };
    } catch (error) {
      console.error('Error processing category', category, error);
      return {
        _id: Math.random().toString(),
        name: 'Error',
        color: '#6b7280',
        isDefault: false
      };
    }
  });

  return (
    <ListContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Color</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {processedCategories.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                <ColorIndicator color={category.color} />
                {category.name}
              </TableCell>
              <TableCell>
                <code>{category.color}</code>
              </TableCell>
              <TableCell>
                {!category.isDefault && (
                  <>
                    <ActionButton onClick={() => onEdit(category)}>
                      <FiEdit />
                    </ActionButton>
                    <ActionButton onClick={() => handleDelete(category._id)}>
                      <FiTrash2 />
                    </ActionButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </ListContainer>
  );
};

export default CategoryList;