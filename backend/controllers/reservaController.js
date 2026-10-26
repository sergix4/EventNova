// controllers/reservaController.js
// CONTROLADOR de reservas (Sprint 2 · Tarea 6): valida los datos que llegan,
// revisa qué puede hacer cada rol y responde en JSON.
//
// Quién puede hacer qué:
//   - Cliente:        crear reservas, ver las suyas, editar las suyas mientras
//                     estén "Reservada" y cancelarlas.
//   - Agente:         ver las reservas de SUS eventos, confirmarlas o cancelarlas
//                     (con causa).
//   - Administrador:  ver todas, editar, cambiar estado y eliminar.
//
// El valor total (6.1) y la validación de cupos (6.2) los hace el Modelo
// dentro de una transacción, así que aquí solo se traducen sus errores.
const ReservaModel = require('../models/reservaModel');

// Máximo de entradas por reserva (el mismo tope que tiene el botón "+" de la vista)
const MAX_ENTRADAS = 10;
const MAX_OBSERVACIONES = 500;
// Largo máximo de la causa de cancelación (el mismo maxlength de las ventanas)
const MAX_CAUSA = 300;
// Estados del EVENTO en los que ya no se puede confirmar una reserva (Tarea 8)
const EVENTO_CERRADO = ['Finalizado', 'Cancelado'];

// Valida y limpia numero_entradas y observaciones.
// Devuelve { error } o { datos }.
function validarEntradas(body) {
  const numero_entradas = Number(body.numero_entradas);
  const observaciones = (body.observaciones || '').trim() || null;

  if (!Number.isInteger(numero_entradas) || numero_entradas <= 0) {
    return { error: 'El número de entradas debe ser un número entero mayor a 0.' };
  }
  if (numero_entradas > MAX_ENTRADAS) {
    return { error: `Puedes reservar máximo ${MAX_ENTRADAS} entradas por reserva.` };
  }
  if (observaciones && observaciones.length > MAX_OBSERVACIONES) {
    return { error: `Las observaciones no pueden superar ${MAX_OBSERVACIONES} caracteres.` };
  }
  return { datos: { numero_entradas, observaciones } };
}

// ¿El usuario en sesión puede VER esta reserva?
function puedeVer(usuario, reserva) {
  if (usuario.rol === 'administrador') return true;
  if (usuario.rol === 'cliente') return String(reserva.id_cliente) === String(usuario.numero_id);
  if (usuario.rol === 'agente') return String(reserva.id_agente) === String(usuario.numero_id);
  return false;
}

// Traduce los errores del Modelo (err.codigo) a una respuesta HTTP
function responderErrorModelo(res, err, accion) {
  if (err.codigo === 'EVENTO_NO_EXISTE') {
    return res.status(404).json({ error: err.message });
  }
  if (err.codigo === 'EVENTO_NO_DISPONIBLE') {
    return res.status(409).json({ error: err.message });
  }
  if (err.codigo === 'SIN_CUPOS') {
    return res.status(409).json({ error: err.message, disponibles: err.disponibles });
  }
    if (err.codigo === 'MAXIMO_ENTRADAS') {
    return res.status(409).json({ error: err.message });
  }
  if (err.code === '23503') {
    // FK: el usuario en sesión no está en la tabla CLIENTE, o el evento no existe
    return res.status(400).json({ error: 'El cliente o el evento no existen en la base de datos.' });
  }
  console.error(`Error al ${accion} reserva:`, err);
  return res.status(500).json({ error: 'Error interno del servidor.' });
}

const reservaController = {
  // GET /api/reservas?id_evento=&id_estado_reserva=&id_cliente=&id_agente=
  // Cada rol ve solo lo que le corresponde:
  //   cliente -> sus reservas · agente -> reservas de sus eventos · admin -> todas
  async listar(req, res) {
    const usuario = req.session.usuario;
    const filtros = {};

    for (const campo of ['id_evento', 'id_estado_reserva']) {
      if (req.query[campo]) {
        const valor = Number(req.query[campo]);
        if (!Number.isInteger(valor) || valor <= 0) {
          return res.status(400).json({ error: `El filtro ${campo} no es válido.` });
        }
        filtros[campo] = valor;
      }
    }

    if (usuario.rol === 'cliente') {
      filtros.id_cliente = usuario.numero_id;
    } else if (usuario.rol === 'agente') {
      filtros.id_agente = usuario.numero_id;
    } else {
      // administrador: puede filtrar por cliente o por agente si quiere
      if (req.query.id_cliente) filtros.id_cliente = String(req.query.id_cliente).trim();
      if (req.query.id_agente) filtros.id_agente = String(req.query.id_agente).trim();
    }

    try {
      const reservas = await ReservaModel.getAll(filtros);
      res.json(reservas);
    } catch (err) {
      console.error('Error al listar reservas:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // GET /api/reservas/estados
  async listarEstados(req, res) {
    try {
      res.json(await ReservaModel.getEstados());
    } catch (err) {
      console.error('Error al listar estados de reserva:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // GET /api/reservas/cupos/:idEvento  (público: lo usa el detalle del evento)
  async cupos(req, res) {
    const { idEvento } = req.params;
    try {
      const disponibles = await ReservaModel.cuposDisponibles(idEvento);
      if (disponibles === undefined) {
        return res.status(404).json({ error: 'Evento no encontrado.' });
      }
      res.json({ id_evento: Number(idEvento), disponibles });
    } catch (err) {
      console.error('Error al consultar cupos:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // GET /api/reservas/:id
  async obtener(req, res) {
    try {
      const reserva = await ReservaModel.getById(req.params.id);
      if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada.' });
      if (!puedeVer(req.session.usuario, reserva)) {
        return res.status(403).json({ error: 'No tienes permiso para ver esta reserva.' });
      }
      res.json(reserva);
    } catch (err) {
      console.error('Error al obtener reserva:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // POST /api/reservas  (solo cliente)
  // body: { id_evento, numero_entradas, observaciones }
  async crear(req, res) {
    const id_evento = Number(req.body.id_evento);
    if (!Number.isInteger(id_evento) || id_evento <= 0) {
      return res.status(400).json({ error: 'Debes indicar un evento válido.' });
    }
    const { error, datos } = validarEntradas(req.body);
    if (error) return res.status(400).json({ error });

    try {
      // La reserva queda a nombre del cliente en sesión (nunca se toma del body)
      // Si ya tenía una reserva activa de este evento, el Modelo le suma las
      // entradas (responde 200 con entradas_agregadas); si no, crea una (201).
      const reserva = await ReservaModel.create(
        { id_evento, ...datos },
        req.session.usuario.numero_id,
        MAX_ENTRADAS,
      );
      res.status(reserva.entradas_agregadas ? 200 : 201).json(reserva);
    } catch (err) {
      responderErrorModelo(res, err, 'crear');
    }
  },

  // PUT /api/reservas/:id  (cliente dueño o administrador)
  // body: { numero_entradas, observaciones }
  // Solo se puede editar mientras la reserva esté "Reservada".
  async actualizar(req, res) {
    const { id } = req.params;
    const usuario = req.session.usuario;
    const { error, datos } = validarEntradas(req.body);
    if (error) return res.status(400).json({ error });

    try {
      const actual = await ReservaModel.getById(id);
      if (!actual) return res.status(404).json({ error: 'Reserva no encontrada.' });

      const esDueno = usuario.rol === 'cliente'
        && String(actual.id_cliente) === String(usuario.numero_id);
      if (!esDueno && usuario.rol !== 'administrador') {
        return res.status(403).json({ error: 'No tienes permiso para modificar esta reserva.' });
      }
      if (actual.estado_reserva !== 'Reservada') {
        return res.status(409).json({
          error: `Solo se puede modificar una reserva en estado Reservada (esta está ${actual.estado_reserva}).`,
        });
      }

      const actualizada = await ReservaModel.update(id, datos);
      res.json(actualizada);
    } catch (err) {
      responderErrorModelo(res, err, 'actualizar');
    }
  },

  // PATCH /api/reservas/:id/estado
    // body: { id_estado_reserva, causa_cancelacion, entradas_cancelar (opcional) }
  // Cambios permitidos: Reservada -> Confirmada / Cancelada · Confirmada -> Cancelada
  //   cliente: solo puede CANCELAR sus propias reservas
  //   agente:  confirma o cancela reservas de sus eventos (causa obligatoria al cancelar)
  //   admin:   confirma o cancela cualquier reserva (causa obligatoria al cancelar)
  async cambiarEstado(req, res) {
    const { id } = req.params;
    const usuario = req.session.usuario;
    const idEstado = Number(req.body.id_estado_reserva);
    let causa = (req.body.causa_cancelacion || '').trim() || null;

    if (!Number.isInteger(idEstado) || idEstado <= 0) {
      return res.status(400).json({ error: 'Debes indicar un estado válido.' });
    }

    try {
      const actual = await ReservaModel.getById(id);
      if (!actual) return res.status(404).json({ error: 'Reserva no encontrada.' });
      if (!puedeVer(usuario, actual)) {
        return res.status(403).json({ error: 'No tienes permiso para cambiar esta reserva.' });
      }

      const estados = await ReservaModel.getEstados();
      const destino = estados.find((e) => Number(e.id_estado_reserva) === idEstado);
      if (!destino) return res.status(400).json({ error: 'El estado seleccionado no existe.' });

      // Reglas de cambio de estado
      if (actual.estado_reserva === 'Cancelada') {
        return res.status(409).json({ error: 'Una reserva cancelada ya no se puede cambiar.' });
      }
      if (destino.nombre_estado === actual.estado_reserva) {
        return res.status(400).json({ error: `La reserva ya está ${actual.estado_reserva}.` });
      }
      if (destino.nombre_estado === 'Reservada') {
        return res.status(400).json({ error: 'Una reserva no puede volver al estado Reservada.' });
      }
      if (usuario.rol === 'cliente' && destino.nombre_estado !== 'Cancelada') {
        return res.status(403).json({ error: 'Como cliente solo puedes cancelar tus reservas.' });
      }
      // Tarea 8: no se confirma una reserva de un evento que ya terminó o se canceló
      if (destino.nombre_estado === 'Confirmada' && EVENTO_CERRADO.includes(actual.estado_evento)) {
        return res.status(409).json({ error: `No se puede confirmar: el evento está ${actual.estado_evento}.` });
      }

      if (destino.nombre_estado === 'Cancelada') {
        if (usuario.rol === 'cliente') {
          causa = causa || 'Cancelada por el cliente.';
        } else if (!causa) {
          return res.status(400).json({ error: 'Debes indicar la causa de la cancelación.' });
        }
        if (causa.length > MAX_CAUSA) {
          return res.status(400).json({ error: `La causa no puede superar ${MAX_CAUSA} caracteres.` });
        }

        // Cancelación PARCIAL: body.entradas_cancelar = cuántas entradas cancelar.
        // Si son menos que las de la reserva, solo se quitan esas entradas y la
        // reserva sigue activa. Si son todas (o no se envía), se cancela completa.
        if (req.body.entradas_cancelar !== undefined && req.body.entradas_cancelar !== null) {
          const cantidad = Number(req.body.entradas_cancelar);
          if (!Number.isInteger(cantidad) || cantidad <= 0 || cantidad > actual.numero_entradas) {
            return res.status(400).json({ error: `Debes cancelar entre 1 y ${actual.numero_entradas} entradas.` });
          }
          if (cantidad < actual.numero_entradas) {
            const quien = { cliente: 'El cliente', agente: 'El agente' }[usuario.rol] || 'El administrador';
            const fecha = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' });
            const nota = `[${fecha}] ${quien} canceló ${cantidad} de ${actual.numero_entradas} entradas. Causa: ${causa}`;
            const parcial = await ReservaModel.cancelarEntradas(id, cantidad, nota);
            return res.json(parcial);
          }
        }
      }

      const actualizada = await ReservaModel.cambiarEstado(id, idEstado, causa);
      res.json(actualizada);
    } catch (err) {
      responderErrorModelo(res, err, 'cambiar el estado de la');
    }
  },

  // DELETE /api/reservas/:id  (solo administrador)
  async eliminar(req, res) {
    try {
      const eliminada = await ReservaModel.remove(req.params.id);
      if (!eliminada) return res.status(404).json({ error: 'Reserva no encontrada.' });
      res.json({ mensaje: 'Reserva eliminada correctamente.' });
    } catch (err) {
      console.error('Error al eliminar reserva:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },
};

module.exports = reservaController;