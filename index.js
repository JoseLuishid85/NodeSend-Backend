import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarios.js'
import authRoutes from './routes/auth.js'
import enlaces from './routes/enlaces.js'
import archivo from './routes/archivo.js'

//Crear Servidor
const app = express();

app.use(express.json());

dotenv.config();
//Conectar la Base de datos  
conectarDB();
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}


app.use(cors(opcionesCors));

console.log('Comenzando en Node Send');

const port = process.env.PORT || 4000;

//Habilitar Carpeta Publica
app.use(express.static('uploads'));

//Rutas de la app
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/enlaces', enlaces);
app.use('/api/archivos', archivo);

app.listen(port, () =>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})
