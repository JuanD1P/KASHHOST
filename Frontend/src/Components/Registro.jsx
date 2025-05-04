import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './DOCSS/Registro.css';
import logo from '../ImagenesP/ImagenesLogin/Logo.png';

const Registro = () => {
    const [values, setValues] = useState({
        nombre_completo: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!values.nombre_completo || !values.email || !values.password || !values.confirmPassword) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (values.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (values.password !== values.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const dataToSend = {
            nombre_completo: values.nombre_completo,
            email: values.email,
            password: values.password
        };

        try {
            const result = await axios.post('https://kashhost.onrender.com/auth/register', dataToSend);
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
        <div>
         <div className="logoTopRight">
           <img src={logo} alt="Logo" />
         </div>
        <div className="registro-container">
            

            {error && <div className='error-message'>{error}</div>}

            <form onSubmit={handleSubmit} className='form-container'>
                <div>
                
                <h2><strong>Registrate</strong></h2>
                
                </div>
                
                <label><strong>Nombre de Usuario</strong></label>
                <input 
                    type="text"
                    placeholder='Ingresa Un nombre de usuario'
                    value={values.nombre_completo}
                    onChange={(e) => setValues({ ...values, nombre_completo: e.target.value })} 
                    required
                />

                <label><strong>Email</strong></label>
                <input 
                    type="email"
                    placeholder='Ingresa Email'
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })} 
                    required
                />

                <label><strong>Contraseña</strong></label>
                <div className="password-container">
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder='Ingresa la contraseña'
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
                        placeholder='Confirma la contraseña'
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
                <button 
                    type="button" 
                    onClick={() => navigate('/userlogin')} 
                    className='botonLogin1'
                >
                    Ir a Login
                </button>

            </form>
        </div>
        </div>
    );
};

export default Registro;
