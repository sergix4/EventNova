// routes/authRoutes.js
// Rutas de autenticación: quedan montadas bajo /api/auth (ver routes/index.js)

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const perfilController = require("../controllers/perfilController");
const { conSesion } = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/register-agente", authController.registerAgente);
router.post("/logout", authController.logout);
router.get("/sesion", authController.sesion);

// Sprint 3 · Tarea 13: «Mi perfil» (cualquier rol, siempre el usuario de la sesión)
router.get("/perfil", conSesion, perfilController.obtener);
router.put("/perfil", conSesion, perfilController.actualizar);
router.put("/perfil/contrasena", conSesion, perfilController.cambiarContrasena);

module.exports = router;
