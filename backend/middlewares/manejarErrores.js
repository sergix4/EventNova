// middlewares/manejarErrores.js
// Sprint 3 · Tarea 16: ÚLTIMO middleware de app.js. Recibe cualquier error que
// no atrapó un controlador y responde SIEMPRE en JSON con un mensaje genérico.
// El detalle técnico (consulta SQL, rutas de archivos, traza) solo se escribe
// en la consola del servidor; el usuario nunca lo ve.
function manejarErrores(err, req, res, next) {
  // Si ya se empezó a enviar la respuesta, Express se encarga
  if (res.headersSent) return next(err);

  // El navegador mandó un JSON mal escrito
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ error: "Los datos enviados no tienen un formato válido." });
  }
  // El cuerpo de la petición pesa más de lo permitido (5 MB)
  if (err.type === "entity.too.large") {
    return res
      .status(413)
      .json({ error: "Los datos enviados son demasiado grandes." });
  }

  console.error(
    `Error no controlado en ${req.method} ${req.originalUrl}:`,
    err,
  );
  res.status(500).json({ error: "Error interno del servidor." });
}

module.exports = manejarErrores;
