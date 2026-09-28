// models/planModel.js
// Model de TIPO_PLAN: consultas SQL relacionadas con los planes de los agentes.
// (El CRUD completo de planes queda pendiente para más adelante.)

const pool = require('../config/db');

const PlanModel = {
  // Busca un plan por su nombre (ej. 'Plan Básico')
  async findByNombre(nombre_plan) {
    const result = await pool.query(
      `SELECT id_plan, nombre_plan, precio_plan, limite_evento
       FROM public."TIPO_PLAN" WHERE nombre_plan = $1`,
      [nombre_plan]
    );
    return result.rows[0] || null;
  },
};

module.exports = PlanModel;