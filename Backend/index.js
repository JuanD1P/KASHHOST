import express from 'express';
import cors from 'cors';
import { userRouter } from './Routes/usuariosR.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://hostingv-1.vercel.app"], // Agrega el dominio de Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Aumenta el límite del JSON y los datos codificados en URL
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

app.use('/auth', userRouter);


app.listen(3000, () => {
    console.log("🚀 Servidor en funcionamiento");
});
