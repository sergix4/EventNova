const express = require('express');
const router = express.Router();
const ciudadController = require('../controllers/ciudadController');
const { soloAdmin } = require('../middlewares/authMiddleware');

router.get('/', ciudadController.listar);
router.get('/:id', ciudadController.obtener);
router.post('/', soloAdmin, ciudadController.crear);
router.put('/:id', soloAdmin, ciudadController.actualizar);
router.delete('/:id', soloAdmin, ciudadController.eliminar);

module.exports = router;