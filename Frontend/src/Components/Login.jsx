import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../ImagenesP/ImagenesLogin/LOGOPETHOME.png';
import './DOCSS/Login.css';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        console.log("Cerrando sesión...");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-role");
        localStorage.removeItem("id"); 
    }, []);

    useEffect(() => {
        // Verifica si el ID del usuario se almacenó correctamente
        const storedUserId = localStorage.getItem("id");
        if (storedUserId) {
            console.log("🔹 ID del usuario almacenado en localStorage:", storedUserId);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);

        if (!values.email || !values.password) {
            setError('Todos los campos deben ser completados');
            return;
        }

        axios.post('https://hostingv1.onrender.com/auth/userlogin', values, {
            withCredentials: true,})
        .then(result => {
            console.log("✅ Respuesta del backend:", result.data);

            if (result.data.loginStatus) {
                if (result.data.token) {
                    localStorage.setItem('auth-token', result.data.token);
                }
                localStorage.setItem('user-role', result.data.role);
                
                if (result.data.id) {  // Verifica si el backend envía el ID
                    localStorage.setItem('id', result.data.id);
                    console.log("🆔 ID guardado correctamente:", localStorage.getItem("id"));
                } else {
                    console.warn("⚠️ No se recibió el ID del usuario en la respuesta del backend.");
                }

                console.log("🔑 Token guardado:", localStorage.getItem("auth-token"));
                console.log("🎭 Rol guardado:", localStorage.getItem("user-role"));

                if (result.data.role === 'USER') {
                    navigate('/Inicio');
                } else if (result.data.role === 'ADMIN') {
                    navigate('/Admin');
                } else if (result.data.role === 'AGENC') {
                    navigate('/InicioAGENC');
                }
            } else {
                setError(result.data.Error);
            }
        })
        .catch(err => {
            console.error("❌ Error en la petición:", err);
            setError("Error en el servidor. Inténtalo de nuevo.");
        });
    };

    return (
        <div className="LoginPcontainer">
            <div className='LoginScontainer'>
                <img src={logo} alt="Logo" className="logoLogin" />
                <div className={`text-dangerLogin ${error ? 'show' : ''}`}>
                    {error && error}
                </div>
                <form onSubmit={handleSubmit} className='formularioLogin'>
                    <div className='form1'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input 
                            type='email' 
                            name='email' 
                            autoComplete='off' 
                            placeholder='Ingresa Email' 
                            onChange={(e) => setValues({ ...values, email: e.target.value })}
                            className='input1'
                        />
                    </div>
                    <div className='form2'>
                        <label htmlFor='password'><strong>Contraseña</strong></label>
                        <input 
                            type='password' 
                            name='password' 
                            placeholder='Ingresa Contraseña' 
                            onChange={(e) => setValues({ ...values, password: e.target.value })}
                            className='input2'
                        />
                    </div>

                    <button type="submit" className='boton2'>Ingresa</button>
                </form>
                <button onClick={() => navigate('/Registro')} className='botonLogin1'>No tienes una cuenta? REGÍSTRATE</button>
            </div>
        </div>
    );
};

export default Login;
