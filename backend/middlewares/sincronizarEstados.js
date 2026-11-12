// middlewares/sincronizarEstados.js
// Antes de responder cualquier petición de /api/eventos o /api/reservas,
// pone al día los estados automáticos de los eventos:
//   - si ya llegó la hora de inicio -> "En Vivo"
//   - si ya llegó la hora de fin    -> "Finalizado"
// Así, cada vez que alguien abre una página, ve el estado real del evento.
//
// Ajustes finales: se actualiza como MÁXIMO una vez cada 30 segundos. Antes se
// hacían 3 UPDATE en CADA petición (una página con 10 tarjetas = 10 veces),
// lo que llenaba de trabajo la conexión con Neon sin necesidad.
const EventoModel = require('../models/eventoModel');

const CADA = 30 * 1000; // 30 segundos
let ultimaVez = 0;
let enCurso = null; // si llegan varias peticiones a la vez, esperan la MISMA actualización

async function sincronizarEstados(req, res, next) {
  if (Date.now() - ultimaVez >= CADA) {
    if (!enCurso) {
      enCurso = EventoModel.actualizarEstadosAutomaticos()
        .then(() => { ultimaVez = Date.now(); })
        .catch((error) => {
          // Si falla, la página sigue funcionando con los estados que ya había
          console.error('No se pudieron actualizar los estados automáticos:', error.message);
        })
        .finally(() => { enCurso = null; });
    }
    await enCurso;
  }
  next();
}

module.exports = sincronizarEstados;