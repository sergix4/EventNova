// js/models/reporteModel.js
// MODELO de reportes del administrador.
// dashboard(), generales(), comerciales(), cobertura() y operacion() ya traen
// datos REALES de PostgreSQL (GET /api/reportes/dashboard, /generales,
// /comerciales, /cobertura y /operacion).
// perfilAdmin() sigue con datos de ejemplo (tarea 13 «Mi perfil»).

import { peticion } from './api.js'

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']




// ─── Perfil del administrador ───────────────────────────────────────────────
const PERFIL_ADMIN = {
  nombre: 'Alejandro Estrada', correo: 'a.estrada@eventnova.co', identificacion: '1.098.234.567',
  telefono: '+57 310 845 2190', direccion: 'Cra. 7 #32-16, Oficina 504', pais: 'Colombia', departamento: 'Cundinamarca', ciudad: 'Bogotá',
}
const ACTIVIDAD_CUENTA = [
  { actividad: 'Inicio de sesión', fecha: '31 Ago 2026, 08:12', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Consulta de reportes', fecha: '30 Ago 2026, 15:44', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Actualización de perfil', fecha: '28 Ago 2026, 11:20', dispositivo: 'Safari · macOS', estado: 'Exitoso' },
  { actividad: 'Cambio de contraseña', fecha: '20 Ago 2026, 09:05', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Inicio de sesión', fecha: '18 Ago 2026, 07:58', dispositivo: 'Firefox · Ubuntu', estado: 'Fallido' },
  { actividad: 'Inicio de sesión', fecha: '18 Ago 2026, 08:01', dispositivo: 'Firefox · Ubuntu', estado: 'Exitoso' },
  { actividad: 'Consulta de reportes', fecha: '15 Ago 2026, 14:30', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
  { actividad: 'Cierre de sesión', fecha: '14 Ago 2026, 17:00', dispositivo: 'Chrome · Windows 11', estado: 'Exitoso' },
]

export const ReporteModel = {
  MESES,

// Dashboard con datos reales del año elegido en el selector de período
  async dashboard(anio) {
    return peticion(`/reportes/dashboard?anio=${encodeURIComponent(anio)}`)
  },

  // Reporte general con datos reales del año elegido en el selector de período
  async generales(anio) {
    return peticion(`/reportes/generales?anio=${encodeURIComponent(anio)}`)
  },

  // Reportes comerciales con datos reales del año elegido en el selector de período
  async comerciales(anio) {
    return peticion(`/reportes/comerciales?anio=${encodeURIComponent(anio)}`)
  },

  // Cobertura y eventos con datos reales: anio = 2026, 2027… o 'todos'
  async cobertura(anio) {
    return peticion(`/reportes/cobertura?anio=${encodeURIComponent(anio)}`)
  },

  // Reservas y operación con datos reales: anio = 2026, 2027… o 'todos'
  async operacion(anio) {
    return peticion(`/reportes/operacion?anio=${encodeURIComponent(anio)}`)
  },

  async perfilAdmin() {
    return { perfil: { ...PERFIL_ADMIN }, actividad: ACTIVIDAD_CUENTA }
  },
}
