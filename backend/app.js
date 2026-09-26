// app.js (backend)
// Punto de entrada del backend de EventNova.
// Ahora el backend es una API REST pura: ya NO renderiza HTML ni sirve
// archivos estaticos, porque esas dos cosas las asume el frontend (React).

require('dotenv').config();
const express = require('express');
require('./config/db');
const cors = require('cors');
const session = require('express-session');

const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL del frontend Vite
  credentials: true,
}));
app.use(express.urlencoded({ extended: true })); // leer datos de formularios
app.use(express.json());                          // leer JSON en el body

app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_temporal',
  resave: false,
  saveUninitialized: false,
}));

// Todas las rutas de la API quedan bajo el prefijo /api
app.use('/api', indexRoutes);

// Manejo simple de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`API de EventNova corriendo en http://localhost:${PORT}`);
});
