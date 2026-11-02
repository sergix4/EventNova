// routes/personaRoutes.js
// Sprint 3 · Tarea 4: rutas de usuarios (personas) · /api/usuarios
// TODAS son solo para el administrador.
const express = require('express');
const router = express.Router();
const validarNumeroId = require('../middlewares/validarNumeroId');
const personaController = require('../controllers/personaController');
const { soloAdmin } = require('../middlewares/authMiddleware');

// soloAdmin se aplica a todas las rutas de este archivo
router.use(soloAdmin);

// Antes de llegar al controlador se revisa que :id sea una identificación válida
router.param('id', validarNumeroId);

router.get('/', personaController.listar);          // ?rol=cliente|agente|administrador&buscar=
router.get('/:id', personaController.obtener);
router.put('/:id', personaController.actualizar);
router.delete('/:id', personaController.eliminar);

module.exports = router;