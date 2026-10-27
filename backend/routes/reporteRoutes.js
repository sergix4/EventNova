// routes/reporteRoutes.js
// Rutas de la API de reportes (/api/reportes). SOLO el administrador.
const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { soloAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas de este archivo exigen sesión de administrador
router.use(soloAdmin);

router.get('/dashboard', reporteController.dashboard);

module.exports = router;