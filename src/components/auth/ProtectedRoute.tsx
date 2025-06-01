import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading, accessToken } = useAuth();
  const location = useLocation();
  
  const storedToken = localStorage.getItem('accessToken');
  const hasToken = Boolean(storedToken || accessToken);
  
  console.log('ProtectedRoute state:', {
    isAuthenticated,
    loading,
    accessToken: !!accessToken,
    storedToken: !!storedToken,
    hasToken,
    path: location.pathname
  });
  
    
  if (loading && hasToken) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
 
  if (!isAuthenticated && !hasToken) {
    console.log('Not authenticated, redirecting to login', {
      isAuthenticated,
      hasToken,
      from: location.pathname
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;