import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './DOCSS/Registro.css';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';

const Registro = () => {
    const [values, setValues] = useState({
        nombre_completo: '',
        direccion: '',
        telefono: '',
        email: '',
        password: '',
        confirmPassword: '',
        rol: 'USER'
    });


    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        // Validaciones de campos
        if (!values.nombre_completo || !values.email || !values.password || !values.confirmPassword) {
            setError("Todos los campos obligatorios deben llenarse");
            return;
        }

        if (values.rol === 'AGENC' && (!values.direccion || !values.telefono)) {
            setError("Los campos Dirección y Teléfono son obligatorios para agencias");
            return;
        }

        if (values.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (values.password !== values.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const dataToSend = {
            nombre_completo: values.nombre_completo,
            direccion: values.rol === 'AGENC' ? values.direccion : null,
            telefono: values.rol === 'AGENC' ? values.telefono : null,
            email: values.email,
            password: values.password,
            rol: values.rol
        };

        try {
            const result = await axios.post('https://hostingv1.onrender.com/auth/register', dataToSend);
            if (result.data.registrationStatus) {
                alert("Registro exitoso");
                navigate('/userlogin');
            } else {
                setError(result.data.Error);
            }
        } catch (err) {
            console.error("Error en el registro:", err);
            setError("Error en el servidor, intenta más tarde");
        }
    };

    return (
        <div className="registro-container">
            {error && <div className='error-message'>{error}</div>}

            <form onSubmit={handleSubmit} className='form-container'>
                <div>
                    <img src={logo} alt="Logo" className="logoLogin" />
                    <h2>Página de Registro</h2>
                </div>

                <div className="select-container">
                    <label>Rol:</label>
                    <select value={values.rol} onChange={(e) => setValues({ ...values, rol: e.target.value })}>
                        <option value="USER">Usuario</option>
                        <option value="AGENC">Agencia</option>
                    </select>
                </div>

                <div></div>
                <label>Nombre Completo</label>
                <input 
                    type="text"
                    value={values.nombre_completo}
                    onChange={(e) => setValues({ ...values, nombre_completo: e.target.value })} 
                    required
                />

                {values.rol === 'AGENC' && (
                    <>
                        <label>Dirección</label>
                        <input 
                            type="text"
                            value={values.direccion}
                            onChange={(e) => setValues({ ...values, direccion: e.target.value })} 
                            required={values.rol === 'AGENC'}
                        />

                        <label>Teléfono</label>
                        <input 
                            type="tel"
                            value={values.telefono}
                            onChange={(e) => setValues({ ...values, telefono: e.target.value })} 
                            required={values.rol === 'AGENC'}
                        />
                    </>
                )}

                <label>Email</label>
                <input 
                    type="email"
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })} 
                    required
                />

                <label>Contraseña</label>
                <div className="password-container">
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        value={values.password}
                        onChange={(e) => setValues({ ...values, password: e.target.value })} 
                        required
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <label>Confirmar Contraseña</label>
                <div className="password-container">
                    <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        value={values.confirmPassword}
                        onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })} 
                        required
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <button type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export default Registro;
