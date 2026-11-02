// middlewares/adminVigente.js
// Sprint 3 · Tarea 6: si el usuario con sesión es un ADMINISTRADOR que otro
// administrador ya eliminó, su sesión vieja deja de servir en TODAS las rutas
// (no solo en /api/usuarios). Se le quita la sesión y la petición sigue como
// si no hubiera iniciado sesión: las rutas protegidas responderán 401 y el
// panel lo devolverá al login.
const PersonaModel = require('../models/personaModel');

async function adminVigente(req, res, next) {
  const usuario = req.session.usuario;
  if (!usuario || usuario.rol !== 'administrador') return next();

  try {
    if (!(await PersonaModel.esAdministrador(usuario.numero_id))) {
      delete req.session.usuario;
    }
    next();
  } catch (error) {
    console.error('Error al verificar el administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = adminVigente;