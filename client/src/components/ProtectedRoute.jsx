// components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from "../pages/userContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useContext(UserContext);

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
