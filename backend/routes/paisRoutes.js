// routes/paisRoutes.js
const express = require('express');
const router = express.Router();
const paisController = require('../controllers/paisController');

router.get('/', paisController.listar);
router.get('/:id', paisController.obtener);
router.post('/', paisController.crear);
router.put('/:id', paisController.actualizar);
router.delete('/:id', paisController.eliminar);

module.exports = router;