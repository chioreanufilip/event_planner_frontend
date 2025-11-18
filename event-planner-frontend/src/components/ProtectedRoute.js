import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireOrganizer = false }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requireOrganizer && userStr) {
        const user = JSON.parse(userStr);
        if (user.role !== 'organizer') {
            return <Navigate to="/events" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;