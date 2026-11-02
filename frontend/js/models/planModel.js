// js/models/planModel.js
// MODELO de planes de los agentes: lee la tabla TIPO_PLAN (vía /api/planes).

import { peticion } from './api.js'

export const PlanModel = {
  listar() {
    return peticion('/planes')
  },
}