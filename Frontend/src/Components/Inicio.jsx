import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie
} from 'recharts';
import './DOCSS/Inicio.css';

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
  const [mostrarResumen, setMostrarResumen] = useState(false);

  const userId = localStorage.getItem('user-id');

  const obtenerDatos = async () => {
    try {
      const ingresoResponse = await axios.get(`https://kashhost.onrender.com/auth/usuarios/${userId}`);
      const ingresoActual = ingresoResponse.data.ingreso;

      if (!ingresoActual) setObligarIngreso(true);
      else setIngreso(ingresoActual);

      const [susRes, gastosRes, balRes] = await Promise.all([
        axios.get(`https://kashhost.onrender.com/auth/suscripciones/usuario/${userId}`),
        axios.get(`https://kashhost.onrender.com/auth/total-gastos/usuario/${userId}`),
        axios.get(`https://kashhost.onrender.com/auth/balance/usuario/${userId}`)
      ]);

      setSuscripciones(susRes.data);
      setTotalGastos(gastosRes.data[0]?.total_gastos || 0);
      setBalance(balRes.data[0]?.balance_disponible || 0);

    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    if (userId) obtenerDatos();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const actualizarIngreso = async () => {
    if (!nuevoIngreso) return alert('Debes ingresar tu salario');
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
    if (!window.confirm('¿Eliminar esta suscripción?')) return;
    try {
      await axios.delete(`https://kashhost.onrender.com/auth/suscripciones/${idsusc}`);
      alert('Suscripción eliminada correctamente');
      obtenerDatos();
    } catch (error) {
      console.error('Error al eliminar suscripción:', error);
    }
  };

  const handleEditar = (sus) => {
    const fechaFormateada = sus.fechaVencimiento
      ? new Date(sus.fechaVencimiento).toISOString().split('T')[0]
      : '';
    setEditarId(sus.idsusc);
    setFormData({ ...sus, fechaVencimiento: fechaFormateada });
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

  const resumenPorCategoria = () => {
    const categorias = {};
    suscripciones.forEach((s) => {
      if (!categorias[s.categoria]) categorias[s.categoria] = 0;
      categorias[s.categoria] += parseFloat(s.monto);
    });
    return Object.entries(categorias).map(([categoria, valor]) => ({
      categoria,
      valor
    }));
  };

  return (
    <div id="inicio-dashboard">
      <header id="dashboard-header">
        <h1>Panel de Finanzas Personales</h1>
        <button onClick={handleLogout} id="logout-button">Cerrar Sesión</button>
      </header>

      {mostrarResumen && (
        <div id="resumen-modal">
          <div className="resumen-content">
            <h2>Resumen Financiero</h2>
            <p><strong>Ingreso:</strong> ${ingreso}</p>
            <p><strong>Total de Gastos:</strong> ${totalGastos}</p>
            <p><strong>Balance Disponible:</strong> ${balance}</p>

            <h3>Gastos por Suscripción</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={suscripciones}>
                <XAxis dataKey="nombresus" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monto" fill="#3f72af" />
              </BarChart>
            </ResponsiveContainer>

            <h3>Distribución por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resumenPorCategoria()}
                  dataKey="valor"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#112d4e"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <button onClick={() => setMostrarResumen(false)} className="cerrar-modal">Cerrar</button>
          </div>
        </div>
      )}

      <section id="ingreso-section">
        <h2>Ingreso Mensual</h2>
        {obligarIngreso ? (
          <div id="ingreso-form">
            <input type="number" value={nuevoIngreso} onChange={(e) => setNuevoIngreso(e.target.value)} placeholder="Ingresa tu salario" />
            <button onClick={actualizarIngreso}>Guardar Ingreso</button>
          </div>
        ) : (
          <div id="ingreso-actual">
            <p><strong>Ingreso actual:</strong> ${ingreso}</p>
            <input type="number" value={nuevoIngreso} onChange={(e) => setNuevoIngreso(e.target.value)} placeholder="Actualizar ingreso" />
            <button onClick={actualizarIngreso}>Actualizar</button>
          </div>
        )}
      </section>

      <section id="suscripciones-section">
        <h2>Suscripciones Activas</h2>
        {suscripciones.length ? (
          <div className="tabla-responsiva">
            <table className="tabla-suscripciones">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Monto</th>
                  <th>Días</th>
                  <th>Fecha de Vencimiento</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {suscripciones.map((s) => (
                  <tr key={s.idsusc}>
                    {editarId === s.idsusc ? (
                      <>
                        <td><input type="text" value={formData.nombresus} onChange={(e) => setFormData({ ...formData, nombresus: e.target.value })} /></td>
                        <td><input type="number" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })} /></td>
                        <td><input type="number" value={formData.diasSus} onChange={(e) => setFormData({ ...formData, diasSus: e.target.value })} /></td>
                        <td><input
  type="date"
  value={
    formData.fechaVencimiento
      ? new Date(formData.fechaVencimiento).toISOString().split('T')[0]
      : ''
  }
  onChange={(e) =>
    setFormData({ ...formData, fechaVencimiento: e.target.value })
  }
/>
</td>
                        <td><input type="text" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} /></td>
                        <td>
                          <button onClick={guardarEdicion}>Guardar</button>
                          <button onClick={() => setEditarId(null)}>Cancelar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{s.nombresus}</td>
                        <td>${s.monto}</td>
                        <td>{s.diasSus}</td>
                        <td>{new Date(s.fechaVencimiento).toISOString().split('T')[0]}</td>
                        <td>{s.categoria}</td>
                        <td>
                          <button onClick={() => handleEditar(s)}>Editar</button>
                          <button onClick={() => handleEliminar(s.idsusc)}>Eliminar</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>No tienes suscripciones activas.</p>}
      </section>

      <section id="resumen-section">
        <div className="resumen-card">🤑 Total Gastos: <span>${totalGastos}</span></div>
        <div className="resumen-card">💰 Balance Disponible: <span>${balance}</span></div>
        <div className="acciones-botones">
          <button onClick={() => navigate('/FormSuscripcion')} className="boton-principal">Agregar Suscripción</button>
          <button onClick={() => setMostrarResumen(true)} className="boton-secundario">Ver Resumen</button>
        </div>
      </section>
    </div>
  );
}
export default Inicio;