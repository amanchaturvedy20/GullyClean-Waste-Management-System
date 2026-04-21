import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


function ProtectedRoute({ allowedRoles }) {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but unauthorized
        return <Navigate to="/unauthorized" replace />;
    }

  return <Outlet />;
}

export default ProtectedRoute