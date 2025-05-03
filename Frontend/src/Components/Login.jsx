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
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
    
        if (!values.email || !values.password) {
            setError('Todos los campos deben ser completados');
            return;
        }
    
        axios.post('http://localhost:3000/auth/userlogin', values)
        .then(result => {
            console.log("Respuesta del backend:", result.data);
    
            if (result.data.loginStatus) {
                if (result.data.token) {  
                    localStorage.setItem('auth-token', result.data.token);
                }
                localStorage.setItem('user-role', result.data.role);
    
                if (result.data.id) {
                    localStorage.setItem('user-id', result.data.id);  // 👉 Guardamos el id
                }
    
                console.log("Token guardado:", localStorage.getItem("auth-token"));
                console.log("Rol guardado:", localStorage.getItem("user-role"));
                console.log("ID guardado:", localStorage.getItem("user-id"));  // 👉 Mostramos el id
    
                if (result.data.role === 'USER') {
                    navigate('/Inicio');
                   
                } else if (result.data.role === 'ADMIN') {
                    navigate('/Admin');
                
                }
            } else {
                setError(result.data.Error);
            }
        })
        .catch(err => {
            console.error("Error en la petición:", err);
            setError("Error en los datos, intente de nuevo");
        });
    };
    
    
    return (
        <div className="LoginPcontainer">
            
            <div className='LoginScontainer'>
        
                <div className={`text-dangerLogin ${error ? 'show' : ''}`}>
                    {error && error}
                </div>
                <h2>LOGIN</h2>
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

                    <button type="submit"  className='botonLogin1'>Ingresa</button>
                </form>
                <button onClick={() => navigate('/Registro')} className='botonLogin1'>Ir a Registro</button>
            </div>
        </div>
    );
};

export default Login;
