import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Your Navbar already uses userId to check for a login session.
  // We'll use the same logic here.
  const userId = localStorage.getItem('userId');

  // If a userId exists, the user is logged in, so show the page they requested.
  // The <Outlet /> component renders the actual page component (e.g., <ProblemList />).
  // If no userId exists, redirect them to the login page.
  return userId ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;