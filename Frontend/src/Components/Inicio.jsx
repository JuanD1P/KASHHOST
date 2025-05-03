import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DOCSS/InicioAGENC.css';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';

function InicioMascotas() {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [mostrandoInfo, setMostrandoInfo] = useState(null);

  useEffect(() => {
    axios.get("https://kashhost.onrender.com/auth/mascotas/todas")
      .then(response => {
        setMascotas(response.data);
      })
      .catch(error => console.error("❌ Error al obtener las mascotas:", error));
  }, []);

  const mascotasFiltradas = mascotas.filter(mascota => 
    Object.values(mascota).some(valor => 
      typeof valor === 'string' && valor.toLowerCase().includes(filtro.toLowerCase())
    )
  );

  return (
    <div className='PCOntainersiu'>
      <img src={logo} alt="Logo" className="logo" />
      <div className="inicio-agenc-container">
        <h1 className="inicio-agenc-titulo"><strong>Mascotas Registradas</strong></h1>
        <button className="inicio-agenc-boton" onClick={() => navigate('/ReportUser')}>
          Mis Reportes
        </button>

        <input
          type="text"
          className="inicio-agenc-filtro"
          placeholder="Buscar por nombre, raza, especie, edad, etc."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <div className="inicio-agenc-mascotas-container">
          {mascotasFiltradas.length > 0 ? (
            mascotasFiltradas.map(mascota => (
              <div key={mascota.id} className="inicio-agenc-mascota-card">
                <h3 className="inicio-agenc-mascota-nombre">{mascota.nombreM} - {mascota.raza}</h3>
                {mascota.fotoM ? (
                  <img src={mascota.fotoM} alt={mascota.nombreM} className="inicio-agenc-mascota-foto" />
                ) : (
                  <p className="inicio-agenc-mascota-imagen-no">Imagen no disponible</p>
                )}
                <p className="inicio-agenc-mascota-info"><strong>Especie:</strong> {mascota.especie}</p>
                <p className="inicio-agenc-mascota-info"><strong>Edad:</strong> {mascota.edad}</p>
                <p className="inicio-agenc-mascota-info"><strong>Descripción:</strong> {mascota.descripcion}</p>
                
                {mostrandoInfo === mascota.id && (
                  <div className="info-dueno">
                    <h2>Información de Agencia</h2>
                    <p><strong>Nombre:</strong> {mascota.nombre_completo || "No disponible"}</p>
                    <p><strong>Dirección:</strong> {mascota.direccion || "No disponible"}</p>
                    <p><strong>Teléfono:</strong> {mascota.telefono || "No disponible"}</p>
                    <p><strong>Email:</strong> {mascota.email || "No disponible"}</p>
                    <button className="inicio-agenc-mascota-boton-Cancelar" onClick={() => setMostrandoInfo(null)}>Cerrar</button>
                  </div>
                )}

                <button 
                  className="inicio-agenc-mascota-boton-Eliminar" 
                  onClick={() => setMostrandoInfo(mascota.id)}
                >
                  Info
                </button>
              </div>
            ))
          ) : (
            <p className="inicio-agenc-mascota-no-registradas">No hay mascotas registradas o coincidentes.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InicioMascotas;