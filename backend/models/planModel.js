// models/planModel.js
// Model de TIPO_PLAN: consultas SQL relacionadas con los planes de los agentes.
// (El CRUD completo de planes queda pendiente para más adelante.)

const pool = require('../config/db');

const PlanModel = {
  // Lista todos los planes (lo usa el selector de plan del modal de agentes)
  async listar() {
    const result = await pool.query(
      `SELECT id_plan, nombre_plan, precio_plan, limite_evento
       FROM public."TIPO_PLAN" ORDER BY precio_plan ASC`
    );
    return result.rows;
  },

  // Busca un plan por su nombre (ej. 'Plan Básico')
  async findByNombre(nombre_plan) {
    const result = await pool.query(
      `SELECT id_plan, nombre_plan, precio_plan, limite_evento
       FROM public."TIPO_PLAN" WHERE nombre_plan = $1`,
      [nombre_plan]
    );
    return result.rows[0] || null;
  },

  // Busca un plan por su id (lo usa personaController al editar un agente)
  async getById(id_plan) {
    const result = await pool.query(
      `SELECT id_plan, nombre_plan, precio_plan, limite_evento
       FROM public."TIPO_PLAN" WHERE id_plan = $1`,
      [id_plan]
    );
    return result.rows[0] || null;
  },
};

module.exports = PlanModel;