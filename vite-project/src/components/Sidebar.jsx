import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FiHome, FiDollarSign, FiPieChart, FiSettings } from 'react-icons/fi';

const SidebarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${({ theme }) => theme.sidebarWidth};
  background-color: ${({ theme }) => theme.colors.sidebar};
  color: ${({ theme }) => theme.colors.textLight};
  padding-top: ${({ theme }) => theme.headerHeight};
  z-index: 100;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0.5rem 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: inherit;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.sidebarHover};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  &.active {
    background-color: ${({ theme }) => theme.colors.sidebarActive};
    color: ${({ theme }) => theme.colors.primary};
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
  }
`;

const Icon = styled.span`
  margin-right: 1rem;
  font-size: 1.2rem;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <NavList>
        <NavItem>
          <StyledNavLink to="/" end>
            <Icon><FiHome /></Icon>
            Dashboard
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/transactions">
            <Icon><FiDollarSign /></Icon>
            Transactions
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/categories">
            <Icon><FiPieChart /></Icon>
            Categories
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/budgets">
            <Icon><FiSettings /></Icon>
            Budgets
          </StyledNavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

export default Sidebar;