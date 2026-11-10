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
// Registrar personas desde el panel (Tarea 6: administradores · auditoría final: clientes y agentes)
router.post('/clientes', (req, res) => personaController.crearPersona(req, res, 'cliente'));
router.post('/agentes', (req, res) => personaController.crearPersona(req, res, 'agente'));
router.post('/administradores', (req, res) => personaController.crearPersona(req, res, 'administrador'));
router.get('/:id', personaController.obtener);
router.put('/:id', personaController.actualizar);
router.delete('/:id', personaController.eliminar);

module.exports = router;