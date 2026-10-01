// app.js (backend)
// Punto de entrada de EventNova.
//
// Este servidor Express cumple dos funciones:
//   1. Sirve la interfaz (HTML5 + CSS + JavaScript) que vive en la carpeta /frontend.
//   2. Expone la API REST bajo el prefijo /api, que es la que habla con PostgreSQL.
//
// Como la interfaz y la API salen del MISMO servidor (http://localhost:3000),
// ya no hace falta CORS ni un segundo servidor para el frontend.

require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

const indexRoutes = require('./routes/index');
require('./config/db'); // fuerza a que db.js se ejecute y pruebe la conexión

const app = express();
const PORT = process.env.PORT || 3000;
const CARPETA_FRONTEND = path.join(__dirname, '..', 'frontend');

// ─── Middlewares ────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true })); // leer datos de formularios
app.use(express.json());                          // leer JSON en el body

app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_temporal',
  resave: false,
  saveUninitialized: false,
}));

// ─── API REST (Modelo + Controlador) ────────────────────────────────────────
app.use('/api', indexRoutes);

// Si una ruta de la API no existe se responde en JSON
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta de la API no encontrada' });
});

// ─── Archivos de terceros usados por la vista ───────────────────────────────
// Chart.js (gráficas del panel de administrador) se instala con npm y se sirve
// desde node_modules, así funciona sin internet.
app.use('/vendor/chart.js', express.static(path.join(__dirname, 'node_modules', 'chart.js', 'dist')));

// ─── Interfaz (Vista): HTML5 + CSS + JavaScript ─────────────────────────────
app.use(express.static(CARPETA_FRONTEND));

// Página no encontrada
app.use((req, res) => {
  res.status(404).sendFile(path.join(CARPETA_FRONTEND, '404.html'));
});

app.listen(PORT, () => {
  console.log(`EventNova corriendo en http://localhost:${PORT}`);
});
