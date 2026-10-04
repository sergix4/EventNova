// routes/departamentoRoutes.js
const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');

router.get('/', departamentoController.listar);
router.get('/:id', departamentoController.obtener);
router.post('/', departamentoController.crear);
router.put('/:id', departamentoController.actualizar);
router.delete('/:id', departamentoController.eliminar);

module.exports = router;