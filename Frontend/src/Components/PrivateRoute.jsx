import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('auth-token');
    let role = localStorage.getItem('user-role');
    let id = localStorage.getItem('id');

    console.log("Token:", token);
    console.log("Role:", role);
    console.log("Allowed Roles:", allowedRoles);
    console.log("id", id)

    if (!token || !role || !allowedRoles.map(r => r.toUpperCase()).includes(role.toUpperCase())) {
        console.warn("⚠️ Acceso denegado. Redirigiendo a /userlogin");
        return <Navigate to="/userlogin" />;
    }

    return children;
};

export default PrivateRoute;
