import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('user-role');

    const navigate = useNavigate();

    useEffect(() => {
        if (!token || !allowedRoles.includes(role)) {
            console.warn("Acceso denegado. Volviendo a la página anterior...");
            navigate(-1); 
        }
    }, [token, role, allowedRoles, navigate]);

    if (!token || !allowedRoles.includes(role)) {
        return null; 
    }

    return children;
};

export default PrivateRoute;