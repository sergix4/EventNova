// routes/index.js
// Las rutas conectan una URL + verbo HTTP con un metodo de un Controller.
// Aqui NO va logica de negocio, solo el "mapeo" de la peticion.

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.mostrarInicio);

// A medida que se agreguen modulos (paises, departamentos, ciudades, eventos,
// reservas, autenticacion) se agregan aqui, por ejemplo:
// const paisRoutes = require('./paisRoutes');
// router.use('/paises', paisRoutes);

module.exports = router;
