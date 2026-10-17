// routes/paisRoutes.js
const express = require('express');
const router = express.Router();
const paisController = require('../controllers/paisController');
const { soloAdmin } = require('../middlewares/authMiddleware');

router.get('/', paisController.listar);
router.get('/:id', paisController.obtener);
router.post('/', soloAdmin, paisController.crear);
router.put('/:id', soloAdmin, paisController.actualizar);
router.delete('/:id', soloAdmin, paisController.eliminar);

module.exports = router;