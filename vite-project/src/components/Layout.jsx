import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import { useDate } from '../contexts/DateContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: ${({ theme }) => theme.sidebarWidth};
  margin-top: ${({ theme }) => theme.headerHeight};
`;

const Layout = ({ children }) => {
  const { currentMonthName, currentYear } = useDate();
  
  return (
    <LayoutContainer>
      <Header title={`Finance Visualizer - ${currentMonthName} ${currentYear}`} />
      <Sidebar />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default Layout;