// routes/reservaRoutes.js
// Rutas de la API para la gestión de reservas (/api/reservas)
const express = require('express');
const router = express.Router();
const validarId = require('../middlewares/validarId');
const reservaController = require('../controllers/reservaController');
const { conSesion, soloCliente, soloAdmin } = require('../middlewares/authMiddleware');

// Revisa que :id e :idEvento sean números enteros positivos
router.param('id', validarId);
router.param('idEvento', validarId);

// Consultas. '/estados' y '/cupos/:idEvento' van ANTES de '/:id'
// para que Express no confunda esas palabras con un id.
router.get('/estados', conSesion, reservaController.listarEstados);
router.get('/cupos/:idEvento', reservaController.cupos); // público
router.get('/', conSesion, reservaController.listar);
router.get('/:id', conSesion, reservaController.obtener);

// Registrar, modificar, cambiar estado y eliminar
router.post('/', soloCliente, reservaController.crear);
router.put('/:id', conSesion, reservaController.actualizar);
router.patch('/:id/estado', conSesion, reservaController.cambiarEstado);
router.delete('/:id', soloAdmin, reservaController.eliminar);

module.exports = router;