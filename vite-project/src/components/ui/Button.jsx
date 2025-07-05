import React from 'react';
import styled from 'styled-components';
import { FiLoader } from 'react-icons/fi';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme, $variant }) => 
    $variant === 'primary' ? theme.colors.primary : 
    $variant === 'danger' ? theme.colors.danger : 
    theme.colors.background};
  color: ${({ theme, $variant }) => 
    $variant === 'primary' || $variant === 'danger' ? 'white' : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};

  &:hover {
    background-color: ${({ theme, $variant }) => 
      $variant === 'primary' ? theme.colors.primaryDark : 
      $variant === 'danger' ? theme.colors.dangerDark : 
      theme.colors.background};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    animation: ${({ $isLoading }) => $isLoading ? 'spin 1s linear infinite' : 'none'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Button = ({ 
  children, 
  icon, 
  onClick, 
  disabled = false, 
  isLoading = false,
  variant = 'default',
  fullWidth = false,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled || isLoading}
      $variant={variant}
      $isLoading={isLoading}
      $fullWidth={fullWidth}
      type={type}
      {...props}
    >
      {isLoading ? <FiLoader /> : icon}
      {children}
    </StyledButton>
  );
};

export default Button;