// controllers/eventoController.js
// CONTROLADOR de eventos: valida los datos del formulario, verifica permisos
// por rol (agente vs administrador) y responde en JSON.
const EventoModel = require('../models/eventoModel');
const CiudadModel = require('../models/ciudadModel');

// Valida y limpia los campos de creación/edición de un evento.
// Devuelve { error } o { datos } listos para enviar al Modelo.
function validarDatosEvento(body) {
  const nombre_evento = (body.nombre_evento || '').trim();
  const descripcion_evento = (body.descripcion_evento || '').trim() || null;
  const teatro = (body.teatro || '').trim();
  const direccion_evento = (body.direccion_evento || '').trim() || null;
  const id_ciudad = Number(body.id_ciudad);
  const fecha_inicio = (body.fecha_inicio || '').trim();
  const fecha_fin = (body.fecha_fin || '').trim();
  const capacidad = Number(body.capacidad);
  const precio_base = Number(body.precio_base);
  const observaciones = (body.observaciones || '').trim() || null;
  const imagen_evento = (body.imagen_evento || '').trim() || null;

  if (!nombre_evento) return { error: 'El nombre del evento es obligatorio.' };
  if (!teatro) return { error: 'El teatro o lugar del evento es obligatorio.' };
  if (!Number.isInteger(id_ciudad) || id_ciudad <= 0) {
    return { error: 'Debes seleccionar una ciudad válida.' };
  }
  if (!fecha_inicio || !fecha_fin) {
    return { error: 'Las fechas de inicio y fin son obligatorias.' };
  }

  const inicioMs = Date.parse(fecha_inicio);
  const finMs = Date.parse(fecha_fin);
  if (Number.isNaN(inicioMs) || Number.isNaN(finMs)) {
    return { error: 'El formato de las fechas no es válido.' };
  }
  if (finMs <= inicioMs) {
    return { error: 'La fecha de finalización debe ser posterior a la fecha de inicio.' };
  }

  if (!Number.isInteger(capacidad) || capacidad <= 0) {
    return { error: 'La capacidad debe ser un número entero mayor a 0.' };
  }
  if (body.precio_base === '' || body.precio_base === undefined || Number.isNaN(precio_base) || precio_base < 0) {
    return { error: 'El precio base debe ser un número mayor o igual a 0.' };
  }

  return {
    datos: {
      nombre_evento,
      descripcion_evento,
      teatro,
      direccion_evento,
      id_ciudad,
      fecha_inicio,
      fecha_fin,
      capacidad,
      precio_base,
      observaciones,
      imagen_evento,
    },
  };
}

// Verifica si el usuario en sesión tiene permiso sobre un evento específico.
// El administrador puede gestionar cualquiera; el agente solo los suyos.
function tienePermisoSobreEvento(usuario, evento) {
  if (!usuario) return false;
  if (usuario.rol === 'administrador') return true;
  return usuario.rol === 'agente' && String(evento.id_agente) === String(usuario.numero_id);
}

const eventoController = {
  // GET /api/eventos?id_estado=...&id_ciudad=...&id_agente=...&mis_eventos=1
  async listar(req, res) {
    try {
      const filtros = {};

      if (req.query.id_estado) {
        const idEstado = Number(req.query.id_estado);
        if (Number.isInteger(idEstado) && idEstado > 0) filtros.id_estado = idEstado;
      }
      if (req.query.id_ciudad) {
        const idCiudad = Number(req.query.id_ciudad);
        if (Number.isInteger(idCiudad) && idCiudad > 0) filtros.id_ciudad = idCiudad;
      }
      if (req.query.id_agente) {
        filtros.id_agente = String(req.query.id_agente).trim();
      }

      // Si un agente pide ?mis_eventos=1, filtramos automáticamente por su numero_id en sesión
      if (req.query.mis_eventos === '1' && req.session.usuario?.rol === 'agente') {
        filtros.id_agente = req.session.usuario.numero_id;
      }

      const eventos = await EventoModel.getAll(filtros);
      res.json(eventos);
    } catch (error) {
      console.error('Error al listar eventos:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

    // GET /api/eventos/catalogo?id_pais=&id_departamento=&id_ciudad=&fecha_desde=AAAA-MM-DD&fecha_hasta=AAAA-MM-DD
  // Público: lo usa el cliente para ver los eventos disponibles.
  async catalogo(req, res) {
    const filtros = {};

    // Filtros de ubicación: deben ser enteros positivos
    for (const campo of ['id_pais', 'id_departamento', 'id_ciudad']) {
      if (req.query[campo]) {
        const valor = Number(req.query[campo]);
        if (!Number.isInteger(valor) || valor <= 0) {
          return res.status(400).json({ error: `El filtro ${campo} no es válido.` });
        }
        filtros[campo] = valor;
      }
    }

    // Filtros de fecha: formato AAAA-MM-DD (el que entrega <input type="date">)
    const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
    for (const campo of ['fecha_desde', 'fecha_hasta']) {
      const valor = (req.query[campo] || '').trim();
      if (!valor) continue;
      if (!FORMATO_FECHA.test(valor) || Number.isNaN(Date.parse(valor))) {
        return res.status(400).json({ error: 'El formato de la fecha debe ser AAAA-MM-DD.' });
      }
      filtros[campo] = valor;
    }

    if (filtros.fecha_desde && filtros.fecha_hasta && filtros.fecha_desde > filtros.fecha_hasta) {
      return res.status(400).json({ error: 'La fecha "desde" no puede ser posterior a la fecha "hasta".' });
    }

    try {
      const eventos = await EventoModel.getCatalogo(filtros);
      res.json(eventos);
    } catch (error) {
      console.error('Error al consultar el catálogo de eventos:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // GET /api/eventos/catalogo/ciudades (ciudades con eventos disponibles, para los filtros)
  async ciudadesCatalogo(req, res) {
    try {
      const ciudades = await EventoModel.getCiudadesCatalogo();
      res.json(ciudades);
    } catch (error) {
      console.error('Error al listar las ciudades del catálogo:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // GET /api/eventos/estados
  async listarEstados(req, res) {
    try {
      const estados = await EventoModel.getEstados();
      res.json(estados);
    } catch (error) {
      console.error('Error al listar estados de evento:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // GET /api/eventos/agentes
  async listarAgentes(req, res) {
    try {
      const agentes = await EventoModel.getAgentes();
      res.json(agentes);
    } catch (error) {
      console.error('Error al listar agentes:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // GET /api/eventos/:id
  async obtener(req, res) {
    try {
      const evento = await EventoModel.getById(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento no encontrado.' });
      res.json(evento);
    } catch (error) {
      console.error('Error al obtener evento:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // POST /api/eventos (solo agente o administrador)
  async crear(req, res) {
    const { error, datos } = validarDatosEvento(req.body);
    if (error) return res.status(400).json({ error });

    const usuario = req.session.usuario;
    // Si es agente, el evento queda a su nombre. Si es admin, debe indicar id_agente en el body.
    const idAgente = usuario.rol === 'agente'
      ? usuario.numero_id
      : (req.body.id_agente || '').trim();

    if (!idAgente) {
      return res.status(400).json({ error: 'Debes seleccionar el agente responsable del evento.' });
    }

    try {
      if (!(await CiudadModel.getById(datos.id_ciudad))) {
        return res.status(400).json({ error: 'La ciudad seleccionada no existe.' });
      }

      const evento = await EventoModel.create(datos, idAgente);
      res.status(201).json(evento);
    } catch (err) {
      if (err.code === '23503') {
        return res.status(400).json({ error: 'El agente o la ciudad seleccionada no existe en la base de datos.' });
      }
      console.error('Error al crear evento:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // PUT /api/eventos/:id (solo el agente dueño o un administrador)
  async actualizar(req, res) {
    const { id } = req.params;
    const { error, datos } = validarDatosEvento(req.body);
    if (error) return res.status(400).json({ error });

    try {
      const actual = await EventoModel.getById(id);
      if (!actual) return res.status(404).json({ error: 'Evento no encontrado.' });

      if (!tienePermisoSobreEvento(req.session.usuario, actual)) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este evento.' });
      }

      if (!(await CiudadModel.getById(datos.id_ciudad))) {
        return res.status(400).json({ error: 'La ciudad seleccionada no existe.' });
      }

      const actualizado = await EventoModel.update(id, datos);
      res.json(actualizado);
    } catch (err) {
      console.error('Error al actualizar evento:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // PATCH /api/eventos/:id/estado (cambiar estado del evento)
  async cambiarEstado(req, res) {
    const { id } = req.params;
    const idEstado = Number(req.body.id_estado);
    const causaCancelacion = (req.body.causa_cancelacion || '').trim() || null;

    if (!Number.isInteger(idEstado) || idEstado <= 0) {
      return res.status(400).json({ error: 'Debes indicar un estado válido.' });
    }

    try {
      const actual = await EventoModel.getById(id);
      if (!actual) return res.status(404).json({ error: 'Evento no encontrado.' });

      if (!tienePermisoSobreEvento(req.session.usuario, actual)) {
        return res.status(403).json({ error: 'No tienes permiso para cambiar el estado de este evento.' });
      }

      const estados = await EventoModel.getEstados();
      const estadoDestino = estados.find((e) => Number(e.id_estado) === idEstado);
      if (!estadoDestino) {
        return res.status(400).json({ error: 'El estado seleccionado no existe.' });
      }

      if (estadoDestino.nombre_estado === 'Cancelado' && !causaCancelacion) {
        return res.status(400).json({ error: 'Debes indicar la causa de cancelación.' });
      }

      const actualizado = await EventoModel.cambiarEstado(
        id,
        idEstado,
        estadoDestino.nombre_estado === 'Cancelado' ? causaCancelacion : null,
      );
      res.json(actualizado);
    } catch (err) {
      console.error('Error al cambiar estado del evento:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },

  // DELETE /api/eventos/:id (no permite borrar si tiene reservas)
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const actual = await EventoModel.getById(id);
      if (!actual) return res.status(404).json({ error: 'Evento no encontrado.' });

      if (!tienePermisoSobreEvento(req.session.usuario, actual)) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este evento.' });
      }

      if (await EventoModel.tieneReservas(id)) {
        return res.status(409).json({ error: 'No se puede eliminar el evento porque ya tiene reservas asociadas.' });
      }

      await EventoModel.remove(id);
      res.json({ mensaje: 'Evento eliminado correctamente.' });
    } catch (err) {
      if (err.code === '23503') {
        return res.status(409).json({ error: 'No se puede eliminar el evento porque tiene registros asociados.' });
      }
      console.error('Error al eliminar evento:', err);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },
};

module.exports = eventoController;