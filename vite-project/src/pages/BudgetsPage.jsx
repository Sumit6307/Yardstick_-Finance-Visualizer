import React, { useState } from 'react';
import styled from 'styled-components';
import BudgetList from '../components/BudgetList';
import BudgetForm from '../components/BudgetForm';
import Button from '../components/ui/Button';
import { FiPlus } from 'react-icons/fi';
import MonthYearSelector from '../components/MonthYearSelector';

const BudgetsContainer = styled.div`
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

const BudgetsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBudget(null);
  };

  return (
    <BudgetsContainer>
      <Header>
        <Title>Budgets</Title>
        <div>
          <MonthYearSelector />
          <Button 
            onClick={() => setShowForm(true)}
            icon={<FiPlus />}
          >
            Set Budget
          </Button>
        </div>
      </Header>
      
      <BudgetList onEdit={handleEdit} />
      
      {showForm && (
        <BudgetForm 
          budget={editingBudget}
          onClose={handleFormClose}
        />
      )}
    </BudgetsContainer>
  );
};

export default BudgetsPage;