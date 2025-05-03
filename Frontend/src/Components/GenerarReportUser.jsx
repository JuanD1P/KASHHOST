import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DOCSS/RporteJ.css';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';

const GenerarReporteUnico = () => {
  const [values, setValues] = useState({
    usuario_id: '',
    foto: '',
    especie: '',
    descripcion: '',
    direccion: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (userId) {
      setValues((prev) => ({ ...prev, usuario_id: userId }));
    } else {
      setError("⚠️ No se encontró un usuario autenticado.");
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setValues((prev) => ({ ...prev, foto: reader.result }));
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      setError("❌ Error al procesar la imagen");
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!values.foto.startsWith("data:image")) {
      setError("⚠️ La imagen no se procesó correctamente.");
      return;
    }

    try {
      const response = await axios.post('https://kashhost.onrender.com/auth/reporte', values);
      console.log(response.data);
      setSuccessMessage("🎉 ¡Reporte enviado exitosamente! 🎉");


      setValues({
        usuario_id: localStorage.getItem('usuario_id') || '',
        foto: '',
        especie: '',
        descripcion: '',
        direccion: ''
      });

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      setError("❌ Error al enviar el reporte");
    }
  };

  return (
    <div className="reporte-unico-container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="reporte-unico-card">
        <h2 className="reporte-unico-titulo">Generar Reporte</h2>
        {error && <p className="reporte-unico-error">{error}</p>}
        {successMessage && <p className="reporte-unico-exito">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="reporte-unico-form">
          <label className="reporte-unico-label">
            Foto:
            <input type="file" accept="image/*" onChange={handleImageChange} required className="reporte-unico-input"/>
          </label>
          <label className="reporte-unico-label">
            Especie:
            <input type="text" name="especie" value={values.especie} onChange={handleChange} required className="reporte-unico-input"/>
          </label>
          <label className="reporte-unico-label">
            Descripción:
            <textarea name="descripcion" value={values.descripcion} onChange={handleChange} required className="reporte-unico-textarea"/>
          </label>
          <label className="reporte-unico-label">
            Dirección:
            <input type="text" name="direccion" value={values.direccion} onChange={handleChange} required className="reporte-unico-input"/>
          </label>
          <button type="submit"  className="reporte-unico-boton">Enviar Reporte</button>
        </form>
        <button onClick={() => navigate('/ReportUser')} className="reporte-unico-boton-volver">Volver</button>
      </div>
    </div>
  );
};

export default GenerarReporteUnico;
