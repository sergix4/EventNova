// js/controllers/admin/dashboardController.js
// CONTROLADOR del dashboard del administrador.
// Pide al Modelo las estadísticas REALES del año elegido y se las pasa a la Vista.
// Se vuelve a cargar al cambiar el período o al pulsar "Actualizar datos".

import { iniciarAdmin, periodoActual } from './comunAdminController.js'
import { ReporteModel } from '../../models/reporteModel.js'
import { DashboardView } from '../../views/admin/dashboardView.js'

async function cargar() {
  const anio = periodoActual()
  try {
    const datos = await ReporteModel.dashboard(anio)
    DashboardView.mostrarPeriodos(datos.anios, datos.anio)
    DashboardView.mostrar(datos)
  } catch (error) {
    DashboardView.mostrarError(error.message)
  }
}

await iniciarAdmin('dashboard', { alActualizar: cargar, alCambiarPeriodo: cargar })
DashboardView.mostrarCargando()
cargar()