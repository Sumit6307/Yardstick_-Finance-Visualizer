import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiLoader } from 'react-icons/fi';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ fullPage }) => fullPage && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
  `}
`;

const SpinnerIcon = styled(FiLoader)`
  animation: ${spin} 1s linear infinite;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const LoadingSpinner = ({ fullPage = false }) => {
  return (
    <SpinnerContainer fullPage={fullPage}>
      <SpinnerIcon />
    </SpinnerContainer>
  );
};

export default LoadingSpinner;