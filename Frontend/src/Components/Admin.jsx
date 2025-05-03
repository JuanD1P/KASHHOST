import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';
import './DOCSS/Admin.css';  

const Admin = () => {
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get('https://hostingv1.onrender.com/auth/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };

    const cambiarRol = async (id, nuevoRol) => {
        try {
            await axios.put(`https://hostingv1.onrender.com/auth/usuarios/${id}`, { rol: nuevoRol });
            obtenerUsuarios();
        } catch (error) {
            console.error("Error al cambiar rol:", error);
        }
    };

    const eliminarUsuario = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
        try {
            await axios.delete(`https://hostingv1.onrender.com/auth/usuarios/${id}`);
            obtenerUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    return (
        <div className='PrincipalPP'>
        <div className="admin-container">
            <img src={logo} alt="Logo de la aplicación" className="logo" />
            <h2 className="admin-title">Panel de Administración</h2>
            
            <button onClick={() => navigate('/AdminReporte')} className="admin-report-btn">Reportes De Usuarios</button>
            
            <div className="admin-tables-container">
                {/* Tabla de Usuarios y Admins */}
                <div className="admin-table-wrapper">
                    <h3 className="admin-title">Usuarios</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.filter(usuario => usuario.rol !== 'AGENC').map(usuario => (
                                <tr key={usuario.usuario_id}>
                                    <td>{usuario.usuario_id}</td>
                                    <td>{usuario.nombre_completo}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <select 
                                            className="admin-role-select"
                                            value={usuario.rol} 
                                            onChange={(e) => cambiarRol(usuario.usuario_id, e.target.value)}
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="admin-delete-btn" onClick={() => eliminarUsuario(usuario.usuario_id)}>❌ Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Tabla de Agencias */}
                <div className="admin-table-wrapper">
                    <h3 className="admin-title">Agencias</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.filter(usuario => usuario.rol === 'AGENC').map(usuario => (
                                <tr key={usuario.usuario_id}>
                                    <td>{usuario.usuario_id}</td>
                                    <td>{usuario.nombre_completo}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <button className="admin-delete-btn" onClick={() => eliminarUsuario(usuario.usuario_id)}>❌ Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Admin;
