// routes/eventoRoutes.js
// Rutas de la API para la gestión y consulta de eventos (/api/eventos)
const express = require('express');
const router = express.Router();
const validarId = require('../middlewares/validarId');
const eventoController = require('../controllers/eventoController');
const { soloAgenteOAdmin } = require('../middlewares/authMiddleware');

router.param('id', validarId);

// Rutas públicas / de consulta (para el catálogo, filtros y detalle)
router.get('/', eventoController.listar);
// Catálogo del cliente (Tarea 4). Van ANTES de '/:id' para que Express
// no confunda la palabra "catalogo" con un id.
router.get('/catalogo', eventoController.catalogo);
router.get('/catalogo/ciudades', eventoController.ciudadesCatalogo);
router.get('/estados', eventoController.listarEstados);
router.get('/agentes', soloAgenteOAdmin, eventoController.listarAgentes);
router.get('/:id', eventoController.obtener);

// Rutas protegidas (solo agentes y administradores)
router.post('/', soloAgenteOAdmin, eventoController.crear);
router.put('/:id', soloAgenteOAdmin, eventoController.actualizar);
router.patch('/:id/estado', soloAgenteOAdmin, eventoController.cambiarEstado);
router.delete('/:id', soloAgenteOAdmin, eventoController.eliminar);

module.exports = router;