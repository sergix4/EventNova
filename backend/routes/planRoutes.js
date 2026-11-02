// routes/planRoutes.js
// Sprint 3 · Tarea 5: rutas de planes · /api/planes
// Es una ruta pública de solo lectura: los planes (nombre y precio) ya se
// muestran a cualquiera en registro.html, así que no hay nada privado.
const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

router.get('/', planController.listar);

module.exports = router;