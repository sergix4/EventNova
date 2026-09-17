// app.js
// Punto de entrada de la aplicacion EventNova.
// Aqui se configura Express, el motor de vistas, los archivos estaticos
// y se conectan las rutas principales.

require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Motor de plantillas para las Vistas (carpeta /views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true })); // leer datos de formularios
app.use(express.json());                          // leer JSON en el body
app.use(express.static(path.join(__dirname, 'public'))); // archivos css/js/img

app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_temporal',
  resave: false,
  saveUninitialized: false,
}));

// Rutas
app.use('/', indexRoutes);

// Manejo simple de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Pagina no encontrada');
});

app.listen(PORT, () => {
  console.log(`EventNova corriendo en http://localhost:${PORT}`);
});
