
import { useNavigate } from 'react-router-dom';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';
import './DOCSS/Admin.css';  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
  

const Admin = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };
    

    const cambiarRol = async (id, nuevoRol) => {
        try {
            await axios.put(`http://localhost:3000/auth/usuarios/${id}`, { rol: nuevoRol });
            obtenerUsuarios();
        } catch (error) {
            console.error("Error al cambiar rol:", error);
        }
    };

    const eliminarUsuario = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

        try {
            await axios.delete(`http://localhost:3000/auth/usuarios/${id}`);
            obtenerUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">Panel de Administración</h2>
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
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nombre_completo}</td>
                            <td>{usuario.email}</td>
                            <td>
                                <select 
                                    className="admin-role-select"
                                    value={usuario.rol} 
                                    onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </td>
                            <td>
                                <button 
                                    className="admin-delete-btn" 
                                    onClick={() => eliminarUsuario(usuario.id)}
                                >
                                    ❌ Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default Admin;


