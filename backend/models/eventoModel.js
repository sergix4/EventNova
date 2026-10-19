// models/eventoModel.js
// MODELO de eventos: consultas SQL sobre la tabla EVENTO.
// Cada evento pertenece a una ciudad (id_ciudad -> CIUDAD), tiene un estado
// (id_estado -> ESTADO) y lo registra un agente (id_agente -> AGENTE).
// El código del evento (EVT-00001) lo genera PostgreSQL solo.
const pool = require("../config/db");

// Consulta base: el evento con su ciudad, departamento, país, estado y agente
const SELECT_BASE = `
  SELECT e.id_evento, e.codigo_evento, e.nombre_evento, e.descripcion_evento,
         e.teatro, e.direccion_evento, e.fecha_inicio, e.fecha_fin,
         e.capacidad, e.precio_base, e.observaciones, e.imagen_evento,
         e.causa_cancelacion, e.fecha_registro,
         e.id_ciudad, c.nombre_ciudad,
         d.id_departamento, d.nombre_departamento,
         p.id_pais, p.nombre_pais,
         e.id_estado, es.nombre_estado,
         e.id_agente, u.nombre AS nombre_agente, a.nombre_empresa
  FROM public."EVENTO" e
  JOIN public."CIUDAD" c        ON c.id_ciudad = e.id_ciudad
  JOIN public."DEPARTAMENTO" d  ON d.id_departamento = c.id_departamento
  JOIN public."PAIS" p          ON p.id_pais = d.id_pais
  JOIN public."ESTADO" es       ON es.id_estado = e.id_estado
  JOIN public."AGENTE" a        ON a.numero_id = e.id_agente
  JOIN public."USUARIO" u       ON u.numero_id = a.numero_id`;

const EventoModel = {
  // Lista de eventos. Filtros opcionales: { id_estado, id_ciudad, id_agente }
  async getAll(filtros = {}) {
    const condiciones = [];
    const params = [];

    if (filtros.id_estado) {
      params.push(filtros.id_estado);
      condiciones.push(`e.id_estado = $${params.length}`);
    }
    if (filtros.id_ciudad) {
      params.push(filtros.id_ciudad);
      condiciones.push(`e.id_ciudad = $${params.length}`);
    }
    if (filtros.id_agente) {
      params.push(filtros.id_agente);
      condiciones.push(`e.id_agente = $${params.length}`);
    }

    const where = condiciones.length
      ? `WHERE ${condiciones.join(" AND ")}`
      : "";
    const result = await pool.query(
      `${SELECT_BASE} ${where} ORDER BY e.fecha_inicio ASC`,
      params,
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(`${SELECT_BASE} WHERE e.id_evento = $1`, [
      id,
    ]);
    return result.rows[0];
  },

  // Los 5 estados posibles (para llenar selects y filtros)
  async getEstados() {
    const result = await pool.query(
      'SELECT id_estado, nombre_estado FROM public."ESTADO" ORDER BY id_estado ASC',
    );
    return result.rows;
  },

  // Crea el evento. Siempre nace en estado "Programado".
  async create(datos, id_agente) {
    const result = await pool.query(
      `INSERT INTO public."EVENTO"
         (nombre_evento, descripcion_evento, teatro, direccion_evento, id_ciudad,
          fecha_inicio, fecha_fin, capacidad, precio_base, observaciones,
          imagen_evento, id_agente, id_estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
         (SELECT id_estado FROM public."ESTADO" WHERE nombre_estado = 'Programado'))
       RETURNING id_evento`,
      [
        datos.nombre_evento,
        datos.descripcion_evento || null,
        datos.teatro,
        datos.direccion_evento || null,
        datos.id_ciudad,
        datos.fecha_inicio,
        datos.fecha_fin,
        datos.capacidad,
        datos.precio_base,
        datos.observaciones || null,
        datos.imagen_evento || null,
        id_agente,
      ],
    );
    return this.getById(result.rows[0].id_evento);
  },

  // Modifica los datos del evento (el estado se cambia con cambiarEstado)
  async update(id, datos) {
    const result = await pool.query(
      `UPDATE public."EVENTO"
       SET nombre_evento = $1, descripcion_evento = $2, teatro = $3,
           direccion_evento = $4, id_ciudad = $5, fecha_inicio = $6,
           fecha_fin = $7, capacidad = $8, precio_base = $9,
           observaciones = $10, imagen_evento = $11
       WHERE id_evento = $12
       RETURNING id_evento`,
      [
        datos.nombre_evento,
        datos.descripcion_evento || null,
        datos.teatro,
        datos.direccion_evento || null,
        datos.id_ciudad,
        datos.fecha_inicio,
        datos.fecha_fin,
        datos.capacidad,
        datos.precio_base,
        datos.observaciones || null,
        datos.imagen_evento || null,
        id,
      ],
    );
    if (result.rowCount === 0) return undefined;
    return this.getById(id);
  },

  // Cambia el estado (Programado -> En Boletería -> En Vivo -> Finalizado / Cancelado)
  async cambiarEstado(id, id_estado, causa_cancelacion = null) {
    const result = await pool.query(
      `UPDATE public."EVENTO" SET id_estado = $1, causa_cancelacion = $2
       WHERE id_evento = $3 RETURNING id_evento`,
      [id_estado, causa_cancelacion, id],
    );
    if (result.rowCount === 0) return undefined;
    return this.getById(id);
  },

  // ¿El evento tiene reservas? (no se debe eliminar si las tiene)
  async tieneReservas(id) {
    const result = await pool.query(
      'SELECT 1 FROM public."RESERVA" WHERE id_evento = $1 LIMIT 1',
      [id],
    );
    return result.rowCount > 0;
  },

  async remove(id) {
    const result = await pool.query(
      'DELETE FROM public."EVENTO" WHERE id_evento = $1',
      [id],
    );
    return result.rowCount > 0;
  },
};

module.exports = EventoModel;
