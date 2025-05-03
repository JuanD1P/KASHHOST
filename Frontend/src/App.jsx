import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
//VISTAS PUBLICAS
import Login from './Components/Login'; 
import Registro from './Components/Registro';
import ProtectedRoute from './Components/PrivateRoute';
import NotFound from "./Components/NotFound";

//VISTAS USUARIO COMUN
import Inicio from './Components/Inicio';
import AdopMasUser from './Components/AdopMasUser';
import ReportUser from './Components/ReportUser';
import GenerarReportUser from './Components/GenerarReportUser';

//VISTAS ADMIN
import Admin from './Components/Admin';
import AdminReporte from './Components/AdminReporte';

//VISTA AGENCIA
import InicioAGENC from './Components/InicioAGENC';
import AgenciasPublica from './Components/AgenciasPublica'; 

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/userlogin" />} />
                <Route path="/userlogin" element={<Login />} />
                <Route path="/Registro" element={<Registro />} />
                
                
                {/* RUTAS PARA EL ADMINISTRADOR */}
                <Route path="/Admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <Admin />
                    </ProtectedRoute>
                } />

                <Route path="/AdminReporte" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminReporte />
                    </ProtectedRoute>
                } />

                {/* RUTAS PARA LOS USUARIOS */}   
                <Route path="/Inicio" element={
                    <ProtectedRoute allowedRoles={['USER']}>
                        <Inicio />
                    </ProtectedRoute>
                } />
                <Route path="/AdopMasUser" element={
                    <ProtectedRoute allowedRoles={['USER']}>
                        <AdopMasUser />
                    </ProtectedRoute>
                } />
                <Route path="/ReportUser" element={
                    <ProtectedRoute allowedRoles={['USER']}>
                        <ReportUser />
                    </ProtectedRoute>
                } />
                <Route path="/GenerarReportUser" element={
                    <ProtectedRoute allowedRoles={['USER']}>
                        <GenerarReportUser />
                    </ProtectedRoute>
                } />

                {/* RUTA PARA AGENCIAS */}
                <Route path="/InicioAGENC" element={
                    <ProtectedRoute allowedRoles={['AGENC']}>
                        <InicioAGENC />
                    </ProtectedRoute>
                } />
                <Route path="/AgenciasPublica" element={
                    <ProtectedRoute allowedRoles={['AGENC']}>
                        <AgenciasPublica />
                    </ProtectedRoute>
                } />

                {/* RUTA NO ENCONTRADA */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
