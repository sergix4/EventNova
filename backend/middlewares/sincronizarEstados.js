// middlewares/sincronizarEstados.js
// Antes de responder cualquier petición de /api/eventos o /api/reservas,
// pone al día los estados automáticos de los eventos:
//   - si ya llegó la hora de inicio -> "En Vivo"
//   - si ya llegó la hora de fin    -> "Finalizado"
// Así, cada vez que alguien abre una página, ve el estado real del evento.
const EventoModel = require('../models/eventoModel');

async function sincronizarEstados(req, res, next) {
  try {
    await EventoModel.actualizarEstadosAutomaticos();
  } catch (error) {
    // Si falla, la página sigue funcionando con los estados que ya había
    console.error('No se pudieron actualizar los estados automáticos:', error.message);
  }
  next();
}

module.exports = sincronizarEstados;