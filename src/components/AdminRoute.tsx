import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Strict email check mapping for user-provided emails
  const allowedAdmins = [
    'kishantakodara4@gmail.com',
    'ayushpandey102006@gmail.com',
    'padhakuportal@gmail.com'
  ];

  if (!currentUser.email || !allowedAdmins.includes(currentUser.email.toLowerCase())) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
