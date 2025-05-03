import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Inicio() {
  const navigate = useNavigate();
  const [ingreso, setIngreso] = useState('');
  const [nuevoIngreso, setNuevoIngreso] = useState('');
  const [obligarIngreso, setObligarIngreso] = useState(false);
  const [suscripciones, setSuscripciones] = useState([]);
  const [editarId, setEditarId] = useState(null);
  const [formData, setFormData] = useState({
    nombresus: '',
    monto: '',
    diasSus: '',
    fechaVencimiento: '',
    categoria: ''
  });
  const [totalGastos, setTotalGastos] = useState(0);
  const [balance, setBalance] = useState(0);
  const [mostrarResumen, setMostrarResumen] = useState(false); // 👈 nuevo estado

  const userId = localStorage.getItem('user-id');

  const obtenerDatos = async () => {
    try {
      const ingresoResponse = await axios.get(`https://kashhost.onrender.com/auth/usuarios/${userId}`);
      const ingresoActual = ingresoResponse.data.ingreso;

      if (ingresoActual == null || ingresoActual === 0) {
        setObligarIngreso(true);
      } else {
        setIngreso(ingresoActual);
      }

      const suscripcionesResponse = await axios.get(`https://kashhost.onrender.com/auth/suscripciones/usuario/${userId}`);
      setSuscripciones(suscripcionesResponse.data);

      const gastosResponse = await axios.get(`https://kashhost.onrender.com/auth/total-gastos/usuario/${userId}`);
      if (gastosResponse.data.length > 0) {
        setTotalGastos(gastosResponse.data[0].total_gastos);
      } else {
        setTotalGastos(0);
      }

      const balanceResponse = await axios.get(`https://kashhost.onrender.com/auth/balance/usuario/${userId}`);
      if (balanceResponse.data.length > 0) {
        setBalance(balanceResponse.data[0].balance_disponible);
      } else {
        setBalance(0);
      }

    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      obtenerDatos();
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const actualizarIngreso = async () => {
    if (!nuevoIngreso) {
      alert('Debes ingresar tu salario');
      return;
    }

    try {
      await axios.put(`https://kashhost.onrender.com/auth/usuarios/${userId}/ingreso`, { ingreso: nuevoIngreso });
      alert('Ingreso actualizado correctamente');
      setIngreso(nuevoIngreso);
      setObligarIngreso(false);
      obtenerDatos();
    } catch (error) {
      console.error('Error actualizando ingreso:', error);
    }
  };

  const handleEliminar = async (idsusc) => {
    if (!window.confirm('¿Estás seguro de eliminar esta suscripción?')) return;

    try {
      await axios.delete(`https://kashhost.onrender.com/auth/suscripciones/${idsusc}`);
      alert('Suscripción eliminada correctamente');
      obtenerDatos();
    } catch (error) {
      console.error('Error al eliminar suscripción:', error);
    }
  };

  const handleEditar = (suscripcion) => {
    setEditarId(suscripcion.idsusc);
    setFormData({
      nombresus: suscripcion.nombresus,
      monto: suscripcion.monto,
      diasSus: suscripcion.diasSus,
      fechaVencimiento: suscripcion.fechaVencimiento,
      categoria: suscripcion.categoria
    });
  };

  const guardarEdicion = async () => {
    try {
      await axios.put(`https://kashhost.onrender.com/auth/suscripciones/${editarId}`, formData);
      alert('Suscripción actualizada correctamente');
      setEditarId(null);
      obtenerDatos();
    } catch (error) {
      console.error('Error al editar suscripción:', error);
    }
  };

  return (
    <div>
      <h1>Inicio</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      {mostrarResumen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Resumen Financiero</h2>
            <p><strong>Ingreso:</strong> ${ingreso}</p>
            <p><strong>Total de Gastos:</strong> ${totalGastos}</p>
            <p><strong>Balance Disponible:</strong> ${balance}</p>
            <h3>Suscripciones:</h3>
            <ul>
              {suscripciones.map(s => (
                <li key={s.idsusc}>
                  {s.nombresus} - ${s.monto} - {s.categoria} - Vence: {s.fechaVencimiento}
                </li>
              ))}
            </ul>
            <button onClick={() => setMostrarResumen(false)}>Cerrar</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {obligarIngreso ? (
          <div>
            <h2>¡Aún no ingresas tu salario!</h2>
            <input
              type="number"
              value={nuevoIngreso}
              onChange={(e) => setNuevoIngreso(e.target.value)}
              placeholder="Ingresa tu salario"
            />
            <button onClick={actualizarIngreso}>Guardar Ingreso</button>
          </div>
        ) : (
          <div>
            <h2>Tu ingreso actual es: ${ingreso}</h2>
            <input
              type="number"
              value={nuevoIngreso}
              onChange={(e) => setNuevoIngreso(e.target.value)}
              placeholder="Actualizar ingreso"
            />
            <button onClick={actualizarIngreso}>Actualizar Ingreso</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Suscripciones</h2>
        {suscripciones.length > 0 ? (
          <ul>
            {suscripciones.map((suscripcion) => (
              <li key={suscripcion.idsusc}>
                {editarId === suscripcion.idsusc ? (
                  <div>
                    <input type="text" value={formData.nombresus}
                      onChange={(e) => setFormData({ ...formData, nombresus: e.target.value })} />
                    <input type="number" value={formData.monto}
                      onChange={(e) => setFormData({ ...formData, monto: e.target.value })} />
                    <input type="number" value={formData.diasSus}
                      onChange={(e) => setFormData({ ...formData, diasSus: e.target.value })} />
                    <input type="date" value={formData.fechaVencimiento}
                      onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })} />
                    <input type="text" value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} />
                    <button onClick={guardarEdicion}>Guardar</button>
                    <button onClick={() => setEditarId(null)}>Cancelar</button>
                  </div>
                ) : (
                  <div>
                    <strong>{suscripcion.nombresus}</strong> - ${suscripcion.monto} - {suscripcion.categoria} - Vence: {suscripcion.fechaVencimiento}
                    <button onClick={() => handleEditar(suscripcion)}>Editar</button>
                    <button onClick={() => handleEliminar(suscripcion.idsusc)}>Eliminar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes suscripciones activas.</p>
        )}

        <div style={{ marginTop: '20px' }}>
          <h3>Total de gastos: ${totalGastos}</h3>
          <h3>Balance disponible: ${balance}</h3>
        </div>

        <button onClick={() => navigate('/FormSuscripcion')} className='botonLogin1'>Agregar Suscripción</button>
        <button onClick={() => setMostrarResumen(true)} style={{ marginLeft: '10px' }}>Ver Resumen</button>
      </div>
    </div>
  );
}



export default Inicio;
