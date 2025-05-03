import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DOCSS/AdminReporte.css';  
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';

const AdminReporte = () => {
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const response = await axios.get(`https://kashhost.onrender.com/auth/reporte`);
        setReportes(response.data);
        setError(null);
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
        setError("Error al cargar los reportes.");
      }
    };

    fetchReportes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://kashhost.onrender.com/auth/reporte/${id}`);
      setReportes(prevReportes => prevReportes.filter(reporte => reporte.id !== id));
    } catch (error) {
      console.error("Error al eliminar el reporte:", error);
      setError("Error al eliminar el reporte.");
    }
  };

  return (
    <div className="admin-reporte-container">
      <img src={logo} alt="Logo" className="logo" />
      
      <div className="admin-reporte-content">
        <h1 className="admin-reporte-title"><strong>Administración de Reportes</strong></h1>
        
        <button onClick={() => navigate('/Admin')} className="admin-reporte-boton">
          Gestión De Usuarios
        </button>

        {error && reportes.length > 0 && <p className="admin-reporte-error">{error}</p>}

        <div className="admin-reporte-lista">
          {reportes.length > 0 ? (
            reportes.map(reporte => (
              <div key={reporte.id} className="admin-reporte-card">
                <h3 className="admin-reporte-nombre"><strong>Reporte de {reporte.especie}</strong></h3>
                <p className="admin-reporte-info"><strong>Nombre Del Usuario: </strong> {reporte.nombre_completo}</p>
                
                {reporte.foto ? (
                  <img 
                    src={reporte.foto} 
                    alt="Reporte" 
                    className="admin-reporte-foto"
                    onError={(e) => { e.target.src = "/imagenes/default-pet.png"; }}
                  />
                ) : (
                  <p className="admin-reporte-no-imagen">Imagen no disponible</p>
                )}

                <p className="admin-reporte-info"><strong>Descripción:</strong> {reporte.descripcion}</p>
                <p className="admin-reporte-info"><strong>Dirección:</strong> {reporte.direccion}</p>
                
                <button 
                  className="admin-reporte-boton-eliminar" 
                  onClick={() => handleDelete(reporte.id)}
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p className="admin-reporte-no-disponible">No hay reportes registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReporte;
