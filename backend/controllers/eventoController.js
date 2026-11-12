// controllers/eventoController.js
// CONTROLADOR de eventos: valida los datos del formulario, verifica permisos
// por rol (agente vs administrador) y responde en JSON.
const EventoModel = require("../models/eventoModel");
const CiudadModel = require("../models/ciudadModel");
const PlanModel = require("../models/planModel");
const ReservaModel = require("../models/reservaModel");
const { texto } = require("../utils/texto");

// ─── Reglas de negocio de fechas ────────────────────────────────────────────
const DURACION_MINIMA_HORAS = 1; // un evento dura mínimo 1 hora
const ANTICIPACION_MINIMA_HORAS = 24; // se registra con mínimo 24 horas de anticipación
const UNA_HORA_MS = 60 * 60 * 1000;

// D1: convierte la fecha a "AAAA-MM-DD HH:mm:ss" en hora de Colombia
// (app.js fija process.env.TZ = "America/Bogota"). Así una fecha que llega
// con zona ("...Z") no se guarda corrida 5 horas.
function aHoraLocal(ms) {
  const d = new Date(ms);
  const dos = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())} ` +
    `${dos(d.getHours())}:${dos(d.getMinutes())}:${dos(d.getSeconds())}`
  );
}

// ─── Tarea 16: largos y topes (los mismos del formulario y de develop.sql) ──
const MAX_NOMBRE = 150; // VARCHAR(150)
const MAX_TEATRO = 150; // VARCHAR(150)
const MAX_DIRECCION = 255; // VARCHAR(255)
const MAX_DESCRIPCION = 2000;
const MAX_OBSERVACIONES = 1000;
const MAX_CAUSA = 300; // igual que la causa de cancelación de una reserva
const CAPACIDAD_MAXIMA = 100000;
const PRECIO_MAXIMO = 99999999; // NUMERIC(10, 2) no admite más
// La imagen llega como data URL: "data:image/png;base64,iVBOR..."
const IMAGEN_VALIDA =
  /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/]+=*$/;
const MAX_IMAGEN = 2900000; // ~2 MB de archivo convertidos a base64

// ─── Reglas de cambio de estado ─────────────────────────────────────────────
// A qué estados puede pasar el agente/admin A MANO desde cada estado.
// "En Vivo" y "Finalizado" NO están en ninguna lista: los pone el sistema solo.
const TRANSICIONES_MANUALES = {
  Programado: ["En Boletería", "Cancelado"],
  "En Boletería": ["Cancelado"],
  "En Vivo": [],
  Finalizado: [],
  Cancelado: [],
};
const ESTADOS_AUTOMATICOS = ["En Vivo", "Finalizado"];
// Estados en los que el evento ya no se puede editar
const ESTADOS_NO_EDITABLES = ["En Vivo", "Finalizado", "Cancelado"];

// Valida y limpia los campos de creación/edición de un evento.
// opciones.validarAnticipacion: revisa que el inicio no haya pasado y que falten
// mínimo 24 h (al crear siempre; al editar, solo si se cambió la fecha de inicio).
// Devuelve { error } o { datos } listos para enviar al Modelo.
function validarDatosEvento(body, { validarAnticipacion = true } = {}) {
  const nombre_evento = texto(body.nombre_evento);
  const descripcion_evento = texto(body.descripcion_evento) || null;
  const teatro = texto(body.teatro);
  const direccion_evento = texto(body.direccion_evento) || null;
  const id_ciudad = Number(body.id_ciudad);
  const fecha_inicio = texto(body.fecha_inicio);
  const fecha_fin = texto(body.fecha_fin);
  const capacidad = Number(body.capacidad);
  const precio_base = Number(body.precio_base);
  const observaciones = texto(body.observaciones) || null;
  const imagen_evento = texto(body.imagen_evento) || null;

  // Tarea 16: obligatorios y largos máximos (el formulario exige lo mismo)
  if (!nombre_evento) return { error: "El nombre del evento es obligatorio." };
  if (nombre_evento.length > MAX_NOMBRE)
    return {
      error: `El nombre del evento no puede superar ${MAX_NOMBRE} caracteres.`,
    };
  if (!descripcion_evento)
    return { error: "La descripción del evento es obligatoria." };
  if (descripcion_evento.length > MAX_DESCRIPCION)
    return {
      error: `La descripción no puede superar ${MAX_DESCRIPCION} caracteres.`,
    };
  if (!teatro) return { error: "El teatro o lugar del evento es obligatorio." };
  if (teatro.length > MAX_TEATRO)
    return { error: `El teatro no puede superar ${MAX_TEATRO} caracteres.` };
  if (!direccion_evento)
    return { error: "La dirección del evento es obligatoria." };
  if (direccion_evento.length > MAX_DIRECCION)
    return {
      error: `La dirección no puede superar ${MAX_DIRECCION} caracteres.`,
    };
  if (observaciones && observaciones.length > MAX_OBSERVACIONES)
    return {
      error: `Las observaciones no pueden superar ${MAX_OBSERVACIONES} caracteres.`,
    };

  if (!Number.isInteger(id_ciudad) || id_ciudad <= 0) {
    return { error: "Debes seleccionar una ciudad válida." };
  }
  if (!fecha_inicio || !fecha_fin) {
    return { error: "Las fechas de inicio y fin son obligatorias." };
  }

  const inicioMs = Date.parse(fecha_inicio);
  const finMs = Date.parse(fecha_fin);
  if (Number.isNaN(inicioMs) || Number.isNaN(finMs)) {
    return { error: "El formato de las fechas no es válido." };
  }
  if (finMs <= inicioMs) {
    return {
      error:
        "La fecha de finalización debe ser posterior a la fecha de inicio.",
    };
  }
  if (finMs - inicioMs < DURACION_MINIMA_HORAS * UNA_HORA_MS) {
    return {
      error: `El evento debe durar mínimo ${DURACION_MINIMA_HORAS} hora.`,
    };
  }
  if (validarAnticipacion) {
    const ahora = Date.now();
    if (inicioMs <= ahora) {
      return {
        error: "La fecha y hora de inicio ya pasaron. Elige una fecha futura.",
      };
    }
    if (inicioMs - ahora < ANTICIPACION_MINIMA_HORAS * UNA_HORA_MS) {
      return {
        error: `El evento debe registrarse con mínimo ${ANTICIPACION_MINIMA_HORAS} horas de anticipación.`,
      };
    }
  }

  if (
    !Number.isInteger(capacidad) ||
    capacidad <= 0 ||
    capacidad > CAPACIDAD_MAXIMA
  ) {
    return {
      error: `La capacidad debe ser un número entero entre 1 y ${CAPACIDAD_MAXIMA.toLocaleString("es-CO")}.`,
    };
  }
  if (
    body.precio_base === "" ||
    body.precio_base === undefined ||
    body.precio_base === null ||
    Number.isNaN(precio_base) ||
    precio_base < 0 ||
    precio_base > PRECIO_MAXIMO
  ) {
    return {
      error: `El precio base debe ser un número entre 0 y ${PRECIO_MAXIMO.toLocaleString("es-CO")}.`,
    };
  }
  // La imagen es opcional, pero si viene debe ser PNG, JPG, WEBP o GIF en base64.
  // Así nadie puede guardar un texto raro que luego se pinte dentro de <img src="...">
  if (
    imagen_evento &&
    (imagen_evento.length > MAX_IMAGEN || !IMAGEN_VALIDA.test(imagen_evento))
  ) {
    return {
      error: "La imagen debe ser PNG, JPG, WEBP o GIF y pesar máximo 2 MB.",
    };
  }

  return {
    datos: {
      nombre_evento,
      descripcion_evento,
      teatro,
      direccion_evento,
      id_ciudad,
      fecha_inicio: aHoraLocal(inicioMs),
      fecha_fin: aHoraLocal(finMs),
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
  if (usuario.rol === "administrador") return true;
  return (
    usuario.rol === "agente" &&
    String(evento.id_agente) === String(usuario.numero_id)
  );
}

// La cédula del agente (id_agente) es un dato personal: solo la ven el propio
// agente y el administrador. A los demás (clientes y visitantes) se les quita.
function sinCedulaAjena(evento, usuario) {
  if (tienePermisoSobreEvento(usuario, evento)) return evento;
  const { id_agente, ...publico } = evento;
  return publico;
}

const eventoController = {
  // GET /api/eventos?id_estado=...&id_ciudad=...&id_agente=...&mis_eventos=1
  async listar(req, res) {
    try {
      const filtros = {};

      if (req.query.id_estado) {
        const idEstado = Number(req.query.id_estado);
        if (Number.isInteger(idEstado) && idEstado > 0)
          filtros.id_estado = idEstado;
      }
      if (req.query.id_ciudad) {
        const idCiudad = Number(req.query.id_ciudad);
        if (Number.isInteger(idCiudad) && idCiudad > 0)
          filtros.id_ciudad = idCiudad;
      }
      // Filtrar por cualquier agente solo lo puede hacer el administrador
      if (req.query.id_agente && req.session.usuario?.rol === "administrador") {
        filtros.id_agente = String(req.query.id_agente).trim();
      }

      // Si un agente pide ?mis_eventos=1, filtramos automáticamente por su numero_id en sesión
      if (
        req.query.mis_eventos === "1" &&
        req.session.usuario?.rol === "agente"
      ) {
        filtros.id_agente = req.session.usuario.numero_id;
      }

      const eventos = await EventoModel.getAll(filtros);
      res.json(eventos.map((e) => sinCedulaAjena(e, req.session.usuario)));
    } catch (error) {
      console.error("Error al listar eventos:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // GET /api/eventos/catalogo?id_pais=&id_departamento=&id_ciudad=&fecha_desde=AAAA-MM-DD&fecha_hasta=AAAA-MM-DD
  // Público: lo usa el cliente para ver los eventos disponibles.
  async catalogo(req, res) {
    const filtros = {};

    // Filtros de ubicación: deben ser enteros positivos
    for (const campo of ["id_pais", "id_departamento", "id_ciudad"]) {
      if (req.query[campo]) {
        const valor = Number(req.query[campo]);
        if (!Number.isInteger(valor) || valor <= 0) {
          return res
            .status(400)
            .json({ error: `El filtro ${campo} no es válido.` });
        }
        filtros[campo] = valor;
      }
    }

    // Filtros de fecha: formato AAAA-MM-DD (el que entrega <input type="date">)
    const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
    for (const campo of ["fecha_desde", "fecha_hasta"]) {
      const valor = texto(req.query[campo]); // ?fecha_desde[]=... ya no tumba la petición
      if (!valor) continue;
      if (!FORMATO_FECHA.test(valor) || Number.isNaN(Date.parse(valor))) {
        return res
          .status(400)
          .json({ error: "El formato de la fecha debe ser AAAA-MM-DD." });
      }
      filtros[campo] = valor;
    }

    if (
      filtros.fecha_desde &&
      filtros.fecha_hasta &&
      filtros.fecha_desde > filtros.fecha_hasta
    ) {
      return res.status(400).json({
        error: 'La fecha "desde" no puede ser posterior a la fecha "hasta".',
      });
    }

    try {
      const eventos = await EventoModel.getCatalogo(filtros);
      res.json(eventos.map((e) => sinCedulaAjena(e, req.session.usuario)));
    } catch (error) {
      console.error("Error al consultar el catálogo de eventos:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // GET /api/eventos/catalogo/ciudades (ciudades con eventos disponibles, para los filtros)
  async ciudadesCatalogo(req, res) {
    try {
      const ciudades = await EventoModel.getCiudadesCatalogo();
      res.json(ciudades);
    } catch (error) {
      console.error("Error al listar las ciudades del catálogo:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // GET /api/eventos/estados
  async listarEstados(req, res) {
    try {
      const estados = await EventoModel.getEstados();
      res.json(estados);
    } catch (error) {
      console.error("Error al listar estados de evento:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // GET /api/eventos/agentes
  async listarAgentes(req, res) {
    try {
      const agentes = await EventoModel.getAgentes();
      res.json(agentes);
    } catch (error) {
      console.error("Error al listar agentes:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // GET /api/eventos/:id
  async obtener(req, res) {
    try {
      const evento = await EventoModel.getById(req.params.id);
      if (!evento)
        return res.status(404).json({ error: "Evento no encontrado." });
      res.json(sinCedulaAjena(evento, req.session.usuario));
    } catch (error) {
      console.error("Error al obtener evento:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // GET /api/eventos/:id/imagen  (Ajustes finales)
  // Devuelve la imagen del evento como archivo (image/png, image/jpeg...).
  // Los listados ya no traen el base64: cada tarjeta pide su imagen aquí.
  async imagen(req, res) {
    try {
      const dataUrl = await EventoModel.getImagen(req.params.id);
      // "data:image/png;base64,iVBOR..." -> tipo = "image/png", datos = "iVBOR..."
      const partes = /^data:(image\/(?:png|jpeg|webp|gif));base64,(.+)$/.exec(dataUrl || "");
      if (!partes) {
        // Sin imagen (o el evento no existe): se usa la imagen por defecto
        return res.redirect("/img/evento-defecto.svg");
      }
      res.set("Cache-Control", "no-cache"); // el navegador la guarda, pero pregunta si cambió
      res.type(partes[1]).send(Buffer.from(partes[2], "base64"));
    } catch (error) {
      console.error("Error al obtener la imagen del evento:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // POST /api/eventos (solo agente o administrador)
  async crear(req, res) {
    const { error, datos } = validarDatosEvento(req.body);
    if (error) return res.status(400).json({ error });

    const usuario = req.session.usuario;
    // Si es agente, el evento queda a su nombre. Si es admin, debe indicar id_agente en el body.
    const idAgente =
      usuario.rol === "agente" ? usuario.numero_id : texto(req.body.id_agente);

    if (!idAgente) {
      return res
        .status(400)
        .json({ error: "Debes seleccionar el agente responsable del evento." });
    }

    try {
      if (!(await CiudadModel.getById(datos.id_ciudad))) {
        return res
          .status(400)
          .json({ error: "La ciudad seleccionada no existe." });
      }

      // Sprint 3 · Tarea 14: el agente no puede pasar el límite de eventos de su plan
      const cupo = await PlanModel.cupoDeAgente(idAgente);
      if (!cupo) {
        return res
          .status(400)
          .json({ error: "El agente seleccionado no existe o está suspendido." });
      }
      if (cupo.eventos_activos >= cupo.limite_evento) {
        const quien =
          usuario.rol === "agente" ? "Ya tienes" : "El agente ya tiene";
        return res.status(409).json({
          error:
            `${quien} ${cupo.eventos_activos} eventos activos, el máximo del ${cupo.nombre_plan}. ` +
            "Para crear otro, espera a que finalice alguno, cancela uno o cambia a un plan superior.",
        });
      }

      const evento = await EventoModel.create(datos, idAgente);

      res.status(201).json(evento);
    } catch (err) {
      if (err.code === "23503") {
        return res.status(400).json({
          error:
            "El agente o la ciudad seleccionada no existe en la base de datos.",
        });
      }
      console.error("Error al crear evento:", err);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // PUT /api/eventos/:id (solo el agente dueño o un administrador)
  async actualizar(req, res) {
    const { id } = req.params;

    try {
      const actual = await EventoModel.getById(id);
      if (!actual)
        return res.status(404).json({ error: "Evento no encontrado." });

      if (!tienePermisoSobreEvento(req.session.usuario, actual)) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para modificar este evento." });
      }

      // Un evento En Vivo, Finalizado o Cancelado ya no se edita
      if (ESTADOS_NO_EDITABLES.includes(actual.nombre_estado)) {
        return res.status(409).json({
          error: `No se puede editar un evento que está ${actual.nombre_estado}.`,
        });
      }

      // Las 24 h de anticipación solo se exigen si el agente CAMBIÓ la fecha/hora de inicio
      const cambioInicio =
        Date.parse(req.body.fecha_inicio) !==
        new Date(actual.fecha_inicio).getTime();
      const { error, datos } = validarDatosEvento(req.body, {
        validarAnticipacion: cambioInicio,
      });
      if (error) return res.status(400).json({ error });

      if (!(await CiudadModel.getById(datos.id_ciudad))) {
        return res
          .status(400)
          .json({ error: "La ciudad seleccionada no existe." });
      }

      // Tarea 16: la capacidad no puede quedar por debajo de las entradas ya reservadas
      const disponibles = await ReservaModel.cuposDisponibles(id);
      const reservadas =
        Number(actual.capacidad) - Number(disponibles ?? actual.capacidad);
      if (datos.capacidad < reservadas) {
        return res.status(409).json({
          error: `El evento ya tiene ${reservadas} entradas reservadas; la capacidad no puede ser menor a ese número.`,
        });
      }

      // El precio queda congelado cuando ya hay entradas reservadas: si cambiara,
      // el valor de esas reservas se recalcularía con el precio nuevo
      if (reservadas > 0 && datos.precio_base !== Number(actual.precio_base)) {
        return res.status(409).json({
          error: `No puedes cambiar el precio: el evento ya tiene ${reservadas} entradas reservadas.`,
        });
      }

      const actualizado = await EventoModel.update(id, datos);

      res.json(actualizado);
    } catch (err) {
      console.error("Error al actualizar evento:", err);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // PATCH /api/eventos/:id/estado (cambiar estado del evento)
  async cambiarEstado(req, res) {
    const { id } = req.params;
    const idEstado = Number(req.body.id_estado);
    const causaCancelacion = texto(req.body.causa_cancelacion) || null;

    if (!Number.isInteger(idEstado) || idEstado <= 0) {
      return res.status(400).json({ error: "Debes indicar un estado válido." });
    }
    if (causaCancelacion && causaCancelacion.length > MAX_CAUSA) {
      return res
        .status(400)
        .json({ error: `La causa no puede superar ${MAX_CAUSA} caracteres.` });
    }

    try {
      const actual = await EventoModel.getById(id);
      if (!actual)
        return res.status(404).json({ error: "Evento no encontrado." });

      if (!tienePermisoSobreEvento(req.session.usuario, actual)) {
        return res.status(403).json({
          error: "No tienes permiso para cambiar el estado de este evento.",
        });
      }

      const estados = await EventoModel.getEstados();
      const estadoDestino = estados.find(
        (e) => Number(e.id_estado) === idEstado,
      );
      if (!estadoDestino) {
        return res
          .status(400)
          .json({ error: "El estado seleccionado no existe." });
      }

      const origen = actual.nombre_estado;
      const destino = estadoDestino.nombre_estado;

      if (destino === origen) {
        return res.status(400).json({ error: `El evento ya está ${origen}.` });
      }
      // "En Vivo" y "Finalizado" los pone el sistema según la fecha y hora
      if (ESTADOS_AUTOMATICOS.includes(destino)) {
        return res.status(400).json({
          error: `El estado ${destino} se asigna automáticamente según la fecha y hora del evento.`,
        });
      }
      if (!(TRANSICIONES_MANUALES[origen] || []).includes(destino)) {
        return res.status(409).json({
          error: `No se puede pasar un evento de ${origen} a ${destino}.`,
        });
      }

      if (destino === "Cancelado") {
        if (!causaCancelacion) {
          return res
            .status(400)
            .json({ error: "Debes indicar la causa de cancelación." });
        }
        // Cancela el evento y TODAS sus reservas activas
        const quien =
          req.session.usuario.rol === "administrador"
            ? "Administrador"
            : "Agente";
        const cancelado = await EventoModel.cancelarConReservas(
          id,
          idEstado,
          causaCancelacion,
          quien,
        );
        return res.json(cancelado);
      }

      const actualizado = await EventoModel.cambiarEstado(id, idEstado, null);
      res.json(actualizado);
    } catch (err) {
      console.error("Error al cambiar estado del evento:", err);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  // DELETE /api/eventos/:id (no permite borrar si tiene reservas)
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      const actual = await EventoModel.getById(id);
      if (!actual)
        return res.status(404).json({ error: "Evento no encontrado." });

      if (!tienePermisoSobreEvento(req.session.usuario, actual)) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para eliminar este evento." });
      }

      if (await EventoModel.tieneReservas(id)) {
        return res.status(409).json({
          error:
            "No se puede eliminar el evento porque ya tiene reservas asociadas.",
        });
      }

      await EventoModel.remove(id);
      res.json({ mensaje: "Evento eliminado correctamente." });
    } catch (err) {
      if (err.code === "23503") {
        return res.status(409).json({
          error:
            "No se puede eliminar el evento porque tiene registros asociados.",
        });
      }
      console.error("Error al eliminar evento:", err);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },
};

module.exports = eventoController;
