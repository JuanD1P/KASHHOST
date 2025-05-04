import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DOCSS/Form.css';

const FormSuscripcion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombresus: '',
    monto: '',
    diasSus: '',
    categoria: ''
  });

  const categorias = [
    'ENTRETENIMIENTO',
    'HOGAR',
    'EDUCACION',
    'SALUD',
    'DEPORTES',
    'TRANSPORTE',
    'COMIDA',
    'TECNOLOGIA',
    'MODA',
    'OTROS'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('user-id');
    if (!userId) {
      alert('No se encontró el ID de usuario en el localStorage.');
      return;
    }

    const hoy = new Date();
    hoy.setDate(hoy.getDate() + parseInt(formData.diasSus)); 
    const fechaVencimiento = hoy.toISOString().split('T')[0];

    try {
      await axios.post('https://kashhost.onrender.com/auth/suscripciones', {
        ...formData,
        usuario_id: userId,
        fechaVencimiento
      });
      alert('Suscripción agregada correctamente');
      setFormData({ nombresus: '', monto: '', diasSus: '', categoria: '' });
    } catch (error) {
      console.error(error);
      alert('Error al agregar la suscripción');
    }
  };

  return (
    <div className="form-sus-container">
      <h2>Agregar Suscripción</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombresus"
          placeholder="Nombre de la suscripción"
          value={formData.nombresus}
          onChange={handleChange}
          required
        />
  
        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={formData.monto}
          onChange={handleChange}
          required
        />
  
        <input
          type="number"
          name="diasSus"
          placeholder="Duración (días)"
          value={formData.diasSus}
          onChange={handleChange}
          required
        />
  
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
  
        <button type="submit">Agregar Suscripción</button>
        <button
    type="button"
    onClick={() => navigate(-1)}
    className="boton-volver"
  >
    ← Volver
  </button>
      </form>
    </div>
  );
  
};

export default FormSuscripcion;