import React, { useState } from 'react';
import styled from 'styled-components';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import Button from '../components/ui/Button';
import { FiPlus } from 'react-icons/fi';
import MonthYearSelector from '../components/MonthYearSelector';

const TransactionsContainer = styled.div`
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

const TransactionsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <TransactionsContainer>
      <Header>
        <Title>Transactions</Title>
        <div>
          <MonthYearSelector />
          <Button 
            onClick={() => setShowForm(true)}
            icon={<FiPlus />}
          >
            Add Transaction
          </Button>
        </div>
      </Header>
      
      <TransactionList onEdit={handleEdit} />
      
      {showForm && (
        <TransactionForm 
          transaction={editingTransaction}
          onClose={handleFormClose}
        />
      )}
    </TransactionsContainer>
  );
};

export default TransactionsPage;    