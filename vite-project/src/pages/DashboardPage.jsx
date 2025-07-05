import React from 'react';
import styled from 'styled-components';
import MonthlyExpensesChart from '../components/charts/MonthlyExpensesChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import BudgetComparisonChart from '../components/charts/BudgetComparisonChart';
import SummaryCards from '../components/SummaryCards';
import RecentTransactions from '../components/RecentTransactions';
import { useDate } from '../contexts/DateContext';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SideSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DashboardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const MonthYearDisplay = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textLight};
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const DashboardPage = () => {
  const { currentMonthName, currentYear } = useDate();

  return (
    <>
      <DashboardHeader>
        <DashboardTitle>Dashboard Overview</DashboardTitle>
        <MonthYearDisplay>
          {currentMonthName} {currentYear}
        </MonthYearDisplay>
      </DashboardHeader>
      
      <SummaryCards />
      
      <DashboardContainer>
        <MainSection>
          <MonthlyExpensesChart />
          <BudgetComparisonChart />
        </MainSection>
        
        <SideSection>
          <CategoryPieChart />
          <RecentTransactions />
        </SideSection>
      </DashboardContainer>
    </>
  );
};

export default DashboardPage;