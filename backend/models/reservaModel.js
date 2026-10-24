// models/reservaModel.js
// MODELO de reservas: consultas SQL sobre la tabla RESERVA.
// Cada reserva la hace un cliente (id_cliente -> CLIENTE), es de un evento
// (id_evento -> EVENTO) y siempre tiene un estado
// (id_estado_reserva -> ESTADO_RESERVA: Reservada, Confirmada, Cancelada).
// El código de la reserva (RES-00001) lo genera PostgreSQL solo.
const pool = require("../config/db");

// Consulta base: la reserva con su estado, su evento (y ciudad) y su cliente
const SELECT_BASE = `
  SELECT r.id_reserva, r.codigo_reserva, r.fecha_hora_reserva,
         r.numero_entradas, r.valor_total, r.observaciones,
         r.causa_cancelacion,
         r.id_estado_reserva, er.nombre_estado AS estado_reserva,
         r.id_evento, e.codigo_evento, e.nombre_evento, e.teatro,
         e.fecha_inicio, e.fecha_fin, e.precio_base, e.imagen_evento,
         ee.nombre_estado AS estado_evento, e.id_agente,
         c.nombre_ciudad,
         r.id_cliente, u.nombre AS nombre_cliente, u.correo AS correo_cliente
  FROM public."RESERVA" r
  JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
  JOIN public."EVENTO" e          ON e.id_evento = r.id_evento
  JOIN public."ESTADO" ee         ON ee.id_estado = e.id_estado
  JOIN public."CIUDAD" c          ON c.id_ciudad = e.id_ciudad
  JOIN public."USUARIO" u         ON u.numero_id = r.id_cliente`;

// Estados del evento en los que ya NO se puede reservar
const EVENTO_NO_RESERVABLE = ["Finalizado", "Cancelado"];

// Error con un código para que el controlador (tarea 6) sepa qué responder
function errorReserva(codigo, mensaje, extra = {}) {
  const error = new Error(mensaje);
  error.codigo = codigo; // EVENTO_NO_EXISTE | EVENTO_NO_DISPONIBLE | SIN_CUPOS
  Object.assign(error, extra);
  return error;
}

// Bloquea la fila del evento (FOR UPDATE) mientras dura la transacción.
// Así, si dos clientes reservan al mismo tiempo, el segundo espera a que
// termine el primero y los cupos nunca se sobrepasan.
async function bloquearEvento(client, id_evento) {
  const result = await client.query(
    `SELECT e.id_evento, e.capacidad, e.precio_base, es.nombre_estado
     FROM public."EVENTO" e
     JOIN public."ESTADO" es ON es.id_estado = e.id_estado
     WHERE e.id_evento = $1
     FOR UPDATE OF e`,
    [id_evento],
  );
  return result.rows[0];
}

// Entradas ya ocupadas en un evento (las reservas canceladas no cuentan).
// excluirReserva sirve al editar: no se cuenta la propia reserva.
async function entradasOcupadas(client, id_evento, excluirReserva = null) {
  const result = await client.query(
    `SELECT COALESCE(SUM(r.numero_entradas), 0)::int AS ocupadas
     FROM public."RESERVA" r
     JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
     WHERE r.id_evento = $1
       AND er.nombre_estado <> 'Cancelada'
       AND ($2::int IS NULL OR r.id_reserva <> $2::int)`,
    [id_evento, excluirReserva],
  );
  return result.rows[0].ocupadas;
}

// Revisa que el evento exista, se pueda reservar y tenga cupos
async function validarCupos(client, id_evento, numero_entradas, excluirReserva = null) {
  const evento = await bloquearEvento(client, id_evento);
  if (!evento) {
    throw errorReserva("EVENTO_NO_EXISTE", "El evento no existe.");
  }
  if (EVENTO_NO_RESERVABLE.includes(evento.nombre_estado)) {
    throw errorReserva(
      "EVENTO_NO_DISPONIBLE",
      `No se puede reservar: el evento está ${evento.nombre_estado}.`,
    );
  }
  const ocupadas = await entradasOcupadas(client, id_evento, excluirReserva);
  const disponibles = evento.capacidad - ocupadas;
  if (numero_entradas > disponibles) {
    throw errorReserva(
      "SIN_CUPOS",
      `Solo quedan ${disponibles} entradas disponibles para este evento.`,
      { disponibles },
    );
  }
  return evento;
}

const ReservaModel = {
  // Lista de reservas. Filtros opcionales:
  // { id_cliente, id_evento, id_agente, id_estado_reserva }
  //   id_cliente -> "Mis reservas" del cliente (tarea 7)
  //   id_agente  -> reservas sobre los eventos de un agente (tarea 8)
  async getAll(filtros = {}) {
    const condiciones = [];
    const params = [];

    if (filtros.id_cliente) {
      params.push(filtros.id_cliente);
      condiciones.push(`r.id_cliente = $${params.length}`);
    }
    if (filtros.id_evento) {
      params.push(filtros.id_evento);
      condiciones.push(`r.id_evento = $${params.length}`);
    }
    if (filtros.id_agente) {
      params.push(filtros.id_agente);
      condiciones.push(`e.id_agente = $${params.length}`);
    }
    if (filtros.id_estado_reserva) {
      params.push(filtros.id_estado_reserva);
      condiciones.push(`r.id_estado_reserva = $${params.length}`);
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join(" AND ")}`
      : "";
    const result = await pool.query(
      `${SELECT_BASE} ${where} ORDER BY r.fecha_hora_reserva DESC`,
      params,
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`${SELECT_BASE} WHERE r.id_reserva = $1`, [
      id,
    ]);
    return result.rows[0];
  },

  // Los 3 estados posibles (para llenar selects y filtros)
  async getEstados() {
    const result = await pool.query(
      'SELECT id_estado_reserva, nombre_estado FROM public."ESTADO_RESERVA" ORDER BY id_estado_reserva ASC',
    );
    return result.rows;
  },

  // Crea la reserva. Siempre nace en estado "Reservada".
  // datos = { id_evento, numero_entradas, observaciones }
  // El valor total lo calcula PostgreSQL: numero_entradas x precio_base.
  async create(datos, id_cliente) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await validarCupos(client, datos.id_evento, datos.numero_entradas);

      const result = await client.query(
        `INSERT INTO public."RESERVA"
           (numero_entradas, valor_total, observaciones,
            id_estado_reserva, id_cliente, id_evento)
         SELECT $1::int, $1::int * e.precio_base, $2,
                (SELECT id_estado_reserva FROM public."ESTADO_RESERVA"
                 WHERE nombre_estado = 'Reservada'),
                $3, e.id_evento
         FROM public."EVENTO" e
         WHERE e.id_evento = $4
         RETURNING id_reserva`,
        [
          datos.numero_entradas,
          datos.observaciones || null,
          id_cliente,
          datos.id_evento,
        ],
      );

      await client.query("COMMIT");
      return this.getById(result.rows[0].id_reserva);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Modifica el número de entradas y las observaciones.
  // Vuelve a validar cupos y a calcular el valor total.
  // (El estado se cambia con cambiarEstado)
  async update(id, datos) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const actual = await client.query(
        'SELECT id_evento FROM public."RESERVA" WHERE id_reserva = $1',
        [id],
      );
      if (actual.rowCount === 0) {
        await client.query("ROLLBACK");
        return undefined;
      }
      const id_evento = actual.rows[0].id_evento;
      await validarCupos(client, id_evento, datos.numero_entradas, id);

      await client.query(
        `UPDATE public."RESERVA" r
         SET numero_entradas = $1::int,
             valor_total = $1::int * e.precio_base,
             observaciones = $2
         FROM public."EVENTO" e
         WHERE e.id_evento = r.id_evento AND r.id_reserva = $3`,
        [datos.numero_entradas, datos.observaciones || null, id],
      );

      await client.query("COMMIT");
      return this.getById(id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  // Cambia el estado (Reservada -> Confirmada / Cancelada).
  // La causa solo se guarda cuando el nuevo estado es "Cancelada".
  async cambiarEstado(id, id_estado_reserva, causa_cancelacion = null) {
    const result = await pool.query(
      `UPDATE public."RESERVA" r
       SET id_estado_reserva = er.id_estado_reserva,
           causa_cancelacion = CASE WHEN er.nombre_estado = 'Cancelada'
                                    THEN $2 ELSE NULL END
       FROM public."ESTADO_RESERVA" er
       WHERE er.id_estado_reserva = $1 AND r.id_reserva = $3
       RETURNING r.id_reserva`,
      [id_estado_reserva, causa_cancelacion, id],
    );
    if (result.rowCount === 0) return undefined;
    return this.getById(id);
  },

  // Cupos que le quedan a un evento (lo usará la vista de detalle al reservar)
  async cuposDisponibles(id_evento) {
    const result = await pool.query(
      `SELECT e.capacidad - COALESCE(SUM(r.numero_entradas)
                FILTER (WHERE er.nombre_estado <> 'Cancelada'), 0)::int AS disponibles
       FROM public."EVENTO" e
       LEFT JOIN public."RESERVA" r         ON r.id_evento = e.id_evento
       LEFT JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
       WHERE e.id_evento = $1
       GROUP BY e.id_evento, e.capacidad`,
      [id_evento],
    );
    return result.rows[0] ? result.rows[0].disponibles : undefined;
  },

  async remove(id) {
    const result = await pool.query(
      'DELETE FROM public."RESERVA" WHERE id_reserva = $1',
      [id],
    );
    return result.rowCount > 0;
  },
};

module.exports = ReservaModel;