
import { useNavigate } from 'react-router-dom';
import './DOCSS/Admin.css';  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import logo from '../ImagenesP/ImagenesLogin/Logo.png';
  
const Admin = () => {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const response = await axios.get('https://kashhost.onrender.com/auth/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
        }
    };
    
    const cambiarRol = async (id, nuevoRol) => {
        try {
            await axios.put(`https://kashhost.onrender.com/auth/usuarios/${id}`, { rol: nuevoRol });
            obtenerUsuarios();
        } catch (error) {
            console.error("Error al cambiar rol:", error);
        }
    };

    const eliminarUsuario = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

        try {
            await axios.delete(`https://kashhost.onrender.com/auth/usuarios/${id}`);
            obtenerUsuarios();
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    return (
        <div className='PrincipalCOn'>
            <div className="logoTopRight">
                <img src={logo} alt="Logo" />
            </div>
        <div className="admin-container">
            <h2 className="admin-title"><strong>Panel de Administración</strong></h2>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                        <td data-label="ID">{usuario.id}</td>
                        <td data-label="Nombre Completo">{usuario.nombre_completo}</td>
                        <td data-label="Email">{usuario.email}</td>
                        <td data-label="Rol">
                            <select 
                            className="admin-role-select"
                            value={usuario.rol}
                            onChange={(e) => cambiarRol(usuario.id, e.target.value)}
                            >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            </select>
                        </td>
                        <td data-label="Eliminar">
                        <button 
                            className="admin-delete-btn" 
                            onClick={() => eliminarUsuario(usuario.id)}
                            title="Eliminar usuario"
                        >
                            <FaTrash />
                        </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
            </table>
        </div>
        </div>
    );
};

export default Admin;