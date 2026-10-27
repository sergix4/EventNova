// models/reporteModel.js
// MODELO de reportes: consultas SQL de SOLO LECTURA para el panel del
// administrador (Sprint 3). No modifica ninguna tabla: solo cuenta y suma.
//
// Reglas que usan todas las consultas:
//   - Ingresos = valor_total de las reservas que NO están canceladas.
//   - "Pagadas" = reservas Confirmadas, "Pendientes" = reservas Reservadas.
//   - Los meses se agrupan del 1 al 12 y siempre se devuelven los 12
//     (en 0 si ese mes no tuvo movimiento), listos para graficar.
const pool = require("../config/db");

// Hora actual de Colombia (igual que el resto del proyecto)
const AHORA = `(NOW() AT TIME ZONE 'America/Bogota')`;

// EVENTO.fecha_registro se guarda con NOW() en la zona horaria de la BD
// (en Neon es UTC). Esta expresión la pasa a hora de Colombia.
const REGISTRO_EVENTO = `((e.fecha_registro AT TIME ZONE current_setting('TimeZone')) AT TIME ZONE 'America/Bogota')`;

// Convierte filas { mes, valor } en un arreglo de 12 posiciones (Ene..Dic)
function porMes(filas, campo = "valor") {
  const meses = Array(12).fill(0);
  filas.forEach((f) => {
    meses[f.mes - 1] = Number(f[campo]);
  });
  return meses;
}

const ReporteModel = {
  // ─── Totales generales (KPIs de arriba) ──────────────────────────────────
  // Cuántos hay de cada cosa y cuántos son nuevos en el mes actual.
  async totales() {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM public."CLIENTE")::int        AS clientes,
        (SELECT COUNT(*) FROM public."AGENTE")::int         AS agentes,
        (SELECT COUNT(*) FROM public."ADMINISTRADOR")::int  AS administradores,
        (SELECT COUNT(*) FROM public."RESERVA")::int        AS reservas,
        (SELECT COUNT(*) FROM public."EVENTO")::int         AS eventos,

        (SELECT COUNT(*) FROM public."CLIENTE" c
           JOIN public."USUARIO" u ON u.numero_id = c.numero_id
          WHERE date_trunc('month', u.fecha_registro) = date_trunc('month', ${AHORA}))::int AS clientes_mes,
        (SELECT COUNT(*) FROM public."AGENTE" a
           JOIN public."USUARIO" u ON u.numero_id = a.numero_id
          WHERE date_trunc('month', u.fecha_registro) = date_trunc('month', ${AHORA}))::int AS agentes_mes,
        (SELECT COUNT(*) FROM public."ADMINISTRADOR" ad
           JOIN public."USUARIO" u ON u.numero_id = ad.numero_id
          WHERE date_trunc('month', u.fecha_registro) = date_trunc('month', ${AHORA}))::int AS administradores_mes,
        (SELECT COUNT(*) FROM public."RESERVA" r
          WHERE date_trunc('month', r.fecha_hora_reserva) = date_trunc('month', ${AHORA}))::int AS reservas_mes,
        (SELECT COUNT(*) FROM public."EVENTO" e
          WHERE date_trunc('month', ${REGISTRO_EVENTO}) = date_trunc('month', ${AHORA}))::int AS eventos_mes
    `);
    return result.rows[0];
  },

  // ─── Ingresos por mes del año (reservas no canceladas) ───────────────────
  async ingresosPorMes(anio) {
    const result = await pool.query(
      `SELECT EXTRACT(MONTH FROM r.fecha_hora_reserva)::int AS mes,
              SUM(r.valor_total) AS valor
       FROM public."RESERVA" r
       JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
       WHERE er.nombre_estado <> 'Cancelada'
         AND EXTRACT(YEAR FROM r.fecha_hora_reserva) = $1
       GROUP BY mes`,
      [anio],
    );
    return porMes(result.rows);
  },

  // ─── Ingresos CONFIRMADOS (pagados) por mes del año ──────────────────────
  async ingresosConfirmadosPorMes(anio) {
    const result = await pool.query(
      `SELECT EXTRACT(MONTH FROM r.fecha_hora_reserva)::int AS mes,
              SUM(r.valor_total) AS valor
       FROM public."RESERVA" r
       JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
       WHERE er.nombre_estado = 'Confirmada'
         AND EXTRACT(YEAR FROM r.fecha_hora_reserva) = $1
       GROUP BY mes`,
      [anio],
    );
    return porMes(result.rows);
  },

  // ─── Reservas por mes y por estado ───────────────────────────────────────
  async reservasPorMes(anio) {
    const result = await pool.query(
      `SELECT EXTRACT(MONTH FROM r.fecha_hora_reserva)::int AS mes,
              COUNT(*) FILTER (WHERE er.nombre_estado = 'Confirmada')::int AS confirmadas,
              COUNT(*) FILTER (WHERE er.nombre_estado = 'Reservada')::int  AS pendientes,
              COUNT(*) FILTER (WHERE er.nombre_estado = 'Cancelada')::int  AS canceladas
       FROM public."RESERVA" r
       JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
       WHERE EXTRACT(YEAR FROM r.fecha_hora_reserva) = $1
       GROUP BY mes`,
      [anio],
    );
    return {
      confirmadas: porMes(result.rows, "confirmadas"),
      pendientes: porMes(result.rows, "pendientes"),
      canceladas: porMes(result.rows, "canceladas"),
    };
  },

  // ─── Eventos creados (registrados) por mes ───────────────────────────────
  async eventosPorMes(anio) {
    const result = await pool.query(
      `SELECT EXTRACT(MONTH FROM ${REGISTRO_EVENTO})::int AS mes,
              COUNT(*)::int AS valor
       FROM public."EVENTO" e
       WHERE EXTRACT(YEAR FROM ${REGISTRO_EVENTO}) = $1
       GROUP BY mes`,
      [anio],
    );
    return porMes(result.rows);
  },

  // ─── Resumen de reservas del año (sección "Pagos de reservas") ───────────
  async resumenReservas(anio) {
    const result = await pool.query(
      `SELECT
         COALESCE(SUM(r.valor_total) FILTER (WHERE er.nombre_estado = 'Confirmada'), 0) AS valor_confirmado,
         COALESCE(SUM(r.valor_total) FILTER (WHERE er.nombre_estado = 'Reservada'), 0)  AS valor_pendiente,
         COUNT(*) FILTER (WHERE er.nombre_estado = 'Confirmada')::int AS confirmadas,
         COUNT(*) FILTER (WHERE er.nombre_estado = 'Reservada')::int  AS pendientes,
         COUNT(*) FILTER (WHERE er.nombre_estado = 'Cancelada')::int  AS canceladas,
         COALESCE(SUM(r.numero_entradas) FILTER (WHERE er.nombre_estado <> 'Cancelada'), 0)::int AS entradas
       FROM public."RESERVA" r
       JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
       WHERE EXTRACT(YEAR FROM r.fecha_hora_reserva) = $1`,
      [anio],
    );
    const fila = result.rows[0];
    return {
      ...fila,
      valor_confirmado: Number(fila.valor_confirmado),
      valor_pendiente: Number(fila.valor_pendiente),
    };
  },

  // ─── Cobertura: eventos por país, departamento y ciudad ──────────────────
  async cobertura() {
    const result = await pool.query(`
      SELECT p.nombre_pais AS pais, d.nombre_departamento AS departamento,
             c.nombre_ciudad AS ciudad, COUNT(e.id_evento)::int AS eventos
      FROM public."EVENTO" e
      JOIN public."CIUDAD" c       ON c.id_ciudad = e.id_ciudad
      JOIN public."DEPARTAMENTO" d ON d.id_departamento = c.id_departamento
      JOIN public."PAIS" p         ON p.id_pais = d.id_pais
      GROUP BY p.nombre_pais, d.nombre_departamento, c.nombre_ciudad
      ORDER BY eventos DESC, ciudad ASC
    `);
    return result.rows;
  },

  // ─── Actividad reciente: las últimas acciones del sistema ────────────────
  // Une (UNION ALL) registros de usuarios, eventos y reservas, y se queda
  // con las más recientes.
  async actividadReciente(limite = 8) {
    const result = await pool.query(
      `SELECT * FROM (
         SELECT 'cliente' AS tipo, 'Nuevo cliente registrado' AS titulo,
                u.nombre AS detalle, u.fecha_registro AS fecha
         FROM public."CLIENTE" c JOIN public."USUARIO" u ON u.numero_id = c.numero_id
         WHERE u.fecha_registro IS NOT NULL

         UNION ALL
         SELECT 'agente', 'Nuevo agente registrado',
                COALESCE(a.nombre_empresa, u.nombre), u.fecha_registro
         FROM public."AGENTE" a JOIN public."USUARIO" u ON u.numero_id = a.numero_id
         WHERE u.fecha_registro IS NOT NULL

         UNION ALL
         SELECT 'evento', 'Nuevo evento creado',
                e.nombre_evento, ${REGISTRO_EVENTO}
         FROM public."EVENTO" e

         UNION ALL
         SELECT 'cancelada', 'Evento cancelado',
                e.nombre_evento || COALESCE(' · Causa: ' || e.causa_cancelacion, ''),
                e.fecha_cancelacion
         FROM public."EVENTO" e
         WHERE e.fecha_cancelacion IS NOT NULL

         UNION ALL
         SELECT 'reserva', 'Nueva reserva registrada',
                e.nombre_evento || ' · ' || r.numero_entradas ||
                  CASE WHEN r.numero_entradas = 1 THEN ' entrada' ELSE ' entradas' END,
                r.fecha_hora_reserva
         FROM public."RESERVA" r JOIN public."EVENTO" e ON e.id_evento = r.id_evento

         UNION ALL
         SELECT 'cancelada', 'Reserva cancelada',
                e.nombre_evento || COALESCE(' · Causa: ' || r.causa_cancelacion, ''),
                r.fecha_cancelacion
         FROM public."RESERVA" r JOIN public."EVENTO" e ON e.id_evento = r.id_evento
         WHERE r.fecha_cancelacion IS NOT NULL
       ) AS actividad
       ORDER BY fecha DESC
       LIMIT $1`,
      [limite],
    );
    return result.rows;
  },

  // ─── Años con movimiento (para llenar el selector de período) ────────────
  async aniosDisponibles() {
    const result = await pool.query(`
      SELECT DISTINCT anio FROM (
        SELECT EXTRACT(YEAR FROM fecha_hora_reserva)::int AS anio FROM public."RESERVA"
        UNION
        SELECT EXTRACT(YEAR FROM ${REGISTRO_EVENTO})::int FROM public."EVENTO" e
        UNION
        SELECT EXTRACT(YEAR FROM ${AHORA})::int
      ) AS anios
      ORDER BY anio DESC
    `);
    return result.rows.map((f) => f.anio);
  },
};

module.exports = ReporteModel;