// middlewares/authMiddleware.js
// Un "middleware" es una función que se ejecuta ANTES del controlador.
// Si el usuario no cumple la condición, responde con error y el controlador nunca se ejecuta.
// Auditoría final: TODOS los middlewares revisan en la BD que el usuario de la
// sesión siga existiendo con su rol; si el administrador lo eliminó, su sesión
// vieja ya no sirve (antes solo se revisaba para administradores).

const PersonaModel = require('../models/personaModel');

// Revisa la sesión. Devuelve true si puede seguir; si no, ya respondió el error.
//   roles   -> lista de roles permitidos (vacía = cualquier rol)
//   mensaje -> texto del error 403 cuando el rol no está permitido
async function revisarSesion(req, res, roles = [], mensaje = '') {
  const usuario = req.session.usuario;

  if (!usuario) {
    res.status(401).json({ error: 'Debes iniciar sesión.' });
    return false;
  }
  if (roles.length > 0 && !roles.includes(usuario.rol)) {
    res.status(403).json({ error: mensaje });
    return false;
  }

  try {
    if (!(await PersonaModel.tieneRol(usuario.numero_id, usuario.rol))) {
      req.session.destroy(() => {});
      res.status(401).json({ error: 'Tu cuenta fue suspendida o ya no existe. Comunícate con el administrador.' });
      return false;
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
    return false;
  }
  return true;
}

// Solo deja pasar al usuario con sesión iniciada y rol "administrador"
async function soloAdmin(req, res, next) {
  if (await revisarSesion(req, res, ['administrador'], 'Solo el administrador puede realizar esta acción.')) next();
}

// Solo deja pasar al usuario con sesión iniciada y rol "agente" o "administrador"
async function soloAgenteOAdmin(req, res, next) {
  if (await revisarSesion(req, res, ['agente', 'administrador'], 'Solo agentes o administradores pueden realizar esta acción.')) next();
}

// Solo deja pasar a quien tenga sesión iniciada (cualquier rol).
// El controlador decide después qué puede ver o hacer según el rol.
async function conSesion(req, res, next) {
  if (await revisarSesion(req, res)) next();
}

// Solo deja pasar al usuario con sesión iniciada y rol "cliente"
// (por ejemplo: crear una reserva).
async function soloCliente(req, res, next) {
  if (await revisarSesion(req, res, ['cliente'], 'Solo los clientes pueden realizar esta acción.')) next();
}

module.exports = { soloAdmin, soloAgenteOAdmin, conSesion, soloCliente };