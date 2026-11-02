// controllers/planController.js
// Sprint 3 · Tarea 5: planes de los agentes (tabla TIPO_PLAN) · /api/planes
// Por ahora solo lista los planes para el selector "Plan" del modal de
// edición de agentes (usuarios.html). La tarea 14 lo puede reutilizar en
// registro.html para dejar de usar la lista fija PLANES del frontend.

const PlanModel = require('../models/planModel');

const planController = {
  // GET /api/planes
  async listar(req, res) {
    try {
      const planes = await PlanModel.listar();
      // NUMERIC llega como texto desde pg: se convierte a número
      res.json(planes.map((p) => ({ ...p, precio_plan: Number(p.precio_plan) })));
    } catch (error) {
      console.error('Error al listar planes:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  },
};

module.exports = planController;