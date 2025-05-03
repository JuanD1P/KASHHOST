import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DOCSS/AgenciasPublica.css';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';

const RegistroMascota = () => {
    const [values, setValues] = useState({
        usuario_id: '',
        nombreM: '',
        edad: '',
        fotoM: '',
        tipoM: '',  
        descripcion: '',
        especie: '',
        raza: ''
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje bonito 😍
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const userId = localStorage.getItem('id');
        if (userId) {
            setValues((prev) => ({ ...prev, usuario_id: userId }));
        } else {
            setError("No se encontró un usuario autenticado.");
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
            setValues((prev) => ({ 
                ...prev, 
                fotoM: reader.result,  
                tipoM: file.type  
            }));
        };

        reader.onerror = (error) => {
            console.error("Error al leer el archivo:", error);
            setError("Error al procesar la imagen");
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(""); // Limpiamos mensaje anterior

        if (!values.fotoM.startsWith("data:image")) {
            setError("La imagen no se procesó correctamente.");
            return;
        }

        try {
            const response = await axios.post('https://kashhost.onrender.com/auth/mascotas', values);
            console.log(response.data);
            setSuccessMessage("🎉 ¡Mascota registrada exitosamente! 🎉");
            
            // Limpiar formulario después de registrar
            setValues({
                usuario_id: localStorage.getItem('id') || '',
                nombreM: '',
                edad: '',
                fotoM: '',
                tipoM: '',  
                descripcion: '',
                especie: '',
                raza: ''
            });

            // Ocultar el mensaje bonito después de 3 segundos ⏳
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

        } catch (error) {
            console.error("Error en el registro:", error);
            setError("Error al registrar la mascota");
        }
    };

    return (
        <div className='registroMMM'>
            <img src={logo} alt="Logo" className="logo" />
            <div className="registro-mascota-container">
                <h2 className="registro-mascota-titulo">Registro de Mascota</h2>

                {error && <p className="registro-mascota-error">{error}</p>}

                {successMessage && (
                    <p className="registro-mascota-exito">{successMessage}</p>
                )}

                <form className="registro-mascota-form" onSubmit={handleSubmit}>
                    <input className="registro-mascota-input" type="text" name="nombreM" placeholder="Nombre de la Mascota" value={values.nombreM} onChange={handleChange} required />
                    <input className="registro-mascota-input" type="text" name="edad" placeholder="Edad" value={values.edad} onChange={handleChange} required />
                    <input className="registro-mascota-input" type="file" name="fotoM" accept="image/*" onChange={handleImageChange} required />
                    <input className="registro-mascota-input" type="text" name="descripcion" placeholder="Descripción" value={values.descripcion} onChange={handleChange} required />
                    <input className="registro-mascota-input" type="text" name="especie" placeholder="Especie" value={values.especie} onChange={handleChange} required />
                    <input className="registro-mascota-input" type="text" name="raza" placeholder="Raza" value={values.raza} onChange={handleChange} required />
                    <button className="registro-mascota-boton" type="submit">Registrar Mascota</button>
                </form>

                <button className="registro-mascota-volver" onClick={() => navigate('/InicioAGENC')}>Volver</button>
            </div>
        </div>
    );
};

export default RegistroMascota;
