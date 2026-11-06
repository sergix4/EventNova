// js/models/planModel.js
// MODELO de planes de los agentes: lee la tabla TIPO_PLAN (vía /api/planes).
// Sprint 3 · Tarea 14: reemplaza la lista fija PLANES de catalogoModel.js.

import { peticion } from "./api.js";

// limite_evento = 9999 en la BD significa "ilimitado" (ver seed_planes.sql)
export const LIMITE_ILIMITADO = 9999;
// Plan que se marca con la cinta "Recomendado"
const PLAN_RECOMENDADO = "Plan Profesional";

const precioCorto = (valor) => "$" + Math.round(valor).toLocaleString("es-CO");
const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

export const PlanModel = {
  /** Filas tal cual vienen de la BD (las usa el modal de agentes del admin) */
  listar() {
    return peticion("/planes");
  },

  /**
   * Planes listos para las tarjetas del registro y del perfil del agente.
   * Los beneficios salen de descripcion_plan, separada por comas:
   * "Hasta 5 eventos activos, gestión de reservas" → ['Hasta 5 eventos activos', 'Gestión de reservas']
   */
  async tarjetas() {
    const filas = await this.listar();
    return filas.map((p) => ({
      id_plan: p.id_plan,
      nombre: p.nombre_plan,
      precioCorto: precioCorto(p.precio_plan),
      precio: precioCorto(p.precio_plan) + " COP",
      limite: p.limite_evento,
      ilimitado: p.limite_evento >= LIMITE_ILIMITADO,
      recomendado: p.nombre_plan === PLAN_RECOMENDADO,
      beneficios: (p.descripcion_plan || "")
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)
        .map(mayuscula),
    }));
  },
};
