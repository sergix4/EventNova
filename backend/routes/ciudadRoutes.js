// routes/ciudadRoutes.js
const express = require('express');
const router = express.Router();
const ciudadController = require('../controllers/ciudadController');

router.get('/', ciudadController.listar);
router.get('/:id', ciudadController.obtener);
router.post('/', ciudadController.crear);
router.put('/:id', ciudadController.actualizar);
router.delete('/:id', ciudadController.eliminar);

module.exports = router;