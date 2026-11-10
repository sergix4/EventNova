// routes/authRoutes.js
// Rutas de autenticación: quedan montadas bajo /api/auth (ver routes/index.js)

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const perfilController = require("../controllers/perfilController");
const { conSesion } = require("../middlewares/authMiddleware");
const limiteLogin = require("../middlewares/limiteLogin");

router.post("/login", limiteLogin, authController.login);
router.post("/register", authController.register);
router.post("/register-agente", authController.registerAgente);
router.post("/logout", authController.logout);
router.get("/sesion", authController.sesion);

// Sprint 3 · Tarea 13: «Mi perfil» (cualquier rol, siempre el usuario de la sesión)
router.get("/perfil", conSesion, perfilController.obtener);
router.put("/perfil", conSesion, perfilController.actualizar);
router.put("/perfil/contrasena", conSesion, perfilController.cambiarContrasena);
// Sprint 3 · Tarea 14: el agente cambia su plan (TIPO_PLAN)
router.put("/perfil/plan", conSesion, perfilController.cambiarPlan);

module.exports = router;
