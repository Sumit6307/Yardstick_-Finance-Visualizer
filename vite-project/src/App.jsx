import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalStyles from './assets/GlobalStyles';
import theme from './assets/theme';
import Layout from './components/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { BudgetsProvider } from './contexts/BudgetsContext';
import { DateProvider } from './contexts/DateContext';

// Correct lazy loading imports
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const BudgetsPage = lazy(() => import('./pages/BudgetsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Enhanced error fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div style={{
      padding: '2rem',
      margin: '2rem',
      border: '1px solid #ef4444',
      borderRadius: '0.5rem',
      backgroundColor: '#fef2f2',
      color: '#b91c1c',
      textAlign: 'center'
    }}>
      <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
      <pre style={{
        whiteSpace: 'pre-wrap',
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: '1rem',
        borderRadius: '0.25rem',
        textAlign: 'left'
      }}>
        {error.message}
      </pre>
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Try again
      </button>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DateProvider>
        <Router>
          <TransactionsProvider>
            <CategoriesProvider>
              <BudgetsProvider>
                <Layout>
                  <ErrorBoundary 
                    FallbackComponent={ErrorFallback}
                    onError={(error, info) => {
                      console.error('Error Boundary caught:', error, info);
                      // Add error reporting service here if needed
                    }}
                  >
                    <Suspense fallback={<LoadingSpinner fullPage />}>
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/budgets" element={<BudgetsPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </Layout>
              </BudgetsProvider>
            </CategoriesProvider>
          </TransactionsProvider>
        </Router>
      </DateProvider>
    </ThemeProvider>
  );
}

export default App;