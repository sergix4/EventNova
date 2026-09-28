// routes/authRoutes.js
// Rutas de autenticación: quedan montadas bajo /api/auth (ver routes/index.js)

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/register-agente', authController.registerAgente);
router.post('/logout', authController.logout);

module.exports = router;