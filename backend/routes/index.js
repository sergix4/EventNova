// routes/index.js
// Las rutas conectan una URL + verbo HTTP con un metodo de un Controller.
// Todas estas rutas quedan bajo el prefijo /api (definido en app.js), por
// ejemplo esta ruta responde en: GET http://localhost:3000/api/status

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authRoutes = require('./authRoutes');
const paisRoutes = require('./paisRoutes');  
const departamentoRoutes = require('./departamentoRoutes');  
const ciudadRoutes = require('./ciudadRoutes');   
const eventoRoutes = require('./eventoRoutes');
const reservaRoutes = require('./reservaRoutes');
const reporteRoutes = require('./reporteRoutes');
const sincronizarEstados = require('../middlewares/sincronizarEstados');

// Antes de cualquier ruta de eventos o reservas se actualizan los estados
// automáticos (En Vivo / Finalizado) según la fecha y hora actual.
router.use(['/eventos', '/reservas', '/reportes'], sincronizarEstados);

router.get('/status', homeController.estado); 
router.use('/auth', authRoutes);
router.use('/paises', paisRoutes);           
router.use('/departamentos', departamentoRoutes); 
router.use('/ciudades', ciudadRoutes);    
router.use('/eventos', eventoRoutes);
router.use('/reservas', reservaRoutes);
router.use('/reportes', reporteRoutes);

module.exports = router;