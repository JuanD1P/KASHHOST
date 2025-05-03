import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DOCSS/InicioAGENC.css';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';

function InicioAGENC() {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(null);
  const [mascotaEditada, setMascotaEditada] = useState({});
  const usuario_id = localStorage.getItem('id');

  useEffect(() => {
    if (!usuario_id) {
      console.error("No se encontró un usuario autenticado.");
      return;
    }

    axios.get(`https://kashhost.onrender.com/auth/usuarios/${usuario_id}`)
      .then(response => {
        setUsuario(response.data);
      })
      .catch(error => {
        console.error("Error al obtener el usuario:", error);
      });

    axios.get(`https://kashhost.onrender.com/auth/mascotas?usuario_id=${usuario_id}`)
      .then(response => {
        setMascotas(response.data);
      })
      .catch(error => {
        console.error("Error al obtener las mascotas:", error);
      });
  }, [usuario_id]);

  const eliminarMascota = (id) => {
    axios.delete(`https://kashhost.onrender.com/auth/mascotas/${id}`)
      .then(() => {
        setMascotas(mascotas.filter(mascota => mascota.id !== id));
      })
      .catch(error => {
        console.error("Error al eliminar la mascota:", error);
      });
  };

  const iniciarEdicion = (mascota) => {
    setEditando(mascota.id);
    setMascotaEditada({ ...mascota });
  };

  const manejarCambio = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMascotaEditada({ ...mascotaEditada, fotoM: event.target.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setMascotaEditada({ ...mascotaEditada, [name]: value });
    }
  };

  const guardarEdicion = (id) => {
    axios.put(`https://kashhost.onrender.com/auth/mascotas/${id}`, mascotaEditada)
      .then(() => {
        setMascotas(mascotas.map(mascota => (mascota.id === id ? mascotaEditada : mascota)));
        setEditando(null);
      })
      .catch(error => {
        console.error("Error al actualizar la mascota:", error);
      });
  };

  return (
    <div className='PCOntainersiu'>
      <img src={logo} alt="Logo" className="logo" />
      <div className="inicio-agenc-container">
        <h1 className="inicio-agenc-titulo"><strong>Bienvenido {usuario ? usuario.nombre_completo : 'Usuario'}</strong></h1>
        
        <button className="inicio-agenc-boton" onClick={() => navigate('/AgenciasPublica')}>
          Ir a Generar Publicación
        </button>

        <div className="inicio-agenc-mascotas-container">
          {mascotas.length > 0 ? (
            mascotas.map(mascota => (
              <div key={mascota.id} className="inicio-agenc-mascota-card">
                {editando === mascota.id ? (
                  <>
                    <input type="text" name="nombreM" value={mascotaEditada.nombreM} onChange={manejarCambio} />
                    <input type="text" name="edad" value={mascotaEditada.edad} onChange={manejarCambio} />
                    <input type="text" name="raza" value={mascotaEditada.raza} onChange={manejarCambio} />
                    <input type="text" name="descripcion" value={mascotaEditada.descripcion} onChange={manejarCambio} />
                    <input type="file" name="fotoM" accept="image/*" onChange={manejarCambio} />
                    
                    <button className="inicio-agenc-mascota-boton-Guardar" onClick={() => guardarEdicion(mascota.id)}>Guardar</button>
                    <button className="inicio-agenc-mascota-boton-Cancelar" onClick={() => setEditando(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <h3 className="inicio-agenc-mascota-nombre">{mascota.nombreM} - {mascota.raza}</h3>
                    {mascota.fotoM ? (
                      <img 
                        src={mascota.fotoM} 
                        alt={mascota.nombreM} 
                        className="inicio-agenc-mascota-foto"
                        onError={(e) => { e.target.src = "/imagenes/default-pet.png"; }}
                      />
                    ) : (
                      <p className="inicio-agenc-mascota-imagen-no">Imagen no disponible</p>
                    )}
                    <p className="inicio-agenc-mascota-info"><strong>Especie:</strong> {mascota.especie}</p>
                    <p className="inicio-agenc-mascota-info"><strong>Edad:</strong> {mascota.edad}</p>
                    <p className="inicio-agenc-mascota-info"><strong>Descripción:</strong> {mascota.descripcion}</p>
                    
                    <button className="inicio-agenc-mascota-boton-Modificar" onClick={() => iniciarEdicion(mascota)}>Modificar</button>
                    <button className="inicio-agenc-mascota-boton-Eliminar" onClick={() => eliminarMascota(mascota.id)}>Eliminar</button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="inicio-agenc-mascota-no-registradas">No hay mascotas registradas aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default InicioAGENC;