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

// Reservas que cuentan como VENTA en un año ($1): las NO canceladas.
// Se usa como CTE ("WITH ventas AS (...)") en los reportes comerciales.
const VENTAS_DEL_ANIO = `
  SELECT r.id_reserva, r.id_cliente, r.numero_entradas, r.valor_total, e.id_agente
  FROM public."RESERVA" r
  JOIN public."EVENTO" e          ON e.id_evento = r.id_evento
  JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
  WHERE er.nombre_estado <> 'Cancelada'
    AND EXTRACT(YEAR FROM r.fecha_hora_reserva) = $1`;

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
  // ─── Eventos por estado (Reporte general) ────────────────────────────────
  // LEFT JOIN desde ESTADO para que salgan los 5 estados, aunque tengan 0.
  async eventosPorEstado() {
    const result = await pool.query(`
      SELECT es.nombre_estado AS estado, COUNT(e.id_evento)::int AS cantidad
      FROM public."ESTADO" es
      LEFT JOIN public."EVENTO" e ON e.id_estado = es.id_estado
      GROUP BY es.id_estado, es.nombre_estado
      ORDER BY es.id_estado
    `);
    return result.rows;
  },
 
  // ─── Reservas por estado (Reporte general) ───────────────────────────────
  // Igual que arriba: salen los 3 estados aunque no tengan reservas.
  async reservasPorEstado() {
    const result = await pool.query(`
      SELECT er.nombre_estado AS estado,
             COUNT(r.id_reserva)::int                    AS cantidad,
             COALESCE(SUM(r.numero_entradas), 0)::int    AS entradas,
             COALESCE(SUM(r.valor_total), 0)             AS valor
      FROM public."ESTADO_RESERVA" er
      LEFT JOIN public."RESERVA" r ON r.id_estado_reserva = er.id_estado_reserva
      GROUP BY er.id_estado_reserva, er.nombre_estado
      ORDER BY er.id_estado_reserva
    `);
    return result.rows.map((f) => ({ ...f, valor: Number(f.valor) }));
  },
 
  // ─── Últimos registros del sistema (tabla del Reporte general) ───────────
  // Une (UNION ALL) clientes, agentes, administradores, eventos y reservas,
  // cada uno con su estado, y se queda con los más recientes.
  async ultimosRegistros(limite = 50) {
    const result = await pool.query(
      `SELECT * FROM (
         SELECT 'cliente' AS tipo,
                u.nombre || ' · ' || u.correo AS descripcion,
                u.fecha_registro AS fecha, 'Registrado' AS estado
         FROM public."CLIENTE" c JOIN public."USUARIO" u ON u.numero_id = c.numero_id
 
         UNION ALL
         SELECT 'agente',
                COALESCE(a.nombre_empresa, u.nombre) || ' · ' || u.correo,
                u.fecha_registro, 'Registrado'
         FROM public."AGENTE" a JOIN public."USUARIO" u ON u.numero_id = a.numero_id
 
         UNION ALL
         SELECT 'admin',
                u.nombre || ' · ' || u.correo,
                u.fecha_registro, 'Registrado'
         FROM public."ADMINISTRADOR" ad JOIN public."USUARIO" u ON u.numero_id = ad.numero_id
 
         UNION ALL
         SELECT 'evento',
                e.codigo_evento || ' · ' || e.nombre_evento || ' (' || c.nombre_ciudad || ')',
                ${REGISTRO_EVENTO}, es.nombre_estado
         FROM public."EVENTO" e
         JOIN public."ESTADO" es ON es.id_estado = e.id_estado
         JOIN public."CIUDAD" c  ON c.id_ciudad = e.id_ciudad
 
         UNION ALL
         SELECT 'reserva',
                r.codigo_reserva || ' · ' || u.nombre || ' → ' || e.nombre_evento || ' (' ||
                  r.numero_entradas || CASE WHEN r.numero_entradas = 1 THEN ' entrada)' ELSE ' entradas)' END,
                r.fecha_hora_reserva, er.nombre_estado
         FROM public."RESERVA" r
         JOIN public."ESTADO_RESERVA" er ON er.id_estado_reserva = r.id_estado_reserva
         JOIN public."EVENTO" e  ON e.id_evento = r.id_evento
         JOIN public."USUARIO" u ON u.numero_id = r.id_cliente
       ) AS registros
       ORDER BY fecha DESC NULLS LAST
       LIMIT $1`,
      [limite],
    );
    return result.rows;
  },

    // ═════════════════════════════════════════════════════════════════════════
  // REPORTES COMERCIALES (Sprint 3 · Tarea 8)
  // ═════════════════════════════════════════════════════════════════════════

  // ─── 8.1 Ingresos por agente en el año elegido ───────────────────────────
  // Salen TODOS los agentes (aunque no hayan vendido nada) para que el
  // promedio general se calcule sobre todos los agentes registrados.
  //   eventos  = eventos que ha creado el agente (histórico)
  //   reservas = reservas NO canceladas de sus eventos en el año
  //   ingresos = suma de valor_total de esas reservas
  //   ciudad   = la ciudad donde más eventos ha hecho (o la de su registro)
  async ingresosPorAgente(anio) {
    const result = await pool.query(
      `WITH ventas AS (${VENTAS_DEL_ANIO})
       SELECT a.numero_id                AS id,
              a.nombre_empresa           AS agente,
              u.nombre                   AS responsable,
              COALESCE(
                (SELECT c.nombre_ciudad
                   FROM public."EVENTO" e
                   JOIN public."CIUDAD" c ON c.id_ciudad = e.id_ciudad
                  WHERE e.id_agente = a.numero_id
                  GROUP BY c.nombre_ciudad
                  ORDER BY COUNT(*) DESC, c.nombre_ciudad
                  LIMIT 1),
                cu.nombre_ciudad, 'Sin ciudad')                                       AS ciudad,
              (SELECT COUNT(*) FROM public."EVENTO" e WHERE e.id_agente = a.numero_id)::int AS eventos,
              (SELECT COUNT(*) FROM ventas v WHERE v.id_agente = a.numero_id)::int          AS reservas,
              (SELECT COALESCE(SUM(v.valor_total), 0) FROM ventas v WHERE v.id_agente = a.numero_id) AS ingresos
       FROM public."AGENTE" a
       JOIN public."USUARIO" u     ON u.numero_id = a.numero_id
       LEFT JOIN public."CIUDAD" cu ON cu.id_ciudad = u.id_ciudad
       ORDER BY ingresos DESC, agente ASC`,
      [anio],
    );
    return result.rows.map((f) => ({ ...f, ingresos: Number(f.ingresos) }));
  },

  // ─── 8.1 Ingresos por cliente en el año elegido ──────────────────────────
  // Igual que el de agentes: salen TODOS los clientes, aunque no hayan
  // comprado, para que el promedio general sea sobre todos los clientes.
  async ingresosPorCliente(anio) {
    const result = await pool.query(
      `WITH ventas AS (${VENTAS_DEL_ANIO})
       SELECT c.numero_id AS id,
              u.nombre    AS cliente,
              u.correo,
              (SELECT COUNT(*) FROM ventas v WHERE v.id_cliente = c.numero_id)::int                         AS reservas,
              (SELECT COALESCE(SUM(v.numero_entradas), 0) FROM ventas v WHERE v.id_cliente = c.numero_id)::int AS entradas,
              (SELECT COALESCE(SUM(v.valor_total), 0) FROM ventas v WHERE v.id_cliente = c.numero_id)         AS ingresos
       FROM public."CLIENTE" c
       JOIN public."USUARIO" u ON u.numero_id = c.numero_id
       ORDER BY ingresos DESC, cliente ASC`,
      [anio],
    );
    return result.rows.map((f) => ({ ...f, ingresos: Number(f.ingresos) }));
  },

  // ─── 8.3 Número de reservas por evento y por mes del año ─────────────────
  // Cuenta TODAS las reservas registradas (también las canceladas), igual
  // que el reporte general. Devuelve una fila por evento con sus 12 meses.
  async reservasPorEventoMes(anio) {
    const result = await pool.query(
      `SELECT e.codigo_evento AS codigo,
              e.nombre_evento AS evento,
              EXTRACT(MONTH FROM r.fecha_hora_reserva)::int AS mes,
              COUNT(*)::int AS reservas
       FROM public."RESERVA" r
       JOIN public."EVENTO" e ON e.id_evento = r.id_evento
       WHERE EXTRACT(YEAR FROM r.fecha_hora_reserva) = $1
       GROUP BY e.codigo_evento, e.nombre_evento, mes`,
      [anio],
    );

    // Agrupa las filas { codigo, mes, reservas } en { codigo, evento, datos[12], total }
    const eventos = new Map();
    result.rows.forEach((f) => {
      if (!eventos.has(f.codigo)) {
        eventos.set(f.codigo, { codigo: f.codigo, evento: f.evento, datos: Array(12).fill(0), total: 0 });
      }
      const fila = eventos.get(f.codigo);
      fila.datos[f.mes - 1] = f.reservas;
      fila.total += f.reservas;
    });
    // El evento con más reservas primero
    return [...eventos.values()].sort((a, b) => b.total - a.total || a.evento.localeCompare(b.evento));
  },

  // ─── 8.4 Eventos creados por cada agente y por ciudad (histórico) ────────
  // Una fila por cada pareja agente + ciudad, con el desglose por estado:
  //   activos = Programado, En Boletería o En Vivo
  async eventosPorAgenteCiudad() {
    const result = await pool.query(`
      SELECT a.numero_id           AS id_agente,
             a.nombre_empresa      AS agente,
             c.nombre_ciudad       AS ciudad,
             d.nombre_departamento AS departamento,
             p.nombre_pais         AS pais,
             COUNT(*)::int AS creados,
             COUNT(*) FILTER (WHERE es.nombre_estado IN ('Programado', 'En Boletería', 'En Vivo'))::int AS activos,
             COUNT(*) FILTER (WHERE es.nombre_estado = 'Finalizado')::int AS finalizados,
             COUNT(*) FILTER (WHERE es.nombre_estado = 'Cancelado')::int  AS cancelados
      FROM public."EVENTO" e
      JOIN public."AGENTE" a       ON a.numero_id = e.id_agente
      JOIN public."ESTADO" es      ON es.id_estado = e.id_estado
      JOIN public."CIUDAD" c       ON c.id_ciudad = e.id_ciudad
      JOIN public."DEPARTAMENTO" d ON d.id_departamento = c.id_departamento
      JOIN public."PAIS" p         ON p.id_pais = d.id_pais
      GROUP BY a.numero_id, a.nombre_empresa, c.id_ciudad, c.nombre_ciudad,
               d.nombre_departamento, p.nombre_pais
      ORDER BY agente ASC, creados DESC, ciudad ASC
    `);
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