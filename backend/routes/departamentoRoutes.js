const express = require('express');
const router = express.Router();
const validarId = require('../middlewares/validarId');
router.param('id', validarId);
const departamentoController = require('../controllers/departamentoController');
const { soloAdmin } = require('../middlewares/authMiddleware');

router.get('/', departamentoController.listar);
router.get('/:id', departamentoController.obtener);
router.post('/', soloAdmin, departamentoController.crear);
router.put('/:id', soloAdmin, departamentoController.actualizar);
router.delete('/:id', soloAdmin, departamentoController.eliminar);

module.exports = router;