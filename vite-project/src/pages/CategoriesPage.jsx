import React, { useState } from 'react';
import styled from 'styled-components';
import CategoryList from '../components/CategoryList';
import CategoryForm from '../components/CategoryForm';
import Button from '../components/ui/Button';
import { FiPlus } from 'react-icons/fi';

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const CategoriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <CategoriesContainer>
      <Header>
        <Title>Categories</Title>
        <Button 
          onClick={() => setShowForm(true)}
          icon={<FiPlus />}
        >
          Add Category
        </Button>
      </Header>
      
      <CategoryList onEdit={handleEdit} />
      
      {showForm && (
        <CategoryForm 
          category={editingCategory}
          onClose={handleFormClose}
        />
      )}
    </CategoriesContainer>
  );
};

export default CategoriesPage;