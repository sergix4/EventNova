// middlewares/limiteLogin.js
// Protege el inicio de sesión contra "fuerza bruta" (probar contraseñas sin parar).
// Regla: 5 intentos FALLIDOS con el mismo correo desde la misma IP bloquean
// ese correo en esa IP durante 15 minutos. Un inicio de sesión exitoso borra el conteo.
// Los intentos se guardan en memoria (se reinician si se reinicia el servidor).

const MAX_INTENTOS = 5;
const BLOQUEO_MS = 15 * 60 * 1000; // 15 minutos

// clave "ip|correo" -> { fallos, bloqueadoHasta, ultimoIntento }
const intentos = new Map();

// Cada 15 minutos se borran los registros viejos para no llenar la memoria
setInterval(() => {
  const ahora = Date.now();
  for (const [clave, dato] of intentos) {
    if (ahora - dato.ultimoIntento > BLOQUEO_MS && dato.bloqueadoHasta < ahora) {
      intentos.delete(clave);
    }
  }
}, BLOQUEO_MS).unref();

function limiteLogin(req, res, next) {
  const correo = String(req.body?.correo || "").trim().toLowerCase();
  const clave = `${req.ip}|${correo}`;
  const ahora = Date.now();
  const dato = intentos.get(clave) || { fallos: 0, bloqueadoHasta: 0, ultimoIntento: ahora };

  // ¿Está bloqueado?
  if (dato.bloqueadoHasta > ahora) {
    const minutos = Math.ceil((dato.bloqueadoHasta - ahora) / 60000);
    return res.status(429).json({
      error: `Demasiados intentos fallidos. Intenta de nuevo en ${minutos} ${minutos === 1 ? "minuto" : "minutos"}.`,
    });
  }

  // Cuando el controlador responda, se revisa si el intento falló o funcionó
  res.on("finish", () => {
    if (res.statusCode === 401) {
      dato.fallos += 1;
      dato.ultimoIntento = Date.now();
      if (dato.fallos >= MAX_INTENTOS) {
        dato.bloqueadoHasta = Date.now() + BLOQUEO_MS;
        dato.fallos = 0;
      }
      intentos.set(clave, dato);
    } else if (res.statusCode === 200) {
      intentos.delete(clave); // entró bien: se olvidan los fallos
    }
  });

  next();
}

module.exports = limiteLogin;