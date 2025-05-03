import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DOCSS/InicioAGENC.css';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';

const ReportUser = () => {
  const [reportes, setReportes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');

  useEffect(() => {
    if (!userId) {
      setError("No se encontró un usuario autenticado.");
      return;
    }
    
    const fetchReportes = async () => {
      try {
        const response = await axios.get(`https://hostingv1.onrender.com/auth/reporte/${userId}`);
        setReportes(response.data);
        setError(null); // Se borra cualquier error anterior si la petición fue exitosa
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
        setError("Error al cargar los reportes.");
      }
    };

    fetchReportes();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hostingv1.onrender.com/auth/reporte/${id}`);
      setReportes(prevReportes => prevReportes.filter(reporte => reporte.id !== id));
    } catch (error) {
      console.error("Error al eliminar el reporte:", error);
      setError("Error al eliminar el reporte.");
    }
  };

  return (
    <div className='PCOntainersiu'>
      <img src={logo} alt="Logo" className="logo" />
      <div className="inicio-agenc-container">
        <h1 className="inicio-agenc-titulo"><strong>Mis Reportes</strong></h1>
        
        <button className="inicio-agenc-boton" onClick={() => navigate('/GenerarReportUser')}>
          Reportar Nuevo Animal
        </button>
        <button onClick={() => navigate('/Inicio')} className="inicio-agenc-boton">Volver</button>

        {error && reportes.length > 0 && <p className="inicio-agenc-mascota-error">{error}</p>}

        <div className="inicio-agenc-mascotas-container">
          {reportes.length > 0 ? (
            reportes.map(reporte => (
              <div key={reporte.id} className="inicio-agenc-mascota-card">
                <h3 className="inicio-agenc-mascota-nombre">{reporte.especie}</h3>
                {reporte.foto ? (
                  <img 
                    src={reporte.foto} 
                    alt="Reporte" 
                    className="inicio-agenc-mascota-foto"
                    onError={(e) => { e.target.src = "/imagenes/default-pet.png"; }}
                  />
                ) : (
                  <p className="inicio-agenc-mascota-imagen-no">Imagen no disponible</p>
                )}
                <p className="inicio-agenc-mascota-info"><strong>Descripción:</strong> {reporte.descripcion}</p>
                <p className="inicio-agenc-mascota-info"><strong>Dirección:</strong> {reporte.direccion}</p>
                
                <button className="inicio-agenc-mascota-boton-Eliminar" onClick={() => handleDelete(reporte.id)}>Eliminar</button>
              </div>
            ))
          ) : (
            <p className="inicio-agenc-mascota-no-registradas">No tienes reportes registrados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportUser;

