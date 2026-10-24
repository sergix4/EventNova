// middlewares/authMiddleware.js
// Un "middleware" es una función que se ejecuta ANTES del controlador.
// Si el usuario no cumple la condición, responde con error y el controlador nunca se ejecuta.

// Solo deja pasar al usuario con sesión iniciada y rol "administrador"
function soloAdmin(req, res, next) {
  const usuario = req.session.usuario;

  if (!usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  if (usuario.rol !== 'administrador') {
    return res.status(403).json({ error: 'Solo el administrador puede realizar esta acción.' });
  }

next(); // todo bien: sigue hacia el controlador
}

// Solo deja pasar al usuario con sesión iniciada y rol "agente" o "administrador"
function soloAgenteOAdmin(req, res, next) {
  const usuario = req.session.usuario;

  if (!usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  if (usuario.rol !== 'agente' && usuario.rol !== 'administrador') {
    return res.status(403).json({ error: 'Solo agentes o administradores pueden realizar esta acción.' });
  }

  next();
}

// Solo deja pasar a quien tenga sesión iniciada (cualquier rol).
// El controlador decide después qué puede ver o hacer según el rol.
function conSesion(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  next();
}

// Solo deja pasar al usuario con sesión iniciada y rol "cliente"
// (por ejemplo: crear una reserva).
function soloCliente(req, res, next) {
  const usuario = req.session.usuario;

  if (!usuario) {
    return res.status(401).json({ error: 'Debes iniciar sesión.' });
  }
  if (usuario.rol !== 'cliente') {
    return res.status(403).json({ error: 'Solo los clientes pueden realizar esta acción.' });
  }

  next();
}

module.exports = { soloAdmin, soloAgenteOAdmin, conSesion, soloCliente };