// js/models/reporteModel.js
// MODELO de reportes del administrador.
// dashboard(), generales(), comerciales(), cobertura() y operacion() ya traen
// datos REALES de PostgreSQL (GET /api/reportes/dashboard, /generales,
// /comerciales, /cobertura y /operacion).
// El perfil del administrador ya no está aquí: usa js/models/perfilModel.js (tarea 13).

import { peticion } from "./api.js";

const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const ReporteModel = {
  MESES,

  // Dashboard con datos reales del año elegido en el selector de período
  async dashboard(anio) {
    return peticion(`/reportes/dashboard?anio=${encodeURIComponent(anio)}`);
  },

  // Reporte general con datos reales del año elegido en el selector de período
  async generales(anio) {
    return peticion(`/reportes/generales?anio=${encodeURIComponent(anio)}`);
  },

  // Reportes comerciales con datos reales del año elegido en el selector de período
  async comerciales(anio) {
    return peticion(`/reportes/comerciales?anio=${encodeURIComponent(anio)}`);
  },

  // Cobertura y eventos con datos reales: anio = 2026, 2027… o 'todos'
  async cobertura(anio) {
    return peticion(`/reportes/cobertura?anio=${encodeURIComponent(anio)}`);
  },

  // Reservas y operación con datos reales: anio = 2026, 2027… o 'todos'
  async operacion(anio) {
    return peticion(`/reportes/operacion?anio=${encodeURIComponent(anio)}`);
  },
};
