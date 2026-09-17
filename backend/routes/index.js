// routes/index.js
// Las rutas conectan una URL + verbo HTTP con un metodo de un Controller.
// Todas estas rutas quedan bajo el prefijo /api (definido en app.js), por
// ejemplo esta ruta responde en: GET http://localhost:3000/api/status

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/status', homeController.estado);

// A medida que se agreguen modulos (paises, departamentos, ciudades,
// eventos, reservas, autenticacion) se agregan aqui, por ejemplo:
// const paisRoutes = require('./paisRoutes');
// router.use('/paises', paisRoutes);

module.exports = router;
