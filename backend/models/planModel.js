// models/planModel.js
// Model de TIPO_PLAN: consultas SQL relacionadas con los planes de los agentes.
// Sprint 3 · Tarea 14: los planes salen de la BD (registro, perfil del agente)
// y aquí se cuenta cuántos eventos activos tiene un agente frente a su plan.

const pool = require("../config/db");

// Estados que cuentan como "evento activo" para el límite del plan.
// Finalizado y Cancelado NO cuentan: ya no ocupan cupo.
const ESTADOS_ACTIVOS = ["Programado", "En Boletería", "En Vivo"];

const PlanModel = {
  ESTADOS_ACTIVOS,

  // Lista todos los planes (registro, perfil del agente y modal de agentes del admin)
  async listar() {
    const result = await pool.query(
      `SELECT id_plan, nombre_plan, descripcion_plan, precio_plan, limite_evento
       FROM public."TIPO_PLAN" ORDER BY precio_plan ASC`,
    );
    return result.rows;
  },

  // Busca un plan por su nombre (ej. 'Plan Básico')
  async findByNombre(nombre_plan) {
    const result = await pool.query(
      `SELECT id_plan, nombre_plan, precio_plan, limite_evento
       FROM public."TIPO_PLAN" WHERE nombre_plan = $1`,
      [nombre_plan],
    );
    return result.rows[0] || null;
  },

  // Busca un plan por su id (registro de agente, edición de agente y cambio de plan)
  async getById(id_plan) {
    const result = await pool.query(
      `SELECT id_plan, nombre_plan, precio_plan, limite_evento
       FROM public."TIPO_PLAN" WHERE id_plan = $1`,
      [id_plan],
    );
    return result.rows[0] || null;
  },

  // Plan actual del agente + cuántos eventos activos tiene.
  // Devuelve { id_plan, nombre_plan, limite_evento, eventos_activos } o null
  // si ese numero_id no es un agente.
  async cupoDeAgente(numero_id) {
    const result = await pool.query(
      `SELECT tp.id_plan, tp.nombre_plan, tp.limite_evento,
              (SELECT COUNT(*)::int
               FROM public."EVENTO" e
               JOIN public."ESTADO" es ON es.id_estado = e.id_estado
               WHERE e.id_agente = ag.numero_id
                 AND es.nombre_estado = ANY($2)) AS eventos_activos
       FROM public."AGENTE" ag
       JOIN public."TIPO_PLAN" tp ON tp.id_plan = ag.id_plan
       JOIN public."USUARIO" u    ON u.numero_id = ag.numero_id
       WHERE ag.numero_id = $1 AND u.activo`,
      [numero_id, ESTADOS_ACTIVOS],
    );
    return result.rows[0] || null;
  },
};

module.exports = PlanModel;
