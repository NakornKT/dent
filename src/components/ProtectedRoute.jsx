import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, role, loadingUser, children }) => {
  // รอจนกว่า user จะโหลดเสร็จ
  if (loadingUser) {
    return <p>Loading user...</p>;
  }

  if (!user) {
    console.log('Access denied, no user logged in');
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    console.log('Access denied, wrong role');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;